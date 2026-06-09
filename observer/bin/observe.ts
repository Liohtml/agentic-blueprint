#!/usr/bin/env tsx
/**
 * observer/bin/observe.ts — T8 CLI entry point
 *
 * Usage: observe [--team NAME] [--port N] [--no-open]
 *
 * --team NAME   Team to observe. Omit to auto-select the most recently created team.
 * --port N      HTTP port (default: 4317).
 * --no-open     Do not open a browser window.
 *
 * Starts the HTTP server, prints the URL, and opens a browser window.
 */

import { execFile } from 'node:child_process';
import process from 'node:process';

import { parseTeams } from '../src/collector/teamParser.ts';
import { createServer, DEFAULT_PORT } from '../src/server.ts';

// ---------------------------------------------------------------------------
// Argument parsing (no external deps)
// ---------------------------------------------------------------------------

interface Args {
  team?: string;
  port: number;
  open: boolean;
}

function parseArgs(argv: string[]): Args {
  const args = argv.slice(2); // strip `node` / `tsx` + script path
  let team: string | undefined;
  let port = DEFAULT_PORT;
  let open = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    switch (arg) {
      case '--team': {
        const val = args[i + 1];
        if (!val || val.startsWith('-')) {
          console.error('[observe] --team requires a value');
          process.exit(1);
        }
        team = val;
        i++;
        break;
      }
      case '--port': {
        const val = args[i + 1];
        const n = Number(val);
        if (!val || !Number.isInteger(n) || n < 1 || n > 65535) {
          console.error(`[observe] --port requires an integer 1–65535 (got: ${val ?? ''})`);
          process.exit(1);
        }
        port = n;
        i++;
        break;
      }
      case '--no-open':
        open = false;
        break;
      default:
        console.error(`[observe] Unknown argument: ${arg}`);
        console.error('[observe] Usage: observe [--team NAME] [--port N] [--no-open]');
        process.exit(1);
    }
  }

  return { team, port, open };
}

// ---------------------------------------------------------------------------
// Browser opener
// ---------------------------------------------------------------------------

function openBrowser(url: string): void {
  let cmd: string;
  let cmdArgs: string[];

  switch (process.platform) {
    case 'darwin':
      cmd = 'open';
      cmdArgs = [url];
      break;
    case 'win32':
      cmd = 'cmd';
      cmdArgs = ['/c', 'start', '', url];
      break;
    default: // linux / bsd / wsl
      cmd = 'xdg-open';
      cmdArgs = [url];
  }

  execFile(cmd, cmdArgs, (err) => {
    if (err) {
      console.warn(`[observe] Could not open browser automatically: ${err.message}`);
      console.warn(`[observe] Open manually: ${url}`);
    }
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { team: teamArg, port, open } = parseArgs(process.argv);

  // -- Resolve team name ---------------------------------------------------
  let teamName: string;

  if (teamArg) {
    teamName = teamArg;
  } else {
    let teams: Awaited<ReturnType<typeof parseTeams>>;
    try {
      teams = await parseTeams();
    } catch (err) {
      console.error('[observe] Failed to list teams:', err);
      process.exit(1);
    }

    if (teams.length === 0) {
      console.error('[observe] No teams found in ~/.claude/teams/');
      console.error('[observe] Create a team first, or use --team NAME.');
      process.exit(1);
    }

    if (teams.length === 1) {
      teamName = teams[0]!.name;
    } else {
      // Most recently created is the best proxy for most recently active.
      const sorted = [...teams].sort((a, b) => b.createdAt - a.createdAt);
      teamName = sorted[0]!.name;
      const others = sorted
        .slice(1)
        .map((t) => t.name)
        .join(', ');
      console.log(`[observe] Multiple teams found; using most recent: ${teamName}`);
      console.log(`[observe] Others: ${others}`);
      console.log(`[observe] Pass --team NAME to override.`);
    }
  }

  // -- Start server --------------------------------------------------------
  const server = createServer();

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[observe] Port ${port} is already in use. Try --port N.`);
    } else {
      console.error('[observe] Server error:', err);
    }
    process.exit(1);
  });

  server.listen(port, '127.0.0.1', () => {
    const base = `http://localhost:${port}`;
    const url = `${base}/?team=${encodeURIComponent(teamName)}`;
    console.log(`[observe] Team:   ${teamName}`);
    console.log(`[observe] Server: ${base}`);
    console.log(`[observe] URL:    ${url}`);
    if (open) openBrowser(url);
  });

  // -- Graceful shutdown ---------------------------------------------------
  const shutdown = (): void => {
    console.log('\n[observe] Shutting down…');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err: unknown) => {
  console.error('[observe] Fatal:', err);
  process.exit(1);
});
