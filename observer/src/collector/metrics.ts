/**
 * observer/src/collector/metrics.ts
 *
 * Pure function that merges config.json member data, transcript stats, tasks,
 * and messages into a fully resolved AgentMetrics snapshot.
 *
 * No filesystem access — all inputs are injected (testable, side-effect-free).
 */

import type {
  AgentMetrics,
  AgentStatus,
  AgentTranscriptStats,
  Message,
  Task,
  TeamMember,
} from '../types.js';
import { computeCost, normalizeModelId } from './pricing.js';

// ---------------------------------------------------------------------------
// Status thresholds (exported for tests and documentation)
// ---------------------------------------------------------------------------

/**
 * If (nowMs − lastActiveAt) ≤ ACTIVE_THRESHOLD_MS the agent is 'active'.
 * Default: 60 000 ms (1 minute).
 */
export const ACTIVE_THRESHOLD_MS = 60_000;

/**
 * If (nowMs − lastActiveAt) ≥ DONE_INACTIVITY_MS the session is considered
 * ended and the agent is 'done' regardless of task state.
 * Default: 300 000 ms (5 minutes).
 */
export const DONE_INACTIVITY_MS = 300_000;

// ---------------------------------------------------------------------------
// Helpers (not exported — implementation details)
// ---------------------------------------------------------------------------

/**
 * Derive a deterministic hex colour from an agent name.
 * Uses a djb2-variant hash mapped onto a fixed 8-colour palette so the same
 * name always resolves to the same colour within a session.
 */
function nameToColor(name: string): string {
  const PALETTE = [
    '#4ade80', // green
    '#60a5fa', // blue
    '#f472b6', // pink
    '#fb923c', // orange
    '#a78bfa', // violet
    '#34d399', // emerald
    '#fbbf24', // amber
    '#f87171', // red
  ];
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    // djb2: hash = hash * 33 XOR char
    hash = ((hash << 5) + hash) ^ name.charCodeAt(i);
    // keep within 32-bit signed integer range
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * Derive the agent's status from recency and task state.
 *
 * Priority (highest → lowest):
 *   1. 'active'  — lastActiveAt within ACTIVE_THRESHOLD_MS of nowMs
 *   2. 'done'    — lastActiveAt older than DONE_INACTIVITY_MS  (session ended)
 *   3. 'done'    — agent has ≥1 owned task AND all are 'completed'
 *                  (none 'in_progress')
 *   4. 'idle'    — everything else
 */
function deriveStatus(
  lastActiveAt: number,
  nowMs: number,
  ownedTasks: Task[],
): AgentStatus {
  const elapsed = nowMs - lastActiveAt;

  if (elapsed <= ACTIVE_THRESHOLD_MS) {
    return 'active';
  }

  if (elapsed >= DONE_INACTIVITY_MS) {
    return 'done';
  }

  // Task-based completion check
  if (ownedTasks.length > 0) {
    const noneInProgress = !ownedTasks.some(t => t.status === 'in_progress');
    const allCompleted   =  ownedTasks.every(t => t.status === 'completed');
    if (allCompleted && noneInProgress) {
      return 'done';
    }
  }

  return 'idle';
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Build a fully resolved AgentMetrics snapshot for a single agent.
 *
 * @param member   - Entry from config.json members[] (may have [1m] in model).
 * @param stats    - Transcript-derived stats produced by the T5 parser.
 *                   `stats.model` is already normalised.
 * @param tasks    - All Task objects for the team; filtered internally by owner.
 * @param messages - All Message objects parsed from inboxes; filtered by name.
 * @param nowMs    - Current time as Unix ms (inject for deterministic tests).
 *
 * Pure function — no side effects, no filesystem access.
 */
export function buildAgentMetrics(
  member: TeamMember,
  stats: AgentTranscriptStats,
  tasks: Task[],
  messages: Message[],
  nowMs: number,
): AgentMetrics {
  const name = member.name;

  // ── Runtime ─────────────────────────────────────────────────────────────
  // Wall-clock time from agent join to now (not lastActiveAt, per spec).
  const runtimeMs = nowMs - member.joinedAt;

  // ── Task metrics ─────────────────────────────────────────────────────────
  const ownedTasks     = tasks.filter(t => (t.owner ?? '') === name);
  const tasksTotal     = ownedTasks.length;
  const tasksCompleted = ownedTasks.filter(t => t.status === 'completed').length;

  // ── Status ──────────────────────────────────────────────────────────────
  const status = deriveStatus(stats.lastActiveAt, nowMs, ownedTasks);

  // ── Token throughput ─────────────────────────────────────────────────────
  // tokensPerMin = (inputTokens + outputTokens) / (runtimeMs / 60_000)
  const activeTokens  = stats.tokens.inputTokens + stats.tokens.outputTokens;
  const runtimeMins   = runtimeMs / 60_000;
  const tokensPerMin  = runtimeMins > 0 ? activeTokens / runtimeMins : 0;

  // ── Messages ─────────────────────────────────────────────────────────────
  // messagesSent     — this agent appears as `from` in ANY inbox file
  // messagesReceived — messages delivered to this agent's inbox (to === name)
  const messagesSent     = messages.filter(m => m.from === name).length;
  const messagesReceived = messages.filter(m => m.to   === name).length;

  // ── Cost ─────────────────────────────────────────────────────────────────
  // stats.model is already normalised; member.model may carry [1m] suffix.
  const model    = stats.model || normalizeModelId(member.model);
  const costInfo = computeCost(stats.tokens, model);

  return {
    agentId:          member.agentId,
    name,
    color:            nameToColor(name),
    model,
    role:             member.agentType,
    status,
    runtimeMs,
    currentActivity:  stats.currentActivity,
    lastActiveAt:     stats.lastActiveAt,
    tokens:           stats.tokens,
    costUsd:          costInfo.totalCostUsd,
    tokensPerMin,
    tasksCompleted,
    tasksTotal,
    messagesSent,
    messagesReceived,
    toolsUsed:        stats.toolsUsed,
    errorCount:       stats.errorCount,
  };
}
