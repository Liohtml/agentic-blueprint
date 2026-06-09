/**
 * observer/src/types.ts — shared type contract
 *
 * Frozen during the initial parallel build (T1→T10). Now Lead-maintained: amended
 * in one coordinated pass post-merge to add the detail-insight types (ActivityEvent,
 * SentMessage, TurnDuration) and the per-agent feeds that surface "what each agent is
 * actually doing". Derived from DATA-NOTES.md (real Claude Code file shapes, 2026-06-09).
 */

// ---------------------------------------------------------------------------
// Token / cost primitives
// ---------------------------------------------------------------------------

/** Raw usage counters from an assistant JSONL line's `message.usage` field. */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** Tokens written to cache (premium rate). Field: cache_creation_input_tokens */
  cacheCreationInputTokens: number;
  /** Tokens read from cache (discount rate). Field: cache_read_input_tokens */
  cacheReadInputTokens: number;
}

/** Per-category cost in USD for a single agent or the whole team. */
export interface CostBreakdown {
  inputCostUsd: number;
  outputCostUsd: number;
  cacheWriteCostUsd: number;
  cacheReadCostUsd: number;
  totalCostUsd: number;
}

// ---------------------------------------------------------------------------
// Tool use
// ---------------------------------------------------------------------------

/** One tool_use block extracted from message.content[]. */
export interface ToolUse {
  name: string;
  input: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Detail-insight feeds (post-merge contract amendment)
//
// These are extracted from the SAME per-message content[] loop the parser already
// walks, then surfaced so the dashboard answers "what is the agent DOING", not just
// "how much". All three are stored as HARD-CAPPED ring buffers (see *_CAP below) so
// the SSE payload — which re-serialises the whole snapshot every change — stays small.
// Privacy: labels are redacted by default (basenames, truncated commands); raw message
// bodies and tool-RESULT payloads (file contents / Bash stdout) NEVER enter these.
// ---------------------------------------------------------------------------

/** Max events kept per agent in each ring buffer (newest-last). */
export const ACTIVITY_CAP = 30;
export const SENT_MESSAGES_CAP = 30;
export const TURNS_CAP = 20;

/**
 * One entry in an agent's chronological activity feed, in transcript content[] order
 * (NOT re-sorted by line timestamp). `kind` buckets the block; `label` is a single
 * redacted human-readable line.
 */
export interface ActivityEvent {
  /** Unix ms (the enclosing assistant line's timestamp). */
  ts: number;
  /** 'say' | 'think' | 'read' | 'write' | 'edit' | 'bash' | 'send' | 'search' | 'task' | 'tool'. */
  kind: string;
  /** Redacted one-liner: basename for paths, truncated command, "→to: summary" for sends. */
  label: string;
}

/**
 * One message an agent SENT, reconstructed from a `SendMessage` tool_use block.
 * Durable: survives the inbox delivery-queue being consumed (fixes finding F2).
 * Carries only metadata + summary — never the full body.
 */
export interface SentMessage {
  ts: number;
  to: string;
  /** 'message' | 'shutdown_response' | … (from SendMessage input.type). */
  type: string;
  summary: string;
  /** Length of the body, so the UI can show size without shipping the content. */
  bodyLength: number;
}

/** One real turn latency from a transcript `subtype:"turn_duration"` system line. */
export interface TurnDuration {
  ts: number;
  /** Milliseconds the turn took (durationMs). */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Transcript-derived stats (T5 output, T6 input)
// ---------------------------------------------------------------------------

/**
 * Per-agent stats produced by the transcript parser (T5).
 * Accumulated from all assistant lines in the session JSONL.
 */
export interface AgentTranscriptStats {
  sessionId: string;
  /** Normalised model id — strip any `[1m]` suffix before storing. */
  model: string;
  tokens: TokenUsage;
  /** Unix ms of the most recent assistant message timestamp. */
  lastActiveAt: number;
  /**
   * Name of the last tool_use seen in the most recent assistant message.
   * Falls back to "responding" (stop_reason end_turn) or "thinking" (otherwise).
   */
  currentActivity: string;
  /**
   * Error count heuristic:
   *  - system lines whose text contains "error" (case-insensitive)
   *  - user lines whose content[] contains a tool_result with is_error === true
   */
  errorCount: number;
  /** Map of tool name → invocation count across the whole session. */
  toolsUsed: Record<string, number>;
  /** Count of `thinking` content blocks (their text is empty — only the count is useful). */
  thinkingCount: number;
  /** Chronological activity feed, capped to ACTIVITY_CAP (newest-last). */
  activity: ActivityEvent[];
  /** Durable log of messages this agent sent, capped to SENT_MESSAGES_CAP. */
  sentMessages: SentMessage[];
  /** Real per-turn latencies, capped to TURNS_CAP. */
  turns: TurnDuration[];
}

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

/** Derived status for an agent (from transcript recency, NOT config.isActive). */
export type AgentStatus = 'active' | 'idle' | 'done';

/**
 * Fully resolved metrics for a single agent.
 * Merges config.json members[], inbox discovery, and transcript stats.
 */
export interface AgentMetrics {
  agentId: string;
  name: string;
  /** Deterministic hex color derived from name hash → agent palette. */
  color: string;
  /** Normalised model id (no `[1m]` suffix). */
  model: string;
  /** agentType from config, or empty string when discovered from inbox only. */
  role: string;
  status: AgentStatus;
  /** Wall-clock ms from joinedAt to lastActiveAt (or now if active). */
  runtimeMs: number;
  /** Last tool name or "responding"/"thinking". */
  currentActivity: string;
  /** Unix ms. */
  lastActiveAt: number;
  tokens: TokenUsage;
  /** Total USD cost for this agent. */
  costUsd: number;
  /** (inputTokens + outputTokens) / runtimeMs * 60_000. */
  tokensPerMin: number;
  tasksCompleted: number;
  tasksTotal: number;
  /** Count of messages in outgoing inbox files (where from === name). */
  messagesSent: number;
  /** Count of messages in this agent's inbox file. */
  messagesReceived: number;
  /** Map of tool name → invocation count. */
  toolsUsed: Record<string, number>;
  errorCount: number;
  /** Number of thinking blocks (reasoning happened, but its text is not retained). */
  thinkingCount: number;
  /** Chronological activity feed (redacted labels), capped to ACTIVITY_CAP. */
  activity: ActivityEvent[];
  /** Durable outbound message log, capped to SENT_MESSAGES_CAP. */
  sentMessages: SentMessage[];
  /** Real per-turn latencies, capped to TURNS_CAP. */
  turns: TurnDuration[];
}

/**
 * A task entry from `~/.claude/tasks/{team}/{n}.json`.
 * Skip `.lock`, `.highwatermark`, and non-numeric filenames.
 */
export interface Task {
  id: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  /** Empty string when unassigned. */
  owner?: string;
  blocks: string[];
  blockedBy: string[];
}

/**
 * One message parsed from `~/.claude/teams/{team}/inboxes/{name}.json`.
 * `to` is synthesised from the filename (basename without .json).
 * `timestamp` is converted from ISO string to Unix ms.
 */
export interface Message {
  from: string;
  /** Recipient — derived from inbox filename. */
  to: string;
  /** Full message body. */
  text: string;
  /** Short preview. */
  summary: string;
  /** Unix ms (parsed from ISO-8601 string). */
  timestamp: number;
  /** Sender's display color, if provided. */
  color?: string;
  read?: boolean;
}

/** Directed communication edge between two agents. */
export interface CommEdge {
  from: string;
  to: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Team config shapes (mirrors config.json exactly per DATA-NOTES.md)
// ---------------------------------------------------------------------------

/** One entry in config.json members[]. */
export interface TeamMember {
  agentId: string;
  name: string;
  agentType: string;
  /** May carry a `[1m]` suffix — strip before pricing. */
  model: string;
  /** Unix ms. */
  joinedAt: number;
  /** Often empty string. */
  tmuxPaneId: string;
  cwd: string;
  subscriptions: unknown[];
}

/** Shape of `~/.claude/teams/{team}/config.json`. */
export interface TeamInfo {
  name: string;
  description: string;
  /** Unix ms. */
  createdAt: number;
  leadAgentId: string;
  leadSessionId: string;
  /**
   * Partial — may contain only the lead. T2 must union with inbox/transcript
   * discovery to build a full agent list.
   */
  members: TeamMember[];
}

// ---------------------------------------------------------------------------
// Aggregated snapshot (server → frontend)
// ---------------------------------------------------------------------------

/** Totals across all agents for display in header / summary cards. */
export interface SnapshotTotals {
  agentCount: number;
  activeAgents: number;
  totalCostUsd: number;
  /** Sum of inputTokens + outputTokens across all agents. */
  totalTokens: number;
  tasksCompleted: number;
  tasksTotal: number;
  messagesExchanged: number;
}

/**
 * The full point-in-time snapshot pushed over SSE.
 * Consumers should treat this as immutable and replace on each event.
 */
export interface TeamSnapshot {
  team: TeamInfo;
  /** Unix ms when this snapshot was assembled. */
  generatedAt: number;
  agents: AgentMetrics[];
  tasks: Task[];
  messages: Message[];
  edges: CommEdge[];
  totals: SnapshotTotals;
}

// ---------------------------------------------------------------------------
// SSE event types (server → client)
// ---------------------------------------------------------------------------

export interface SnapshotEvent {
  type: 'snapshot';
  data: TeamSnapshot;
}

export interface SseErrorEvent {
  type: 'error';
  message: string;
}

export interface PingEvent {
  type: 'ping';
  /** Unix ms. */
  timestamp: number;
}

export type SseEvent = SnapshotEvent | SseErrorEvent | PingEvent;

// ---------------------------------------------------------------------------
// Frontend component prop interfaces
// (T9/T10 must implement components that accept exactly these props)
// ---------------------------------------------------------------------------

/** Single agent status card. */
export interface AgentCardProps {
  agent: AgentMetrics;
}

/** Responsive grid of AgentCards. */
export interface AgentGridProps {
  agents: AgentMetrics[];
  /** Called when the user clicks a card; optional highlight. */
  onSelect?: (agentId: string) => void;
  selectedAgentId?: string;
}

/**
 * uPlot time-series chart of token throughput.
 * Each series corresponds to one agent.
 */
export interface TokenTimelineProps {
  agents: AgentMetrics[];
  /**
   * Ordered array of [unixSeconds, cumulativeTokens] tuples per agent.
   * Array order matches `agents` order.
   */
  seriesData: Array<Float64Array | number[]>;
  /** Common x-axis timestamps in Unix seconds. */
  timestamps: Float64Array | number[];
}

/** Cost breakdown per agent (bar chart / table). */
export interface CostBreakdownProps {
  agents: AgentMetrics[];
  totals: SnapshotTotals;
}

/** Kanban / list view of tasks with optional agent assignment display. */
export interface TaskBoardProps {
  tasks: Task[];
  agents: AgentMetrics[];
}

/**
 * Directed graph (force-layout or arc diagram) of agent–agent messages.
 * Edge thickness ∝ CommEdge.count.
 */
export interface MessageGraphProps {
  edges: CommEdge[];
  agents: AgentMetrics[];
  /** Width in px; defaults to container width if undefined. */
  width?: number;
  /** Height in px. */
  height?: number;
}
