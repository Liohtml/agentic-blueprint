/**
 * CostBreakdown — stacked bar chart showing per-agent input/output/cache cost.
 * Props come strictly from observer/src/types.ts (CostBreakdownProps).
 *
 * Since AgentMetrics only exposes costUsd (total) + tokens (counts), segment
 * proportions are derived using approximate relative token rates — clearly
 * labelled as estimates. Bar widths are scaled to actual agent.costUsd values.
 */
import type { CostBreakdownProps, AgentMetrics } from '../../../../src/types'

// Approximate relative cost rates (per token, not absolute). These encode the
// shape of the cost breakdown: output tokens dominate, cache-read is cheap.
// ⚠️  Ratios only — not billing rates. Update in T6 (metrics/cost) for accuracy.
const RATE = {
  input: 15.0,
  output: 75.0,
  cacheWrite: 18.75,
  cacheRead: 1.5,
}

interface Segments {
  input: number
  output: number
  cacheWrite: number
  cacheRead: number
}

function computeSegments(agent: AgentMetrics): Segments {
  const t = agent.tokens
  const raw = {
    input: t.inputTokens * RATE.input,
    output: t.outputTokens * RATE.output,
    cacheWrite: t.cacheCreationInputTokens * RATE.cacheWrite,
    cacheRead: t.cacheReadInputTokens * RATE.cacheRead,
  }
  const total = raw.input + raw.output + raw.cacheWrite + raw.cacheRead
  if (total === 0) return { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 }
  return {
    input: raw.input / total,
    output: raw.output / total,
    cacheWrite: raw.cacheWrite / total,
    cacheRead: raw.cacheRead / total,
  }
}

const SEGMENT_COLORS = {
  input: 'bg-sky-500',
  output: 'bg-emerald-500',
  cacheWrite: 'bg-amber-500',
  cacheRead: 'bg-violet-500',
}

const SEGMENT_LABELS: Record<keyof Segments, string> = {
  input: 'Input',
  output: 'Output',
  cacheWrite: 'Cache write',
  cacheRead: 'Cache read',
}

function formatUsd(v: number): string {
  if (v >= 1) return `$${v.toFixed(2)}`
  if (v >= 0.01) return `$${v.toFixed(3)}`
  return `$${v.toFixed(4)}`
}

export default function CostBreakdown({ agents, totals }: CostBreakdownProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 gap-2">
        <svg
          className="w-8 h-8 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="text-slate-500 text-sm">No cost data yet</span>
      </div>
    )
  }

  const maxCost = Math.max(...agents.map((a) => a.costUsd), 0.0001)

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        {(Object.keys(SEGMENT_LABELS) as Array<keyof Segments>).map((key) => (
          <span key={key} className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${SEGMENT_COLORS[key]}`} />
            {SEGMENT_LABELS[key]}
          </span>
        ))}
        <span className="ml-auto text-slate-500 italic">
          ⚠ segment proportions estimated
        </span>
      </div>

      {/* Per-agent rows */}
      {agents
        .slice()
        .sort((a, b) => b.costUsd - a.costUsd)
        .map((agent) => {
          const segments = computeSegments(agent)
          const barPct = (agent.costUsd / maxCost) * 100

          return (
            <div key={agent.agentId} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: agent.color }}
                  />
                  <span className="text-slate-300 font-medium">{agent.name}</span>
                </span>
                <span className="text-slate-400 font-mono">{formatUsd(agent.costUsd)}</span>
              </div>

              {/* Stacked bar */}
              <div className="relative h-5 bg-slate-800 rounded overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 flex"
                  style={{ width: `${barPct}%` }}
                >
                  {(Object.keys(SEGMENT_LABELS) as Array<keyof Segments>).map((key) => (
                    <div
                      key={key}
                      className={`h-full ${SEGMENT_COLORS[key]} transition-all`}
                      style={{ width: `${segments[key] * 100}%` }}
                      title={`${SEGMENT_LABELS[key]}: ${(segments[key] * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}

      {/* Total footer */}
      <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
        <span>Total ({agents.length} agents)</span>
        <span className="font-mono font-semibold text-slate-200">
          {formatUsd(totals.totalCostUsd)}
        </span>
      </div>
    </div>
  )
}
