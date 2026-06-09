/**
 * Tests for observer/src/collector/metrics.ts
 *
 * Covers:
 *  - buildAgentMetrics: status threshold logic (active / idle / done)
 *  - runtimeMs, tokensPerMin calculations
 *  - tasksCompleted/Total filtering by owner
 *  - messagesSent/messagesReceived filtering
 *  - costUsd plumbing (delegates to computeCost)
 */

import { describe, it, expect } from 'vitest';
import {
  buildAgentMetrics,
  ACTIVE_THRESHOLD_MS,
  DONE_INACTIVITY_MS,
} from './metrics.js';
import type {
  AgentTranscriptStats,
  Message,
  Task,
  TeamMember,
  TokenUsage,
} from '../types.js';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const BASE_JOIN_AT = 1_000_000_000_000; // arbitrary epoch ms

const MEMBER: TeamMember = {
  agentId:      'team-lead@konzept-review',
  name:         'team-lead',
  agentType:    'team-lead',
  model:        'claude-opus-4-8[1m]',  // has suffix — should be stripped
  joinedAt:     BASE_JOIN_AT,
  tmuxPaneId:   '',
  cwd:          '/Users/test/project',
  subscriptions: [],
};

/** DATA-NOTES ground-truth token counts for team-lead session d4e9e7cb */
const OPUS_TOKENS: TokenUsage = {
  inputTokens:              55_785,
  outputTokens:             74_981,
  cacheCreationInputTokens: 359_868,
  cacheReadInputTokens:     3_678_142,
};

function makeStats(
  lastActiveAt: number,
  overrides: Partial<AgentTranscriptStats> = {},
): AgentTranscriptStats {
  return {
    sessionId:       'test-session-id',
    model:           'claude-opus-4-8',
    tokens:          OPUS_TOKENS,
    lastActiveAt,
    currentActivity: 'Bash',
    errorCount:      0,
    toolsUsed:       { Bash: 3, Read: 5 },
    thinkingCount:   0,
    activity:        [],
    sentMessages:    [],
    turns:           [],
    ...overrides,
  };
}

const TASKS: Task[] = [
  { id: '1', subject: 'A', description: '', status: 'completed',  owner: 'team-lead', blocks: [], blockedBy: [] },
  { id: '2', subject: 'B', description: '', status: 'in_progress', owner: 'team-lead', blocks: [], blockedBy: [] },
  { id: '3', subject: 'C', description: '', status: 'pending',    owner: 'other',     blocks: [], blockedBy: [] },
];

const MESSAGES: Message[] = [
  { from: 'team-lead', to: 'ux',        text: 'hi',    summary: '', timestamp: 1 },
  { from: 'team-lead', to: 'architekt', text: 'hello', summary: '', timestamp: 2 },
  { from: 'ux',        to: 'team-lead', text: 'yo',    summary: '', timestamp: 3 },
  { from: 'advocatus', to: 'team-lead', text: 'sup',   summary: '', timestamp: 4 },
  { from: 'advocatus', to: 'ux',        text: 'meh',   summary: '', timestamp: 5 },
];

