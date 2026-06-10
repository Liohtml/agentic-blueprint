# Multi-Agent Coordination Protocol

> Applies to any multi-agent setup: teammates in an Agent Team (see
> [agent-teams.md](agent-teams.md)) or a second Claude Code agent in a
> separate session.

## Ground Rule
The human is the conductor. Agents work autonomously within their Chunks, but the human assigns work and makes decisions on conflicts.

## Collision Avoidance

### Directory boundaries
Every agent has assigned directories (defined in config.md).
An agent NEVER works in another agent's directories.

### Shared Contracts
- Shared types and API interfaces are defined in Phase 1
- During Phase 2 they are READ-ONLY
- Changes to Shared Contracts require: STOP all agents, human decides, restart of the affected Chunks

### Branch conventions
- Format: `feature/<chunk-no>-<agent>-<description>`
- Examples:
  - `feature/01-claude-code-api-endpoints`
  - `feature/02-teammate-ui-dashboard-ui`
  - `feature/03-claude-code-auth-logic`

### File locking (implicit)
No technical locking, but:
- The plan defines which agent touches which files
- If two Chunks need the same file: they are NOT parallelizable
- The plan must mark this explicitly in Phase 1

## Handoff Artifacts

When an agent produces output that another agent needs:

1. **API contracts:** JSON schema or TypeScript interface
2. **Shared types:** TypeScript types/interfaces in a shared directory
3. **Status updates:** Agent reports "Chunk X done" to the human
4. **Blockers:** Agent reports "Chunk X blocked because of Y" to the human

## Escalation Chain

```
Agent has a blocker
    |
    v
Agent documents the blocker (what, why, what was tried)
    |
    v
Agent STOPS
    |
    v
Human decides:
    ├── Reduce scope
    ├── Change approach
    ├── Fix manually
    └── Assign another agent
```

## Order of Precedence on Conflicts

1. Shared Contract needs to change? → All agents stop, human decides
2. Two agents need the same file? → Chunks are sequential, not parallel
3. Agent is stuck? → Escalation, no endless looping
4. Contradiction between agents? → Human decides, not the "stronger" agent
