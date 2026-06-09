/**
 * Tests for observer/src/collector/aggregator.ts (+ a light watcher liveness check).
 *
 *  - assembleSnapshot (pure): the config↔transcript UNION, role derivation, lead-first
 *    sort, and totals — fully hermetic, no filesystem.
 *  - buildSnapshot: integration against the real konzept-review team when present
 *    (asserts the 4 verified agents with nonzero tokens); skipped gracefully otherwise.
 *  - startWatching: returns a working stop(); delivers at least one snapshot for real data.
 */

import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

import { assembleSnapshot, resolveLeadName, buildSnapshot } from './aggregator.ts';
import { startWatching } from './watcher.ts';
import type {
  AgentTranscriptStats,
  Message,
  Task,
  TeamInfo,
  TeamSnapshot,
} from '../types.ts';

// ---------------------------------------------------------------------------
// Fixtures for the hermetic assembleSnapshot tests
// ---------------------------------------------------------------------------

const NOW = 1_750_000_000_000;

const TEAM: TeamInfo = {
  name: 'demo',
  description: 'hermetic fixture',
  createdAt: NOW - 30 * 60_000,
  leadAgentId: 'team-lead@demo',
  leadSessionId: 'sess-lead',
  // Config lists ONLY the lead — architekt & ux exist only as transcripts.
  members: [
    {
      agentId: 'team-lead@demo',
      name: 'team-lead',
      agentType: 'team-lead',
      model: 'claude-opus-4-8[1m]',
      joinedAt: NOW - 30 * 60_000,
      tmuxPaneId: '',
      cwd: '/home/u/proj',
      subscriptions: [],
    },
  ],
};

function stats(over: Partial<AgentTranscriptStats>): AgentTranscriptStats {
  return {
    sessionId: 's',
    model: 'claude-opus-4-8',
    tokens: {
      inputTokens: 100,
      outputTokens: 50,
      cacheCreationInputTokens: 0,
      cacheReadInputTokens: 0,
    },
    lastActiveAt: NOW - 1_000,
    currentActivity: 'thinking',
    errorCount: 0,
    toolsUsed: {},
    ...over,
  };
}

function buildStatsMap(): Map<string, AgentTranscriptStats> {
  return new Map<string, AgentTranscriptStats>([
    ['team-lead', stats({ sessionId: 'sess-lead', lastActiveAt: NOW - 1_000 })], // active
    ['architekt', stats({ sessionId: 'sess-a', tokens: { inputTokens: 200, outputTokens: 80, cacheCreationInputTokens: 0, cacheReadInputTokens: 0 }, lastActiveAt: NOW - 10 * 60_000 })], // done (>5m)
    ['ux', stats({ sessionId: 'sess-u', tokens: { inputTokens: 40, outputTokens: 10, cacheCreationInputTokens: 0, cacheReadInputTokens: 0 }, lastActiveAt: NOW - 2 * 60_000 })], // idle
  ]);
}

const TASKS: Task[] = [
  { id: '1', subject: 't1', description: '', status: 'completed', owner: 'ux', blocks: [], blockedBy: [] },
  { id: '2', subject: 't2', description: '', status: 'in_progress', owner: 'architekt', blocks: [], blockedBy: [] },
];

const MESSAGES: Message[] = [
  { from: 'architekt', to: 'team-lead', text: 'hi', summary: 'hi', timestamp: NOW - 5_000 },
  { from: 'team-lead', to: 'ux', text: 'go', summary: 'go', timestamp: NOW - 4_000 },
];

// ---------------------------------------------------------------------------
// assembleSnapshot — hermetic
// ---------------------------------------------------------------------------

