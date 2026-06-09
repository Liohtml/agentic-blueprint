/**
 * observer/src/collector/watcher.ts — T7
 *
 * startWatching(team, onSnapshot, opts?) → stop()
 *
 * Polls the team's data sources on an interval and calls `onSnapshot` ONLY when the
 * underlying data actually changed (a stable, canonical-JSON diff that ignores the
 * purely time-derived fields generatedAt / runtimeMs / tokensPerMin — those advance
 * every tick and would otherwise fire the callback continuously).
 *
 * Transcripts are read INCREMENTALLY via T5's createSessionTracker: each tick only the
 * bytes appended since the previous tick are parsed, never the whole .jsonl. The cheap
 * JSON sources (config, tasks, inboxes) are small and simply re-read each tick.
 *
 * Robustness: every source is wrapped in try/catch and the tick itself is fully
 * guarded, so one malformed file (or a transient race while a file is being written)
 * can never crash the polling loop. Session topology is re-discovered periodically so
 * agents that join after startup eventually appear.
 */

import { buildEdges, parseMessages } from './inboxParser.ts';
import { parseTasks } from './taskParser.ts';
import { parseTeam } from './teamParser.ts';
import {
  resolveSessions,
  createSessionTracker,
  type SessionInfo,
  type SessionTracker,
} from './transcriptParser.ts';
import { assembleSnapshot, resolveLeadName } from './aggregator.ts';

import type {
  AgentTranscriptStats,
  CommEdge,
  Message,
  Task,
  TeamInfo,
  TeamSnapshot,
} from '../types.ts';

export interface WatchOptions {
  /** Poll cadence in ms. Default 1000. */
  intervalMs?: number;
  /**
   * How often (ms) to re-scan for newly-joined sessions/agents and re-read config.
   * Session discovery reads the head of every transcript, so it runs less often than
   * the per-tick incremental token poll. Default 15000.
   */
  rescanIntervalMs?: number;
}

/** Call to stop watching and release timers. Idempotent. */
export type StopFn = () => void;

interface TrackerEntry {
  tracker: SessionTracker;
  agentName: string;
}

/**
 * Begin watching `team`. Returns a `stop()` function.
 *
 * The first snapshot is delivered as soon as the initial poll completes; subsequent
 * snapshots arrive only on genuine change.
 */
export function startWatching(
  team: string,
  onSnapshot: (snapshot: TeamSnapshot) => void,
  opts: WatchOptions = {},
): StopFn {
  const intervalMs = opts.intervalMs ?? 1000;
  const rescanEvery = Math.max(
    1,
    Math.round((opts.rescanIntervalMs ?? 15_000) / intervalMs),
  );

  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let prevSig = '';
  let tickCount = 0;

  let teamInfo: TeamInfo | null = null;
  // sessionId → { tracker, agentName }. Trackers persist across ticks so each .poll()
  // only reads newly-appended transcript bytes (incremental).
  const trackers = new Map<string, TrackerEntry>();

  /** Re-read config and discover sessions; register a tracker for any new session. */
  async function refreshTopology(): Promise<void> {
    teamInfo = await parseTeam(team);

    let sessions: SessionInfo[] = [];
    try {
      sessions = resolveSessions(teamInfo);
    } catch {
      sessions = [];
    }

    for (const s of sessions) {
      const existing = trackers.get(s.sessionId);
      if (existing) {
        existing.agentName = s.agentName; // keep name fresh
        continue;
      }
      try {
        trackers.set(s.sessionId, {
          tracker: createSessionTracker(s.filePath, s.sessionId),
          agentName: s.agentName,
        });
      } catch {
        // skip a session we cannot open yet
      }
    }
  }

  async function tick(): Promise<void> {
    if (stopped) return;

    try {
      // Periodically (and on the very first tick) re-discover sessions + config.
      if (teamInfo === null || tickCount % rescanEvery === 0) {
        try {
          await refreshTopology();
        } catch {
          // keep whatever topology we already had
        }
      }
      tickCount++;

      if (teamInfo) {
        // Incremental per-session stats — reads only appended bytes this tick.
        const statsByAgent = new Map<string, AgentTranscriptStats>();
        for (const { tracker, agentName } of trackers.values()) {
          try {
            const stats = tracker.poll();
            const prev = statsByAgent.get(agentName);
            if (!prev || stats.lastActiveAt >= prev.lastActiveAt) {
              statsByAgent.set(agentName, stats);
            }
          } catch {
            // skip a momentarily-unreadable transcript
          }
        }

        // Cheap JSON sources — re-read each tick.
        let tasks: Task[] = [];
        try {
          tasks = await parseTasks(team);
        } catch {
          tasks = [];
        }
        let messages: Message[] = [];
        try {
          messages = await parseMessages(team);
        } catch {
          messages = [];
        }
        let edges: CommEdge[] = [];
        try {
          edges = buildEdges(messages);
        } catch {
          edges = [];
        }

        const agentNameBySessionId = new Map<string, string>();
        for (const [sessionId, entry] of trackers) {
          agentNameBySessionId.set(sessionId, entry.agentName);
        }
        const leadAgentName = resolveLeadName(teamInfo, agentNameBySessionId);

        // Live clock per tick (NOT at module scope) — see aggregator docs.
        const nowMs = Date.now();
        const snapshot = assembleSnapshot(
          teamInfo,
          statsByAgent,
          leadAgentName,
          tasks,
          messages,
          edges,
          nowMs,
        );

        const sig = snapshotSignature(snapshot);
        if (sig !== prevSig) {
          prevSig = sig;
          try {
            onSnapshot(snapshot);
          } catch {
            // a throwing consumer must not kill the loop
          }
        }
      }
    } catch {
      // belt-and-braces: never let a tick crash the polling loop
    } finally {
      if (!stopped) {
        timer = setTimeout(() => {
          void tick();
        }, intervalMs);
      }
    }
  }

  // Kick off immediately; the first change-detected snapshot fires ASAP.
  void tick();

  return function stop(): void {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

// ---------------------------------------------------------------------------
// Change detection
// ---------------------------------------------------------------------------

/**
 * Canonical (recursively key-sorted) JSON, so object key ordering never produces a
 * spurious diff.
 */
function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(src).sort()) {
      out[key] = sortKeys(src[key]);
    }
    return out;
  }
  return value;
}

/**
 * Signature used for change detection. Excludes fields that advance with wall-clock
 * time on every tick (generatedAt, and per-agent runtimeMs / tokensPerMin) so the
 * callback fires only on genuine data changes — including meaningful status
 * transitions (active → idle → done), which DO change the signature.
 */
function snapshotSignature(snapshot: TeamSnapshot): string {
  const reduced = {
    team: { name: snapshot.team.name, memberCount: snapshot.team.members.length },
    agents: snapshot.agents.map((a) => ({ ...a, runtimeMs: 0, tokensPerMin: 0 })),
    tasks: snapshot.tasks,
    messages: snapshot.messages,
    edges: snapshot.edges,
    totals: snapshot.totals,
  };
  return canonicalJson(reduced);
}
