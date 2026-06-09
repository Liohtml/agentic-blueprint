/**
 * observer/src/collector/transcriptParser.ts — T5
 *
 * Parses Claude Code session transcripts (`~/.claude/projects/{encoded-cwd}/{sessionId}.jsonl`)
 * into per-agent {@link AgentTranscriptStats}. Built against the VERIFIED real shapes
 * documented in observer/DATA-NOTES.md §D (validated live: the summed tokens produced here
 * match the ground-truth table exactly for all four konzept-review sessions).
 *
 * Public surface (consumed by the watcher, T7):
 *   - encodeCwd(cwd)                  → project-dir name
 *   - resolveSessions(team, opts?)    → [{ sessionId, agentName, filePath }]
 *   - createTranscriptReader(path)    → stateful incremental line reader (.update())
 *   - createStatsAccumulator(id)      → stateful aggregator (.add(lines), .stats())
 *   - createSessionTracker(path, id)  → reader + accumulator (.poll() → AgentTranscriptStats)
 *   - parseTranscriptFile(path, id?)  → one-shot whole-file parse → AgentTranscriptStats
 *
 * Types come from the frozen ../types contract. NOTE: the task brief mentioned a
 * `firstActivityAt`, but `AgentTranscriptStats` in types.ts does not declare it, so it is
 * intentionally not emitted here — the frozen contract wins.
 */

import {
  existsSync,
  openSync,
  readSync,
  closeSync,
  statSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

import type { AgentTranscriptStats, TokenUsage, TeamInfo } from '../types.ts';

// ---------------------------------------------------------------------------
// Public result shape for session discovery
// ---------------------------------------------------------------------------

/** One discovered transcript: which agent owns it and where it lives. */
export interface SessionInfo {
  sessionId: string;
  agentName: string;
  filePath: string;
}

/** Options for {@link resolveSessions} (lets tests point at a fixture root). */
export interface ResolveSessionsOptions {
  /** Root that holds `{encoded-cwd}` dirs. Default: `~/.claude/projects`. */
  projectsDir?: string;
}

// ---------------------------------------------------------------------------
// Raw line shape (loosely typed — JSONL is heterogeneous)
// ---------------------------------------------------------------------------

/** A single parsed JSONL line. Only the fields we read are described. */
interface RawLine {
  type?: string;
  timestamp?: string;
  sessionId?: string;
  // system lines
  level?: string;
  content?: unknown;
  hookErrors?: unknown;
  // user / assistant
  message?: {
    role?: string;
    model?: string;
    stop_reason?: string;
    content?: unknown;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
  };
  [k: string]: unknown;
}

// ---------------------------------------------------------------------------
// encodeCwd / project dir resolution
// ---------------------------------------------------------------------------

/**
 * Encode a cwd the way Claude Code names its project dirs: every `/` and `.`
 * becomes `-`. e.g. `/Users/x/fitness-coach` → `-Users-x-fitness-coach`.
 */
export function encodeCwd(cwd: string): string {
  return cwd.replace(/[/.]/g, '-');
}

/** Default location of the Claude Code projects directory. */
export function defaultProjectsDir(): string {
  return join(homedir(), '.claude', 'projects');
}

// ---------------------------------------------------------------------------
// resolveSessions
// ---------------------------------------------------------------------------

const DU_BIST_RE = /Du bist "([^"]+)"/;

/** Flatten a `message.content` (string | block[]) into plain text for regex. */
function contentToText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((b) =>
        b && typeof b === 'object' && typeof (b as { text?: unknown }).text === 'string'
          ? (b as { text: string }).text
          : '',
      )
      .join('\n');
  }
  return '';
}

/** Read just enough of a jsonl to find its first `type:"user"` line body. */
function firstUserMessageText(filePath: string): string | null {
  // Files are large; read incrementally and stop at the first user line.
  if (!existsSync(filePath)) return null;
  const reader = createTranscriptReader(filePath);
  // One full pass is fine for discovery (called once per session at startup).
  const lines = reader.update();
  for (const line of lines) {
    if (line.type === 'user') {
      return contentToText(line.message?.content);
    }
  }
  return null;
}