describe('assembleSnapshot', () => {
  const lead = resolveLeadName(
    TEAM,
    new Map([['sess-lead', 'team-lead']]),
  );
  const snap = assembleSnapshot(TEAM, buildStatsMap(), lead, TASKS, MESSAGES, [], NOW);

  it('UNIONs config members with transcript-only agents', () => {
    expect(snap.agents).toHaveLength(3);
    const names = snap.agents.map((a) => a.name);
    expect(new Set(names)).toEqual(new Set(['team-lead', 'architekt', 'ux']));
  });

  it('orders lead first, then alphabetical', () => {
    expect(snap.agents.map((a) => a.name)).toEqual(['team-lead', 'architekt', 'ux']);
  });

  it('derives role: team-lead → lead, others → member', () => {
    const byName = Object.fromEntries(snap.agents.map((a) => [a.name, a]));
    expect(byName['team-lead'].role).toBe('lead');
    expect(byName['architekt'].role).toBe('member');
    expect(byName['ux'].role).toBe('member');
  });

  it('synthesises agentId + carries tokens for transcript-only agents', () => {
    const arch = snap.agents.find((a) => a.name === 'architekt')!;
    expect(arch.agentId).toBe('architekt@demo');
    expect(arch.tokens.inputTokens).toBe(200);
    expect(arch.tokens.outputTokens).toBe(80);
  });

  it('fills totals correctly', () => {
    expect(snap.totals.agentCount).toBe(3);
    // tokens: lead 150 + architekt 280 + ux 50 = 480
    expect(snap.totals.totalTokens).toBe(480);
    expect(snap.totals.activeAgents).toBe(1); // only the lead is within the active window
    expect(snap.totals.tasksTotal).toBe(2);
    expect(snap.totals.tasksCompleted).toBe(1);
    expect(snap.totals.messagesExchanged).toBe(2);
    expect(snap.totals.totalCostUsd).toBeGreaterThan(0);
  });

  it('stamps generatedAt with the injected nowMs', () => {
    expect(snap.generatedAt).toBe(NOW);
  });
});

// ---------------------------------------------------------------------------
// buildSnapshot + watcher — real konzept-review data (skipped if absent)
// ---------------------------------------------------------------------------

const KONZEPT_CONFIG = join(homedir(), '.claude', 'teams', 'konzept-review', 'config.json');
const HAS_KONZEPT = existsSync(KONZEPT_CONFIG);

describe.skipIf(!HAS_KONZEPT)('buildSnapshot (real konzept-review)', () => {
  it('returns the 4 verified agents, each with nonzero tokens', async () => {
    const snap = await buildSnapshot('konzept-review', Date.now());

    const names = snap.agents.map((a) => a.name).sort();
    // Verified ground truth (DATA-NOTES §D): team-lead, architekt, ux, advocatus.
    expect(names).toEqual(['advocatus', 'architekt', 'team-lead', 'ux']);
    expect(snap.agents).toHaveLength(4);

    for (const a of snap.agents) {
      const total = a.tokens.inputTokens + a.tokens.outputTokens;
      expect(total, `${a.name} should have nonzero tokens`).toBeGreaterThan(0);
    }

    expect(snap.totals.totalTokens).toBeGreaterThan(0);
    expect(snap.totals.totalCostUsd).toBeGreaterThan(0);
    expect(snap.agents.filter((a) => a.role === 'lead')).toHaveLength(1);
  });
});

describe('startWatching', () => {
  it('returns a stop() that is safe to call (no real data required)', () => {
    const stop = startWatching('definitely-not-a-real-team', () => {}, {
      intervalMs: 1000,
    });
    expect(typeof stop).toBe('function');
    expect(() => stop()).not.toThrow();
    expect(() => stop()).not.toThrow(); // idempotent
  });

  it.skipIf(!HAS_KONZEPT)('delivers at least one snapshot for real data', async () => {
    const snap = await new Promise<TeamSnapshot>((resolve, reject) => {
      const to = setTimeout(() => {
        stop();
        reject(new Error('no snapshot within 5s'));
      }, 5_000);
      const stop = startWatching(
        'konzept-review',
        (s) => {
          clearTimeout(to);
          stop();
          resolve(s);
        },
        { intervalMs: 200 },
      );
    });
    expect(snap.agents.length).toBeGreaterThanOrEqual(4);
  }, 10_000);
});