// ---------------------------------------------------------------------------
// Status threshold tests
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — status', () => {
  it('returns "active" when lastActiveAt is within ACTIVE_THRESHOLD_MS', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - ACTIVE_THRESHOLD_MS + 1); // 1 ms inside threshold
    const result = buildAgentMetrics(MEMBER, stats, [], MESSAGES, nowMs);
    expect(result.status).toBe('active');
  });

  it('returns "active" when lastActiveAt === nowMs (just posted)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs);
    const result = buildAgentMetrics(MEMBER, stats, [], MESSAGES, nowMs);
    expect(result.status).toBe('active');
  });

  it('returns "active" at exactly the ACTIVE_THRESHOLD_MS boundary (≤ is active)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - ACTIVE_THRESHOLD_MS); // exactly 60 s
    const result = buildAgentMetrics(MEMBER, stats, [], MESSAGES, nowMs);
    expect(result.status).toBe('active');
  });

  it('returns "idle" when elapsed is between thresholds and tasks not all done', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    // 2 minutes inactive — between 60 s active and 5 min done thresholds
    const stats = makeStats(nowMs - 120_000);
    const result = buildAgentMetrics(MEMBER, stats, TASKS, MESSAGES, nowMs);
    // TASKS has an in_progress task owned by team-lead → not done
    expect(result.status).toBe('idle');
  });

  it('returns "done" when elapsed exceeds DONE_INACTIVITY_MS (session ended)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - DONE_INACTIVITY_MS); // exactly 5 min
    const result = buildAgentMetrics(MEMBER, stats, TASKS, MESSAGES, nowMs);
    expect(result.status).toBe('done');
  });

  it('returns "done" when all owned tasks are completed and none in_progress', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 120_000); // 2 min — idle range
    const allDoneTasks: Task[] = [
      { id: '1', subject: 'X', description: '', status: 'completed', owner: 'team-lead', blocks: [], blockedBy: [] },
      { id: '2', subject: 'Y', description: '', status: 'completed', owner: 'team-lead', blocks: [], blockedBy: [] },
    ];
    const result = buildAgentMetrics(MEMBER, stats, allDoneTasks, MESSAGES, nowMs);
    expect(result.status).toBe('done');
  });

  it('returns "idle" when owned tasks exist but one is still in_progress (not done)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 120_000);
    const mixedTasks: Task[] = [
      { id: '1', subject: 'X', description: '', status: 'completed',  owner: 'team-lead', blocks: [], blockedBy: [] },
      { id: '2', subject: 'Y', description: '', status: 'in_progress', owner: 'team-lead', blocks: [], blockedBy: [] },
    ];
    const result = buildAgentMetrics(MEMBER, stats, mixedTasks, MESSAGES, nowMs);
    expect(result.status).toBe('idle');
  });

  it('returns "idle" when agent has no owned tasks and in idle range', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 120_000);
    const noOwnedTasks: Task[] = [
      { id: '1', subject: 'X', description: '', status: 'completed', owner: 'other', blocks: [], blockedBy: [] },
    ];
    const result = buildAgentMetrics(MEMBER, stats, noOwnedTasks, MESSAGES, nowMs);
    expect(result.status).toBe('idle');
  });

  it('"active" takes precedence over task completion', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    // Active AND all tasks done — should be 'active' (priority: active > done)
    const stats = makeStats(nowMs - 1_000); // 1 s ago
    const allDoneTasks: Task[] = [
      { id: '1', subject: 'X', description: '', status: 'completed', owner: 'team-lead', blocks: [], blockedBy: [] },
    ];
    const result = buildAgentMetrics(MEMBER, stats, allDoneTasks, MESSAGES, nowMs);
    expect(result.status).toBe('active');
  });
});

// ---------------------------------------------------------------------------
// runtimeMs
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — runtimeMs', () => {
  it('equals nowMs − member.joinedAt', () => {
    const nowMs = BASE_JOIN_AT + 7_200_000; // 2 hours later
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.runtimeMs).toBe(7_200_000);
  });
});