/** Resolve the lead agent's display name from a team's members list. */
function leadName(team: TeamInfo): string {
  const byId = team.members.find((m) => m.agentId === team.leadAgentId);
  if (byId) return byId.name;
  const byName = team.members.find((m) => m.name === 'team-lead');
  if (byName) return byName.name;
  return 'team-lead';
}

/**
 * Discover every session transcript belonging to `team` and map each to an agent.
 *
 * - Project dirs come from encoding each member `cwd` (deduped).
 * - The session whose id === `team.leadSessionId` is the lead.
 * - Every other `*.jsonl` whose first `type:"user"` body matches `Du bist "{name}"`
 *   AND references this team's name is a teammate session for `{name}`.
 *   (The team-name guard avoids picking up sessions from other teams that happen to
 *   share a cwd.)
 *
 * Files that match neither rule are ignored. Returns lead first, then teammates.
 */
export function resolveSessions(team: TeamInfo, opts: ResolveSessionsOptions = {}): SessionInfo[] {
  const projectsDir = opts.projectsDir ?? defaultProjectsDir();

  // Dedupe encoded project dirs across all member cwds.
  const dirs = new Set<string>();
  for (const m of team.members) {
    if (m.cwd) dirs.add(encodeCwd(m.cwd));
  }
  // If config only lists the lead and they have no cwd, we still try nothing —
  // callers should ensure at least one member cwd. (Live config always has the lead's.)

  const out: SessionInfo[] = [];
  const seen = new Set<string>(); // sessionIds already emitted

  for (const dirName of dirs) {
    const dirPath = join(projectsDir, dirName);
    if (!existsSync(dirPath)) continue;

    let entries: string[];
    try {
      entries = readdirSync(dirPath);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.endsWith('.jsonl')) continue;
      const sessionId = entry.slice(0, -'.jsonl'.length);
      if (seen.has(sessionId)) continue;
      const filePath = join(dirPath, entry);

      if (sessionId === team.leadSessionId) {
        seen.add(sessionId);
        out.push({ sessionId, agentName: leadName(team), filePath });
        continue;
      }

      const body = firstUserMessageText(filePath);
      if (!body) continue;
      const match = DU_BIST_RE.exec(body);
      if (!match) continue;
      // Guard against cross-team contamination sharing a cwd.
      if (team.name && !body.includes(team.name)) continue;

      seen.add(sessionId);
      out.push({ sessionId, agentName: match[1], filePath });
    }
  }

  // Lead first (stable, predictable ordering for the UI), then teammates by name.
  out.sort((a, b) => {
    const al = a.sessionId === team.leadSessionId ? 0 : 1;
    const bl = b.sessionId === team.leadSessionId ? 0 : 1;
    if (al !== bl) return al - bl;
    return a.agentName.localeCompare(b.agentName);
  });

  return out;
}

// ---------------------------------------------------------------------------
// Incremental reader
// ---------------------------------------------------------------------------

/** Stateful incremental JSONL reader returned by {@link createTranscriptReader}. */
export interface TranscriptReader {
  /**
   * Read everything appended since the last call and return the newly-completed,
   * fully-parsed lines. Buffers a trailing partial line internally. If the file
   * shrank (rotation/truncation), resets to the start and re-reads from offset 0.
   */
  update(): RawLine[];
  /** Current byte offset (exposed for tests / diagnostics). */
  readonly offset: number;
}

const NEWLINE = 0x0a;
const READ_CHUNK = 1 << 20; // 1 MiB per readSync

/**
 * Create a stateful reader holding a byte offset. Designed to be polled by the
 * watcher (T7) once per tick: each `.update()` returns only the lines that became
 * complete since the previous call.
 *
 * UTF-8 safety: the partial-line remainder is kept as raw bytes (a Buffer), not a
 * string, so a multibyte character split across two reads is never corrupted.
 */
