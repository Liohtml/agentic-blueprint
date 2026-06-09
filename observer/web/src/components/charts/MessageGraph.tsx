/**
 * MessageGraph — SVG directed-graph of agent-to-agent communication.
 * Agents are placed on a circle; edges are weighted by CommEdge.count.
 * No external graph library required — pure SVG.
 * Props come strictly from observer/src/types.ts (MessageGraphProps).
 */
import type { MessageGraphProps } from '../../../../src/types'

const NODE_R = 22      // node circle radius (px)
const CURVE_K = 0.35  // bezier control-point pull factor (fraction of AB distance)
const MIN_STROKE = 1  // minimum edge stroke width
const MAX_STROKE = 5  // maximum edge stroke width

/** Linear scale edge count → stroke width. */
function edgeStroke(count: number, maxCount: number): number {
  if (maxCount <= 0) return MIN_STROKE
  return MIN_STROKE + ((count / maxCount) * (MAX_STROKE - MIN_STROKE))
}

/** Hex color with alpha channel for edge fill. */
function withAlpha(hex: string, alpha: number): string {
  // Accept #rrggbb or named colors; for named/unknown, fall back to slate
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) return `rgba(148,163,184,${alpha})`
  const r = parseInt(match[1].slice(0, 2), 16)
  const g = parseInt(match[1].slice(2, 4), 16)
  const b = parseInt(match[1].slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function MessageGraph({
  agents,
  edges,
  width,
  height,
}: MessageGraphProps) {
  const w = width ?? 420
  const h = height ?? 340

  if (agents.length === 0) {
    return (
      <div
        style={{ width: w, height: h }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/30 gap-2"
      >
        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-slate-500 text-sm">No agents</span>
      </div>
    )
  }

  const cx = w / 2
  const cy = h / 2

  // Ring radius — leave room for labels (NODE_R + ~30px padding around ring)
  const R = Math.min(cx, cy) - NODE_R - 32
  const effectiveR = Math.max(R, NODE_R + 8)

  const N = agents.length

  // Compute node positions; start from top (−π/2 offset)
  const positions = agents.map((_, i) => {
    const angle = (2 * Math.PI * i) / N - Math.PI / 2
    return {
      x: cx + effectiveR * Math.cos(angle),
      y: cy + effectiveR * Math.sin(angle),
      angle,
    }
  })

  const agentIndex = new Map(agents.map((a, i) => [a.name, i]))

  // Filter to edges where both endpoints are known agents (self-loops excluded)
  const validEdges = edges.filter(
    (e) =>
      e.from !== e.to &&
      agentIndex.has(e.from) &&
      agentIndex.has(e.to) &&
      e.count > 0,
  )

  const maxCount = validEdges.reduce((m, e) => Math.max(m, e.count), 1)

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Agent communication graph"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* One arrowhead marker per source agent color */}
        {agents.map((agent) => (
          <marker
            key={`marker-${agent.agentId}`}
            id={`arrow-${agent.agentId}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={agent.color} opacity={0.85} />
          </marker>
        ))}
      </defs>

      {/* ── Edges ─────────────────────────────────────────────────── */}
      {validEdges.map((edge) => {
        const si = agentIndex.get(edge.from)!
        const ti = agentIndex.get(edge.to)!
        const src = positions[si]
        const tgt = positions[ti]
        const srcAgent = agents[si]

        // Direction vector
        const dx = tgt.x - src.x
        const dy = tgt.y - src.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) return null
        const ux = dx / dist
        const uy = dy / dist

        // Perpendicular (left of travel direction)
        const px = -uy
        const py = ux

        // Control point: midpoint + perpendicular offset proportional to dist
        const midX = (src.x + tgt.x) / 2
        const midY = (src.y + tgt.y) / 2
        const pull = dist * CURVE_K
        const qx = midX + px * pull
        const qy = midY + py * pull

        // Endpoint: backed off from target center by NODE_R so arrow lands on rim.
        // Tangent at bezier end ≈ direction from Q to target center.
        const etx = tgt.x - qx
        const ety = tgt.y - qy
        const etLen = Math.sqrt(etx * etx + ety * ety)
        const endX = tgt.x - (etx / etLen) * (NODE_R + 1)
        const endY = tgt.y - (ety / etLen) * (NODE_R + 1)

        // Start point: offset from source center along departure tangent
        const stx = qx - src.x
        const sty = qy - src.y
        const stLen = Math.sqrt(stx * stx + sty * sty)
        const startX = src.x + (stx / stLen) * NODE_R
        const startY = src.y + (sty / stLen) * NODE_R

        const sw = edgeStroke(edge.count, maxCount)

        return (
          <g key={`${edge.from}→${edge.to}`}>
            <path
              d={`M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`}
              stroke={withAlpha(srcAgent.color, 0.75)}
              strokeWidth={sw}
              fill="none"
              markerEnd={`url(#arrow-${srcAgent.agentId})`}
            >
              <title>
                {edge.from} → {edge.to}: {edge.count} message{edge.count !== 1 ? 's' : ''}
              </title>
            </path>
          </g>
        )
      })}

      {/* ── Nodes ─────────────────────────────────────────────────── */}
      {agents.map((agent, i) => {
        const { x, y, angle } = positions[i]

        // Place label outside the ring, away from center
        const labelR = effectiveR + NODE_R + 14
        const lx = cx + labelR * Math.cos(angle)
        const ly = cy + labelR * Math.sin(angle)

        // Text anchor: left/right depending on which side of circle
        const anchor =
          Math.abs(Math.cos(angle)) < 0.15
            ? 'middle'
            : Math.cos(angle) > 0
            ? 'start'
            : 'end'

        return (
          <g key={agent.agentId}>
            {/* Halo glow */}
            <circle
              cx={x}
              cy={y}
              r={NODE_R + 4}
              fill={withAlpha(agent.color, 0.12)}
            />

            {/* Main node circle */}
            <circle
              cx={x}
              cy={y}
              r={NODE_R}
              fill={withAlpha(agent.color, 0.85)}
              stroke={agent.color}
              strokeWidth={2}
            />

            {/* Status indicator dot */}
            <circle
              cx={x + NODE_R - 5}
              cy={y - NODE_R + 5}
              r={4.5}
              fill={
                agent.status === 'active'
                  ? '#22c55e'
                  : agent.status === 'idle'
                  ? '#f59e0b'
                  : '#6b7280'
              }
              stroke="#0f172a"
              strokeWidth={1.5}
            />

            {/* Agent name label */}
            <text
              x={lx.toFixed(1)}
              y={ly.toFixed(1)}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#cbd5e1"
              fontSize={11}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight={500}
            >
              {agent.name}
            </text>
          </g>
        )
      })}

      {/* ── Empty-edges overlay ───────────────────────────────────── */}
      {validEdges.length === 0 && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#475569"
          fontSize={12}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          No messages exchanged yet
        </text>
      )}
    </svg>
  )
}
