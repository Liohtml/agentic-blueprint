import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from './Layout'
import AgentGrid from './components/AgentGrid'
import TokenTimeline from './components/charts/TokenTimeline'
import CostBreakdown from './components/charts/CostBreakdown'
import TaskBoard from './components/charts/TaskBoard'
import MessageGraph from './components/charts/MessageGraph'
import { useSnapshot } from './lib/useSnapshot'
import { mockSnapshot, mockTeams } from './lib/mockSnapshot'

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

interface HeaderProps {
  teamName: string
  teams: string[]
  onTeamChange: (t: string) => void
  activeAgents: number
  agentCount: number
  totalCostUsd: number
  totalTokens: number
  tasksCompleted: number
  tasksTotal: number
  messagesExchanged: number
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function Header({
  teamName,
  teams,
  onTeamChange,
  activeAgents,
  agentCount,
  totalCostUsd,
  totalTokens,
  tasksCompleted,
  tasksTotal,
  messagesExchanged,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4 flex-wrap min-h-[52px]">
      {/* Logo + team selector */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white select-none">
            ▲
          </div>
          <span className="text-sm font-semibold text-slate-200 tracking-tight">
            Agent Observer
          </span>
        </div>

        {teams.length > 1 ? (
          <select
            value={teamName}
            onChange={e => onTeamChange(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
          >
            {teams.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-lg px-2 py-1.5 font-mono">
            {teamName}
          </span>
        )}
      </div>

      {/* Totals strip */}
      <div className="flex items-center gap-5 text-xs font-mono flex-wrap">
        <span className="flex items-center gap-1">
          <span
            className={[
              'inline-block w-1.5 h-1.5 rounded-full',
              activeAgents > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600',
            ].join(' ')}
          />
          <span className="text-emerald-400 font-semibold">{activeAgents}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{agentCount}</span>
          <span className="text-slate-600 ml-0.5">active</span>
        </span>

        <span className="text-amber-400 font-semibold">
          ${totalCostUsd.toFixed(2)}
        </span>

        <span>
          <span className="text-sky-400">{fmtCompact(totalTokens)}</span>
          <span className="text-slate-600 ml-0.5">tok</span>
        </span>

        <span>
          <span className="text-slate-300">{tasksCompleted}</span>
          <span className="text-slate-600">/{tasksTotal}</span>
          <span className="text-slate-600 ml-0.5">tasks</span>
        </span>

        <span>
          <span className="text-slate-300">{messagesExchanged}</span>
          <span className="text-slate-600 ml-0.5">msgs</span>
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [teams, setTeams] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>()

  // Measure the message-graph container so the SVG fills it
  const graphContainerRef = useRef<HTMLDivElement>(null)
  const [graphWidth, setGraphWidth] = useState(420)

  useEffect(() => {
    const el = graphContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const w = entry.contentRect.width
      if (w > 0) setGraphWidth(Math.floor(w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Fetch team list once on mount; fall back to mock when server isn't up.
  // T8 /api/teams returns { name, description, createdAt }[] — extract names.
  useEffect(() => {
    fetch('/api/teams')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Array<{ name: string; description: string; createdAt: number }>) => {
        const names = data.map(t => t.name)
        if (names.length === 0) throw new Error('empty')
        setTeams(names)
        setSelectedTeam(prev => prev || names[0]!)
      })
      .catch(() => {
        setTeams(mockTeams)
        setSelectedTeam(prev => prev || mockTeams[0]!)
      })
  }, [])

  const handleTeamChange = useCallback((t: string) => {
    setSelectedTeam(t)
    setSelectedAgentId(undefined) // clear selection when switching teams
  }, [])

  const handleAgentSelect = useCallback((agentId: string) => {
    setSelectedAgentId(prev => (prev === agentId ? undefined : agentId))
  }, [])

  const { snapshot, timelineData } = useSnapshot(selectedTeam)

  // Fall back to the realistic mock snapshot until T8 SSE is live
  const displaySnapshot = snapshot ?? mockSnapshot

  const { agents, tasks, edges, totals } = displaySnapshot

  return (
    <Layout
      header={
        <Header
          teamName={selectedTeam || displaySnapshot.team.name}
          teams={teams}
          onTeamChange={handleTeamChange}
          activeAgents={totals.activeAgents}
          agentCount={totals.agentCount}
          totalCostUsd={totals.totalCostUsd}
          totalTokens={totals.totalTokens}
          tasksCompleted={totals.tasksCompleted}
          tasksTotal={totals.tasksTotal}
          messagesExchanged={totals.messagesExchanged}
        />
      }
    >
      {/* ── Agent cards ───────────────────────────────────────────── */}
      <AgentGrid
        agents={agents}
        onSelect={handleAgentSelect}
        selectedAgentId={selectedAgentId}
      />

      {/* ── Token timeline + cost breakdown ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Token Timeline
          </h2>
          <TokenTimeline
            agents={agents}
            seriesData={snapshot !== null ? timelineData.seriesData : []}
            timestamps={snapshot !== null ? timelineData.timestamps : []}
          />
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Cost Breakdown
          </h2>
          <CostBreakdown agents={agents} totals={totals} />
        </section>
      </div>

      {/* ── Task board + message graph ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Task Board
          </h2>
          <TaskBoard tasks={tasks} agents={agents} />
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Message Graph
          </h2>
          <div ref={graphContainerRef} className="w-full overflow-hidden">
            <MessageGraph
              edges={edges}
              agents={agents}
              width={graphWidth}
              height={340}
            />
          </div>
        </section>
      </div>
    </Layout>
  )
}
