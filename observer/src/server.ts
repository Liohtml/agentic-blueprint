/**
 * observer/src/server.ts — T8
 *
 * Node built-in http server (no Express). Routes:
 *
 *   GET /api/teams            → { name, description, createdAt }[]
 *   GET /api/snapshot?team=X  → TeamSnapshot (one-shot JSON)
 *   GET /events?team=X        → SSE stream:
 *                                 event: snapshot\ndata: <TeamSnapshot JSON>\n\n
 *                                 : ping\n\n  (heartbeat every 15 s)
 *   *                         → static files from web/dist (SPA index.html fallback)
 *
 * Default port: 4317.  Use createServer() then server.listen(port, host, cb).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseTeams } from './collector/teamParser.ts';
import { buildSnapshot } from './collector/aggregator.ts';
import { startWatching } from './collector/watcher.ts';
import type { TeamSnapshot } from './types.ts';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_PORT = 4317;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Absolute path to the compiled SPA. Served as static assets. */
const DIST_DIR = path.join(__dirname, '..', 'web', 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
};

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME[ext] ?? 'application/octet-stream';
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function sendJson(res: http.ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendError(res: http.ServerResponse, status: number, message: string): void {
  sendJson(res, status, { error: message });
}

// ---------------------------------------------------------------------------
// Static file handler — serves web/dist with SPA index.html fallback
// ---------------------------------------------------------------------------

function serveStatic(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  urlPath: string,
): void {
  // Sanitise: prevent directory traversal
  const safe = '/' + path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');

  const candidates: string[] =
    safe === '/'
      ? [path.join(DIST_DIR, 'index.html')]
      : [
          path.join(DIST_DIR, safe),
          path.join(DIST_DIR, 'index.html'), // SPA fallback
        ];

  function tryNext(i: number): void {
    if (i >= candidates.length) {
      sendError(res, 404, 'Not found');
      return;
    }
    const filePath = candidates[i]!;
    fs.stat(filePath, (statErr, stat) => {
      if (statErr || !stat.isFile()) {
        tryNext(i + 1);
        return;
      }
      res.writeHead(200, { 'Content-Type': mimeFor(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
  }

  tryNext(0);
}

// ---------------------------------------------------------------------------
// Server factory
// ---------------------------------------------------------------------------

/**
 * Create (but do not start) the HTTP server.
 *
 * ```ts
 * const server = createServer();
 * server.listen(4317, '127.0.0.1', () => console.log('ready'));
 * ```
 */
export function createServer(): http.Server {
  return http.createServer((req, res) => {
    const rawUrl = req.url ?? '/';

    let parsed: URL;
    try {
      parsed = new URL(rawUrl, 'http://localhost');
    } catch {
      sendError(res, 400, 'Bad request');
      return;
    }

    const { pathname } = parsed;

    if (req.method !== 'GET') {
      sendError(res, 405, 'Method not allowed');
      return;
    }

    // ------------------------------------------------------------------
    // GET /api/teams
    // ------------------------------------------------------------------
    if (pathname === '/api/teams') {
      parseTeams()
        .then((teams) =>
          sendJson(
            res,
            200,
            teams.map((t) => ({
              name: t.name,
              description: t.description,
              createdAt: t.createdAt,
            })),
          ),
        )
        .catch((err: unknown) => {
          console.error('[server] /api/teams:', err);
          sendError(res, 500, 'Failed to list teams');
        });
      return;
    }

    // ------------------------------------------------------------------
    // GET /api/snapshot?team=NAME
    // ------------------------------------------------------------------
    if (pathname === '/api/snapshot') {
      const team = parsed.searchParams.get('team');
      if (!team) {
        sendError(res, 400, 'Missing required query param: team');
        return;
      }
      buildSnapshot(team, Date.now())
        .then((snapshot: TeamSnapshot) => sendJson(res, 200, snapshot))
        .catch((err: unknown) => {
          console.error(`[server] /api/snapshot team=${team}:`, err);
          sendError(res, 500, 'Failed to build snapshot');
        });
      return;
    }

    // ------------------------------------------------------------------
    // GET /events?team=NAME  — Server-Sent Events
    // ------------------------------------------------------------------
    if (pathname === '/events') {
      const team = parsed.searchParams.get('team');
      if (!team) {
        sendError(res, 400, 'Missing required query param: team');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // disable nginx proxy buffering
      });
      res.flushHeaders(); // push headers immediately so browser opens the stream

      // Watcher fires only on genuine data change (signature-based diff in T7)
      const stop = startWatching(
        team,
        (snapshot: TeamSnapshot) => {
          try {
            res.write(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`);
          } catch {
            // client already gone; stop() fires on 'close' below
          }
        },
        { intervalMs: 1000 },
      );

      // Heartbeat comment every 15 s — keeps the TCP connection alive through proxies
      const pingInterval = setInterval(() => {
        try {
          res.write(': ping\n\n');
        } catch {
          clearInterval(pingInterval);
        }
      }, 15_000);

      // Tear everything down when the client disconnects
      req.on('close', () => {
        clearInterval(pingInterval);
        stop();
      });

      return;
    }

    // ------------------------------------------------------------------
    // Static files  (web/dist, SPA index.html fallback)
    // ------------------------------------------------------------------
    serveStatic(req, res, pathname);
  });
}