export function createTranscriptReader(filePath: string): TranscriptReader {
  let offset = 0;
  let leftover = Buffer.alloc(0);

  function update(): RawLine[] {
    if (!existsSync(filePath)) return [];

    let size: number;
    try {
      size = statSync(filePath).size;
    } catch {
      return [];
    }

    // File shrank (rotation/truncation) → start over.
    if (size < offset) {
      offset = 0;
      leftover = Buffer.alloc(0);
    }
    if (size === offset) return [];

    const fd = openSync(filePath, 'r');
    const chunks: Buffer[] = [leftover];
    try {
      let pos = offset;
      while (pos < size) {
        const len = Math.min(READ_CHUNK, size - pos);
        const buf = Buffer.allocUnsafe(len);
        const bytesRead = readSync(fd, buf, 0, len, pos);
        if (bytesRead <= 0) break;
        chunks.push(bytesRead === len ? buf : buf.subarray(0, bytesRead));
        pos += bytesRead;
      }
      offset = pos;
    } finally {
      closeSync(fd);
    }

    const combined = Buffer.concat(chunks);
    const lastNl = combined.lastIndexOf(NEWLINE);
    if (lastNl < 0) {
      // No complete line yet — keep buffering.
      leftover = combined;
      return [];
    }

    const completeText = combined.subarray(0, lastNl + 1).toString('utf8');
    leftover = combined.subarray(lastNl + 1);

    const out: RawLine[] = [];
    for (const raw of completeText.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      try {
        out.push(JSON.parse(line) as RawLine);
      } catch {
        // Skip malformed/partial JSON defensively.
      }
    }
    return out;
  }

  return {
    update,
    get offset() {
      return offset;
    },
  };
}

// ---------------------------------------------------------------------------
// Stats aggregation
// ---------------------------------------------------------------------------

/** Strip any bracketed suffix (e.g. `[1m]`) from a model id. */
export function normalizeModel(model: string | undefined): string {
  if (!model) return '';
  return model.replace(/\[[^\]]*\]/g, '').trim();
}

/** Last tool_use name in a content array, or null. */
function lastToolUseName(content: unknown): string | null {
  if (!Array.isArray(content)) return null;
  let name: string | null = null;
  for (const b of content) {
    if (b && typeof b === 'object' && (b as { type?: string }).type === 'tool_use') {
      const n = (b as { name?: unknown }).name;
      if (typeof n === 'string') name = n;
    }
  }
  return name;
}

/**
 * Does a `type:"system"` line denote an error? Heuristic (DATA-NOTES §D):
 *   - explicit `level === "error"`, OR
 *   - a string `content` field containing "error" (case-insensitive), OR
 *   - a non-empty `hookErrors` array.
 * We deliberately do NOT scan the raw JSON for the substring "error", because the
 * benign `hookErrors:[]` key would otherwise over-count every stop-hook line.
 */
function systemLineIsError(line: RawLine): boolean {
  if (typeof line.level === 'string' && line.level.toLowerCase() === 'error') return true;
  if (typeof line.content === 'string' && /error/i.test(line.content)) return true;
  if (Array.isArray(line.hookErrors) && line.hookErrors.length > 0) return true;
  return false;
}

/**
 * Count tool_result blocks with `is_error === true` inside a user line's content[].
 */
function userLineErrorCount(line: RawLine): number {
  const content = line.message?.content;
  if (!Array.isArray(content)) return 0;
  let n = 0;
  for (const b of content) {
    if (
      b &&
      typeof b === 'object' &&
      (b as { type?: string }).type === 'tool_result' &&
      (b as { is_error?: unknown }).is_error === true
    ) {
      n++;
    }
  }
  return n;
}

/** Stateful aggregator returned by {@link createStatsAccumulator}. */
export interface StatsAccumulator {
  /** Fold a batch of raw lines into the running totals. */
  add(lines: RawLine[]): void;
  /** Snapshot the current {@link AgentTranscriptStats}. */
  stats(): AgentTranscriptStats;
}

