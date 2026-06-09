/**
 * useSnapshot — EventSource SSE hook with rolling history and REST fallback.
 *
 * Connects to GET /events?team=NAME (server-sent events, event name "snapshot").
 * Falls back to GET /api/snapshot?team=NAME on initial mount.
 * Maintains a capped history of up to HISTORY_CAP snapshots so T10's
 * <TokenTimeline> can plot cumulative tokens over time.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TeamSnapshot, TokenTimelineProps } from '../../../src/types'

const HISTORY_CAP = 300
const RECONNECT_DELAY_MS = 3_000

// ---------------------------------------------------------------------------
// Timeline derivation
// ---------------------------------------------------------------------------

/**
 * Derive uPlot-compatible time-series data from the snapshot history.
 *
 * - timestamps: unix seconds (one per snapshot in history)
 * - seriesData[i]: cumulative (input + output) tokens for agents[i] at each
 *   timestamp, in the same order as the latest snapshot's agents array.
 */
function deriveTimeline(
  history: TeamSnapshot[],
): Pick<TokenTimelineProps, 'seriesData' | 'timestamps'> {
  if (history.length === 0) return { seriesData: [], timestamps: [] }

  const timestamps = history.map(s => s.generatedAt / 1_000)
  const agentCount = history[history.length - 1].agents.length

  const seriesData: number[][] = Array.from({ length: agentCount }, (_, i) =>
    history.map(snap => {
      const agent = snap.agents[i]
      if (!agent) return 0
      return agent.tokens.inputTokens + agent.tokens.outputTokens
    }),
  )

  return { timestamps, seriesData }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseSnapshotResult {
  /** Latest snapshot, or null before first data arrives. */
  snapshot: TeamSnapshot | null
  /** Rolling history capped at HISTORY_CAP entries. */
  history: TeamSnapshot[]
  /** Ready-to-spread props for <TokenTimeline agents={...} {...timelineData} /> */
  timelineData: Pick<TokenTimelineProps, 'seriesData' | 'timestamps'>
}

export function useSnapshot(teamName: string): UseSnapshotResult {
  const [snapshot, setSnapshot] = useState<TeamSnapshot | null>(null)
  const [history, setHistory] = useState<TeamSnapshot[]>([])

  const esRef = useRef<EventSource | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Keep a ref so the EventSource error handler always sees the latest teamName
  const teamRef = useRef(teamName)
  teamRef.current = teamName

  const pushSnapshot = useCallback((snap: TeamSnapshot) => {
    setSnapshot(snap)
    setHistory(prev => {
      const next = [...prev, snap]
      return next.length > HISTORY_CAP ? next.slice(next.length - HISTORY_CAP) : next
    })
  }, [])

  const connect = useCallback(() => {
    esRef.current?.close()

    const url = `/events?team=${encodeURIComponent(teamRef.current)}`
    const es = new EventSource(url)
    esRef.current = es

    // Server sends: event: snapshot\ndata: <JSON TeamSnapshot>\n\n
    es.addEventListener('snapshot', (e: MessageEvent) => {
      try {
        pushSnapshot(JSON.parse(e.data) as TeamSnapshot)
      } catch {
        // Malformed JSON — ignore and wait for next event
      }
    })

    es.onerror = () => {
      es.close()
      esRef.current = null
      reconnectTimer.current = setTimeout(() => connect(), RECONNECT_DELAY_MS)
    }
  }, [pushSnapshot])

  useEffect(() => {
    // 1) REST fallback — seed the UI before SSE fires
    fetch(`/api/snapshot?team=${encodeURIComponent(teamName)}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: TeamSnapshot) => pushSnapshot(data))
      .catch(() => {
        /* Non-fatal — SSE or mock will provide data */
      })

    // 2) SSE connection
    connect()

    return () => {
      esRef.current?.close()
      esRef.current = null
      if (reconnectTimer.current !== null) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }
  }, [teamName, connect, pushSnapshot])

  return {
    snapshot,
    history,
    timelineData: deriveTimeline(history),
  }
}