// ---------------------------------------------------------------------------
// tokensPerMin
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — tokensPerMin', () => {
  it('equals (input + output) / (runtimeMs / 60_000)', () => {
    const runtimeMs = 60_000; // exactly 1 minute
    const nowMs     = BASE_JOIN_AT + runtimeMs;
    const stats     = makeStats(nowMs - 5_000); // recently active
    const result    = buildAgentMetrics(MEMBER, stats, [], [], nowMs);

    const expected = (OPUS_TOKENS.inputTokens + OPUS_TOKENS.outputTokens) / 1;
    expect(result.tokensPerMin).toBeCloseTo(expected, 4);
  });

  it('scales correctly with 2 minutes of runtime', () => {
    const runtimeMs = 120_000;
    const nowMs     = BASE_JOIN_AT + runtimeMs;
    const stats     = makeStats(nowMs - 5_000);
    const result    = buildAgentMetrics(MEMBER, stats, [], [], nowMs);

    const expected = (OPUS_TOKENS.inputTokens + OPUS_TOKENS.outputTokens) / 2;
    expect(result.tokensPerMin).toBeCloseTo(expected, 4);
  });
});

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — tasks', () => {
  it('counts only tasks owned by this agent', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, TASKS, [], nowMs);
    // TASKS: ids 1+2 owned by 'team-lead', id 3 by 'other'
    expect(result.tasksTotal).toBe(2);
    expect(result.tasksCompleted).toBe(1);
  });

  it('returns 0/0 when agent owns no tasks', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.tasksTotal).toBe(0);
    expect(result.tasksCompleted).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — messages', () => {
  it('counts messages sent by this agent (from === name)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], MESSAGES, nowMs);
    // team-lead sent 2 messages (to ux, to architekt)
    expect(result.messagesSent).toBe(2);
  });

  it('counts messages received by this agent (to === name)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], MESSAGES, nowMs);
    // team-lead received 2 messages (from ux, from advocatus)
    expect(result.messagesReceived).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// costUsd
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — costUsd', () => {
  it('is > 0 for non-zero token usage', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.costUsd).toBeGreaterThan(0);
  });

  it('opus ground-truth total is plausible (>$5, <$50)', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.costUsd).toBeGreaterThan(5);
    expect(result.costUsd).toBeLessThan(50);
  });
});

// ---------------------------------------------------------------------------
// Model normalisation
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — model field', () => {
  it('uses stats.model (already normalised) over member.model suffix', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000, { model: 'claude-opus-4-8' });
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    // stats.model wins; member.model has [1m] which should not appear
    expect(result.model).toBe('claude-opus-4-8');
    expect(result.model).not.toContain('[');
  });
});

// ---------------------------------------------------------------------------
// Passthrough fields
// ---------------------------------------------------------------------------
describe('buildAgentMetrics — passthrough fields', () => {
  it('passes toolsUsed and errorCount from stats', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000, {
      toolsUsed:  { Read: 10, Bash: 2 },
      errorCount: 3,
    });
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.toolsUsed).toEqual({ Read: 10, Bash: 2 });
    expect(result.errorCount).toBe(3);
  });

  it('passes currentActivity from stats', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000, { currentActivity: 'thinking' });
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.currentActivity).toBe('thinking');
  });

  it('passes lastActiveAt from stats', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const last  = nowMs - 15_000;
    const stats = makeStats(last);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.lastActiveAt).toBe(last);
  });

  it('passes agentId and name from member', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.agentId).toBe('team-lead@konzept-review');
    expect(result.name).toBe('team-lead');
  });

  it('assigns a non-empty hex color', () => {
    const nowMs = BASE_JOIN_AT + 3_600_000;
    const stats = makeStats(nowMs - 30_000);
    const result = buildAgentMetrics(MEMBER, stats, [], [], nowMs);
    expect(result.color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

// ---------------------------------------------------------------------------
// Threshold constants — sanity
// ---------------------------------------------------------------------------
describe('exported threshold constants', () => {
  it('ACTIVE_THRESHOLD_MS is 60 000 (1 minute)', () => {
    expect(ACTIVE_THRESHOLD_MS).toBe(60_000);
  });

  it('DONE_INACTIVITY_MS is 300 000 (5 minutes)', () => {
    expect(DONE_INACTIVITY_MS).toBe(300_000);
  });

  it('DONE_INACTIVITY_MS > ACTIVE_THRESHOLD_MS (thresholds do not overlap)', () => {
    expect(DONE_INACTIVITY_MS).toBeGreaterThan(ACTIVE_THRESHOLD_MS);
  });
});
