import type { AgentCardProps, AgentStatus } from '../../../src/types'

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function fmtRuntime(ms: number): string {
  const totalSec = Math.floor(ms / 1_000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min >= 60) {
    return `${Math.floor(min / 60)}h ${min % 60}m`
  }
  return `${min}:${String(sec).padStart(2, '0')}`
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function fmtCost(usd: number): string {
  if (usd >= 10) return `$${usd.toFixed(2)}`
  if (usd >= 1) return `$${usd.toFixed(3)}`
  return `$${usd.toFixed(4)}`
}

function fmtRate(tpm: number): string {
  if (tpm >= 1_000) return `${(tpm / 1_000).toFixed(1)}K`
  return String(Math.round(tpm))
}

function fmtClock(ts: number): string {
  if (!ts) return '--:--:--'
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function fmtDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

// kind → short tag + colour, used by the activity feed
const KIND_META: Record<string, { tag: string; cls: string }> = {
  read: { tag: 'read', cls: 'text-sky-400' },
  write: { tag: 'write', cls: 'text-violet-400' },
  edit: { tag: 'edit', cls: 'text-amber-400' },
  bash: { tag: 'bash', cls: 'text-emerald-400' },
  send: { tag: 'send', cls: 'text-pink-400' },
  search: { tag: 'search', cls: 'text-cyan-400' },
  task: { tag: 'task', cls: 'text-blue-400' },
  say: { tag: 'say', cls: 'text-slate-400' },
  think: { tag: 'think', cls: 'text-slate-600' },
  tool: { tag: 'tool', cls: 'text-slate-400' },
}

// ---------------------------------------------------------------------------
// Status dot
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: AgentStatus }) {
  const base = 'inline-block h-2.5 w-2.5 rounded-full flex-shrink-0'
  const variants: Record<AgentStatus, string> = {
    active: `${base} bg-emerald-500 shadow-[0_0_6px_2px] shadow-emerald-500/60 animate-pulse`,
    idle: `${base} bg-amber-400 shadow-[0_0_4px_1px] shadow-amber-400/50`,
    done: `${base} bg-slate-500`,
  }
  return <span className={variants[status]} />
}

// ---------------------------------------------------------------------------
// AgentCard
// ---------------------------------------------------------------------------

export default function AgentCard({ agent }: AgentCardProps) {
  // Top-6 tools by invocation count
  const topTools = Object.entries(agent.toolsUsed)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const cacheTotal =
    agent.tokens.cacheReadInputTokens + agent.tokens.cacheCreationInputTokens

  const statusLabel: Record<AgentStatus, string> = {
    active: 'active',
    idle: 'idle',
    done: 'done',
  }

  // Activity feed: newest first, capped for the card.
  const feed = (agent.activity ?? []).slice(-8).reverse()
  const turns = agent.turns ?? []
  const lastTurnMs = turns.length > 0 ? turns[turns.length - 1].durationMs : null
  const sentCount = (agent.sentMessages ?? []).filter(m => m.type === 'message').length

  return (
    <article
      className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-4 transition-colors hover:border-slate-700"
      style={{ borderLeftColor: agent.color, borderLeftWidth: 3 }}
    >
      {/* ── Header row ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusDot status={agent.status} />
          <span className="font-semibold text-sm text-slate-100 truncate">
            {agent.name}
          </span>
          <span
            className="text-[10px] font-mono px-1.5 py-px rounded leading-none border"
            style={{ color: agent.color, borderColor: `${agent.color}40` }}
          >
            {statusLabel[agent.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            {agent.model}
          </span>
          <span className="text-xs font-mono text-slate-500">
            {fmtRuntime(agent.runtimeMs)}
          </span>
        </div>
      </div>

      {/* ── Activity feed (what the agent is actually doing) ───────── */}
      <div className="mb-3 rounded-lg bg-slate-950/50 border border-slate-800/70 px-2 py-1.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-600">activity</span>
          <span className="text-[9px] font-mono text-slate-600">
            ▶ {agent.currentActivity}
          </span>
        </div>
        {feed.length === 0 ? (
          <p className="text-[11px] text-slate-600 font-mono py-1">no recorded activity yet</p>
        ) : (
          <ul className="space-y-0.5 max-h-28 overflow-y-auto">
            {feed.map((ev, i) => {
              const meta = KIND_META[ev.kind] ?? KIND_META.tool
              return (
                <li key={i} className="flex items-baseline gap-1.5 text-[11px] leading-tight font-mono">
                  <span className="text-slate-600 tabular-nums flex-shrink-0">{fmtClock(ev.ts)}</span>
                  <span className={`${meta.cls} flex-shrink-0 w-10`}>{meta.tag}</span>
                  <span className="text-slate-300 truncate">
                    {ev.label || (ev.kind === 'think' ? '…' : '')}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ── Token grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-slate-800/60 rounded-lg py-1.5 px-1">
          <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">in</p>
          <p className="text-xs font-mono text-sky-400">{fmtTokens(agent.tokens.inputTokens)}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg py-1.5 px-1">
          <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">out</p>
          <p className="text-xs font-mono text-violet-400">{fmtTokens(agent.tokens.outputTokens)}</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg py-1.5 px-1">
          <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">cache</p>
          <p className="text-xs font-mono text-emerald-400">{fmtTokens(cacheTotal)}</p>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs mb-3 gap-1 flex-wrap">
        <span className="font-mono font-semibold text-amber-400">{fmtCost(agent.costUsd)}</span>
        <span className="text-slate-400 font-mono">{fmtRate(agent.tokensPerMin)}<span className="text-slate-600">/min</span></span>
        <span className="text-slate-400">
          tasks <span className="text-slate-200">{agent.tasksCompleted}</span>
          <span className="text-slate-600">/{agent.tasksTotal}</span>
        </span>
        <span className="text-slate-400 font-mono" title="messages sent (durable) ↑ / received ↓">
          <span className="text-slate-300">↑{sentCount || agent.messagesSent}</span>{' '}
          <span className="text-slate-300">↓{agent.messagesReceived}</span>
        </span>
        {lastTurnMs != null && (
          <span className="text-slate-400 font-mono" title="last turn latency">
            ⏱{fmtDuration(lastTurnMs)}
          </span>
        )}
        {agent.thinkingCount > 0 && (
          <span className="text-slate-500 font-mono text-[10px]" title="thinking blocks">
            ∴{agent.thinkingCount}
          </span>
        )}
        {agent.errorCount > 0 && (
          <span className="text-red-400 font-mono text-[10px]">
            ✕{agent.errorCount}
          </span>
        )}
      </div>

      {/* ── Tool chips ─────────────────────────────────────────────── */}
      {topTools.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topTools.map(([toolName, count]) => (
            <span
              key={toolName}
              className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono leading-tight"
            >
              {toolName}
              <span className="text-slate-500 ml-0.5">{count}</span>
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
