/**
 * TaskBoard — three-column kanban (pending / in_progress / completed).
 * Shows blockedBy dependency badges and owner chips.
 * Props come strictly from observer/src/types.ts (TaskBoardProps).
 */
import type { TaskBoardProps, Task, AgentMetrics } from '../../../../src/types'

const COLUMNS: Array<{ key: Task['status']; label: string; accent: string }> = [
  { key: 'pending', label: 'Pending', accent: 'border-slate-600 text-slate-400' },
  { key: 'in_progress', label: 'In Progress', accent: 'border-amber-500 text-amber-400' },
  { key: 'completed', label: 'Completed', accent: 'border-emerald-600 text-emerald-400' },
]

function agentByName(agents: AgentMetrics[], name: string): AgentMetrics | undefined {
  return agents.find((a) => a.name === name)
}

function TaskCard({ task, agents }: { task: Task; agents: AgentMetrics[] }) {
  const ownerAgent = task.owner ? agentByName(agents, task.owner) : undefined

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2 border border-slate-700 hover:border-slate-500 transition-colors">
      {/* Subject */}
      <p className="text-slate-200 text-sm font-medium leading-snug">{task.subject}</p>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5">
        {/* Owner chip */}
        {task.owner && task.owner.trim() !== '' && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: ownerAgent ? `${ownerAgent.color}22` : '#334155',
              color: ownerAgent ? ownerAgent.color : '#94a3b8',
              border: `1px solid ${ownerAgent ? `${ownerAgent.color}55` : '#475569'}`,
            }}
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            {task.owner}
          </span>
        )}

        {/* BlockedBy badges */}
        {task.blockedBy.map((dep) => (
          <span
            key={dep}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-950 text-rose-400 border border-rose-800"
            title={`Blocked by task #${dep}`}
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            #{dep}
          </span>
        ))}

        {/* Blocks badges */}
        {task.blocks.map((dep) => (
          <span
            key={dep}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-900 text-slate-500 border border-slate-700"
            title={`Blocks task #${dep}`}
          >
            →&nbsp;#{dep}
          </span>
        ))}
      </div>

      {/* Task ID */}
      <div className="text-slate-600 text-xs font-mono">#{task.id}</div>
    </div>
  )
}

export default function TaskBoard({ tasks, agents }: TaskBoardProps) {
  if (tasks.length === 0) {
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span className="text-slate-500 text-sm">No tasks yet</span>
        <span className="text-slate-600 text-xs">Tasks will appear here as the team works</span>
      </div>
    )
  }

  const grouped = COLUMNS.map(({ key, label, accent }) => ({
    key,
    label,
    accent,
    tasks: tasks.filter((t) => t.status === key),
  }))

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {grouped.map(({ key, label, accent, tasks: colTasks }) => (
        <div key={key} className="flex flex-col gap-2">
          {/* Column header */}
          <div className={`flex items-center justify-between pb-2 border-b ${accent}`}>
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            <span className="text-xs font-mono opacity-60">{colTasks.length}</span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {colTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-700 text-xs">empty</div>
            ) : (
              colTasks.map((task) => (
                <TaskCard key={task.id} task={task} agents={agents} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
