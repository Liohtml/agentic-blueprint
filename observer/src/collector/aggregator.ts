/**
 * observer/src/collector/aggregator.ts — T7
 *
 * Orchestrates every collector (T2–T6) into a single {@link TeamSnapshot}.
 *
 *   buildSnapshot(team, nowMs):
 *     1. parseTeam            (T2) → TeamInfo (config.json, partial members[])
 *     2. resolveSessions      (T5) → discovered {sessionId, agentName, filePath}[]
 *        + parseTranscriptFile(T5) → per-session AgentTranscriptStats
 *     3. parseTasks           (T3) → Task[]
 *     4. parseMessages        (T4) → Message[]  +  buildEdges → CommEdge[]
 *     5. buildAgentMetrics    (T6) → AgentMetrics  (called per agent)
 *
 * CRITICAL — the agent UNION:
 *   The live config.json frequently lists only the lead even though several agents
 *   exist (verified: konzept-review lists 1 member but runs 4 agents). So the agent
 *   roster is the UNION of config members[] AND every transcript session that resolves
 *   to an agent name. Agents discovered only from a transcript get a synthesised
 *   TeamMember so {@link buildAgentMetrics} can still run.
 *
 * `nowMs` is injected (never Date.now() at module scope) so snapshots are deterministic
 * and testable. The watcher passes its own per-tick clock.
 *
 * Pure-ish: the only side effects are filesystem reads performed by the imported
 * parsers; this module adds none of its own and never throws — every source is wrapped
 * so one unreadable file degrades that slice to empty rather than failing the snapshot.
 */

import { buildEdges, parseMessages } from './inboxParser.ts';
import { parseTasks } from './taskParser.ts';
import { parseTeam } from './teamParser.ts';
import {
  resolveSessions,
  parseTranscriptFile,
  type SessionInfo,
} from './transcriptParser.ts';
import { buildAgentMetrics } from './metrics.ts';

import type {
  AgentMetrics,
  AgentTranscriptStats,
  CommEdge,
  Message,
  SnapshotTotals,
  Task,
  TeamInfo,
  TeamMember,
  TeamSnapshot,
} from '../types.ts';

// ---------------------------------------------------------------------------
// Helpers (exported where the watcher / tests reuse them)
// ---------------------------------------------------------------------------

/** Zeroed stats for an agent that exists in config but has no transcript yet. */
function emptyStats(): AgentTranscriptStats {
  return {
    sessionId: '',
    model: '',
    tokens: {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationInputTokens: 0,
      cacheReadInputTokens: 0,
    },
    lastActiveAt: 0,
    currentActivity: 'idle',
    errorCount: 0,
    toolsUsed: {},
  };
}

/**
 * Synthesise a TeamMember for an agent discovered only from a transcript (i.e. not
 * present in config.json members[]). joinedAt falls back to the team's createdAt so
 * runtimeMs stays sane; model is left empty so buildAgentMetrics adopts the
 * transcript-derived (already-normalised) model.
 */
function synthMember(name: string, team: TeamInfo): TeamMember {
  return {
    agentId: `${name}@${team.name}`,
    name,
    agentType: '', // role is overridden after buildAgentMetrics (see assembleSnapshot)
    model: '',
    joinedAt: team.createdAt,
    tmuxPaneId: '',
    cwd: team.members[0]?.cwd ?? '',
    subscriptions: [],
  };
}

/**
 * Resolve the lead agent's display name. Prefers the agent name attached to the
 * lead session id; falls back to the config member flagged as lead.
 *
 * @param agentNameBySessionId map of sessionId → resolved agent name (built by the
 *        caller from resolveSessions output or from the watcher's live trackers).
 */
export function resolveLeadName(
  team: TeamInfo,
  agentNameBySessionId: Map<string, string>,
): string {
  const fromSession = agentNameBySessionId.get(team.leadSessionId);
  if (fromSession) return fromSession;
  const member = team.members.find(
    (m) => m.agentId === team.leadAgentId || m.agentType === 'team-lead',
  );
  return member?.name ?? 'team-lead';
}

/**
 * Pure assembly step shared by {@link buildSnapshot} (one-shot) and the watcher
 * (incremental). Performs the config↔transcript UNION, derives role, runs T6's
 * buildAgentMetrics per agent, sorts (lead first, then by name) and fills totals.
 *
 * `statsByAgent` maps agent name → its transcript stats. Agents present in either
 * `team.members` or `statsByAgent` are emitted exactly once.
 */
