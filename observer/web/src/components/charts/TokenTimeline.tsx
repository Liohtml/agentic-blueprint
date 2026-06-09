/**
 * TokenTimeline — uPlot line chart of cumulative tokens per agent over time.
 * Props come strictly from observer/src/types.ts (TokenTimelineProps).
 */
import { useEffect, useRef } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'
import type { TokenTimelineProps } from '../../../../src/types'

const CHART_HEIGHT = 220

export default function TokenTimeline({ agents, seriesData, timestamps }: TokenTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<uPlot | null>(null)

  const isEmpty = agents.length === 0 || timestamps.length === 0

  useEffect(() => {
    const container = containerRef.current
    if (!container || isEmpty) return

    // Destroy any existing instance
    plotRef.current?.destroy()
    plotRef.current = null

    const w = container.clientWidth || 600

    // Convert typed arrays to plain number[] for uPlot
    const xData = Array.from(timestamps) as number[]
    const yData = seriesData
      .slice(0, agents.length)
      .map((s) => Array.from(s) as number[])

    const series: uPlot.Series[] = [
      {}, // x-axis placeholder
      ...agents.map((agent) => ({
        label: agent.name,
        stroke: agent.color,
        width: 2,
        spanGaps: true,
      })),
    ]

    const opts: uPlot.Options = {
      width: w,
      height: CHART_HEIGHT,
      series,
      axes: [
        {
          stroke: '#94a3b8',
          grid: { stroke: '#1e293b' },
          ticks: { stroke: '#1e293b' },
        },
        {
          label: 'Cumulative Tokens',
          stroke: '#94a3b8',
          grid: { stroke: '#1e293b' },
          ticks: { stroke: '#1e293b' },
        },
      ],
      cursor: { show: true },
    }

    // uPlot expects [xArr, ...yArrs]
    const data = [xData, ...yData] as uPlot.AlignedData

    try {
      const plot = new uPlot(opts, data, container)
      plotRef.current = plot

      const ro = new ResizeObserver(() => {
        if (plotRef.current && containerRef.current) {
          plotRef.current.setSize({
            width: containerRef.current.clientWidth,
            height: CHART_HEIGHT,
          })
        }
      })
      ro.observe(container)

      return () => {
        ro.disconnect()
        plot.destroy()
        plotRef.current = null
      }
    } catch (_err) {
      // uPlot can throw if container is unmounted mid-init
    }
  }, [agents, seriesData, timestamps, isEmpty])

  if (isEmpty) {
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
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
        <span className="text-slate-500 text-sm">No timeline data yet</span>
        <span className="text-slate-600 text-xs">Waiting for agent activity</span>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full" />
}