/**
 * Create a stateful accumulator. Feed it raw lines (from a reader) incrementally;
 * `.stats()` returns the current aggregate at any time. All line types are accepted:
 * assistant lines drive tokens/tools/activity; system + user lines drive errorCount.
 */
export function createStatsAccumulator(sessionId: string): StatsAccumulator {
  const tokens: TokenUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationInputTokens: 0,
    cacheReadInputTokens: 0,
  };
  const toolsUsed: Record<string, number> = {};
  let model = '';
  let lastActiveAt = 0;
  let errorCount = 0;
  let resolvedSessionId = sessionId;

  // currentActivity is derived from the most-recent assistant message only.
  let latestTs = -Infinity;
  let currentActivity = 'thinking';

  function add(lines: RawLine[]): void {
    for (const line of lines) {
      const type = line.type;

      if (type === 'system') {
        if (systemLineIsError(line)) errorCount++;
        continue;
      }

      if (type === 'user') {
        errorCount += userLineErrorCount(line);
        continue;
      }

      if (type !== 'assistant') continue;

      // ---- assistant line ----
      if (!resolvedSessionId && typeof line.sessionId === 'string') {
        resolvedSessionId = line.sessionId;
      }

      const usage = line.message?.usage;
      if (usage) {
        tokens.inputTokens += usage.input_tokens ?? 0;
        tokens.outputTokens += usage.output_tokens ?? 0;
        tokens.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
        tokens.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
      }

      const m = normalizeModel(line.message?.model);
      if (m) model = m;

      const content = line.message?.content;
      if (Array.isArray(content)) {
        for (const b of content) {
          if (b && typeof b === 'object' && (b as { type?: string }).type === 'tool_use') {
            const n = (b as { name?: unknown }).name;
            if (typeof n === 'string') toolsUsed[n] = (toolsUsed[n] ?? 0) + 1;
          }
        }
      }

      const ts = line.timestamp ? Date.parse(line.timestamp) : NaN;
      if (!Number.isNaN(ts)) {
        if (ts > lastActiveAt) lastActiveAt = ts;
        if (ts >= latestTs) {
          latestTs = ts;
          const tool = lastToolUseName(content);
          if (tool) currentActivity = tool;
          else currentActivity =
            line.message?.stop_reason === 'end_turn' ? 'responding' : 'thinking';
        }
      }
    }
  }

  function stats(): AgentTranscriptStats {
    return {
      sessionId: resolvedSessionId,
      model,
      tokens: { ...tokens },
      lastActiveAt,
      currentActivity,
      errorCount,
      toolsUsed: { ...toolsUsed },
    };
  }

  return { add, stats };
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

/** A reader + accumulator bound together. Returned by {@link createSessionTracker}. */
export interface SessionTracker {
  readonly sessionId: string;
  /** Read newly-appended lines and return the up-to-date aggregate stats. */
  poll(): AgentTranscriptStats;
}

/**
 * Bind an incremental reader to an accumulator for one session. The watcher (T7)
 * holds one of these per discovered {@link SessionInfo} and calls `.poll()` each tick.
 */
export function createSessionTracker(filePath: string, sessionId: string): SessionTracker {
  const reader = createTranscriptReader(filePath);
  const acc = createStatsAccumulator(sessionId);
  return {
    sessionId,
    poll(): AgentTranscriptStats {
      acc.add(reader.update());
      return acc.stats();
    },
  };
}

/**
 * One-shot: read an entire transcript file and return its aggregate stats.
 * `sessionId` defaults to the filename stem when omitted.
 */
export function parseTranscriptFile(filePath: string, sessionId?: string): AgentTranscriptStats {
  const id =
    sessionId ?? filePath.replace(/^.*[/\\]/, '').replace(/\.jsonl$/, '');
  const tracker = createSessionTracker(filePath, id);
  return tracker.poll();
}