export function assembleSnapshot(
  team: TeamInfo,
  statsByAgent: Map<string, AgentTranscriptStats>,
  leadAgentName: string,
  tasks: Task[],
  messages: Message[],
  edges: CommEdge[],
  nowMs: number,
): TeamSnapshot {
  const memberByName = new Map<string, TeamMember>();
  for (const m of team.members) memberByName.set(m.name, m);

  // UNION of config members and transcript-discovered agents.
  const names = new Set<string>();
  for (const m of team.members) names.add(m.name);
  for (const name of statsByAgent.keys()) names.add(name);

  const agents: AgentMetrics[] = [];
  for (const name of names) {
    const member = memberByName.get(name) ?? synthMember(name, team);
    const stats = statsByAgent.get(name) ?? emptyStats();
    const metrics = buildAgentMetrics(member, stats, tasks, messages, nowMs);
    // role: 'team-lead' agentType (or the resolved lead) → 'lead', everything else 'member'.
    metrics.role =
      name === leadAgentName || member.agentType === 'team-lead' ? 'lead' : 'member';
    agents.push(metrics);
  }

  // Stable, UI-friendly ordering: lead first, then alphabetical by name.
  agents.sort((a, b) => {
    const ar = a.role === 'lead' ? 0 : 1;
    const br = b.role === 'lead' ? 0 : 1;
    if (ar !== br) return ar - br;
    return a.name.localeCompare(b.name);
  });

  const totals: SnapshotTotals = {
    agentCount: agents.length,
    activeAgents: agents.filter((a) => a.status === 'active').length,
    totalCostUsd: agents.reduce((s, a) => s + a.costUsd, 0),
    totalTokens: agents.reduce(
      (s, a) => s + a.tokens.inputTokens + a.tokens.outputTokens,
      0,
    ),
    tasksCompleted: tasks.filter((t) => t.status === 'completed').length,
    tasksTotal: tasks.length,
    messagesExchanged: messages.length,
  };

  return {
    team,
    generatedAt: nowMs,
    agents,
    tasks,
    messages,
    edges,
    totals,
  };
}

// ---------------------------------------------------------------------------
// Public one-shot entry point
// ---------------------------------------------------------------------------

/**
 * Build a complete point-in-time snapshot for `team`.
 *
 * @param team  team id (directory name under ~/.claude/teams).
 * @param nowMs current wall-clock in Unix ms — injected for determinism.
 *
 * Reads the whole of each transcript once (use the watcher for incremental polling).
 * Never throws: each data source is isolated so a single bad file degrades that slice
 * to empty rather than failing the whole snapshot.
 */
export async function buildSnapshot(team: string, nowMs: number): Promise<TeamSnapshot> {
  // 1. Team config (partial members[]).
  const teamInfo = await parseTeam(team);

  // 2. Discover sessions, then fold each transcript into per-agent stats.
  let sessions: SessionInfo[] = [];
  try {
    sessions = resolveSessions(teamInfo);
  } catch {
    sessions = [];
  }

  const statsByAgent = new Map<string, AgentTranscriptStats>();
  for (const s of sessions) {
    try {
      const stats = parseTranscriptFile(s.filePath, s.sessionId);
      // If an agent somehow owns multiple sessions, keep the most recently active.
      const prev = statsByAgent.get(s.agentName);
      if (!prev || stats.lastActiveAt >= prev.lastActiveAt) {
        statsByAgent.set(s.agentName, stats);
      }
    } catch {
      // skip an unreadable transcript
    }
  }

  // 3. Tasks.
  let tasks: Task[] = [];
  try {
    tasks = await parseTasks(team);
  } catch {
    tasks = [];
  }

  // 4. Messages + comm edges.
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

  // 5. Lead resolution + assembly (UNION, role, totals).
  const agentNameBySessionId = new Map<string, string>();
  for (const s of sessions) agentNameBySessionId.set(s.sessionId, s.agentName);
  const leadAgentName = resolveLeadName(teamInfo, agentNameBySessionId);

  return assembleSnapshot(
    teamInfo,
    statsByAgent,
    leadAgentName,
    tasks,
    messages,
    edges,
    nowMs,
  );
}
