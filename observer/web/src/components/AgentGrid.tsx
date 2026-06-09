import type { AgentGridProps } from '../../../src/types'
import AgentCard from './AgentCard'

export default function AgentGrid({ agents, onSelect, selectedAgentId }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">
        No agents found
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map(agent => {
        const isSelected = !selectedAgentId || selectedAgentId === agent.agentId
        return (
          <button
            key={agent.agentId}
            type="button"
            className={[
              'text-left w-full transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              'rounded-xl',
              isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-75',
            ].join(' ')}
            onClick={() => onSelect?.(agent.agentId)}
            aria-pressed={selectedAgentId === agent.agentId}
            aria-label={`Select agent ${agent.name}`}
          >
            <AgentCard agent={agent} />
          </button>
        )
      })}
    </div>
  )
}
