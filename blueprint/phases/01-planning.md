# Phase 1: Planning

## Purpose
Turn the problem statement into a concrete, chunk-based implementation plan.

## Who
- **Human:** Thinks, evaluates, trims
- **Agent:** Generates the plan, proposes Chunks

## Input
- Problem statement with scope and success criteria from Phase 0 — for larger features (see the Phase 0 threshold) formalized as a [SPEC](../templates/SPEC.md.template) whose Acceptance Criteria become this plan's Success Criteria

## Process

1. **Have the plan generated:** Agent creates a plan with numbered Chunks
2. **Check Chunk size:** Each Chunk must be implementable in a fresh context window
3. **Trim:** More than 8 Chunks? Reduce scope or prioritize features
4. **Mark dependencies:** Which Chunks must be sequential, which can run in parallel?
5. **Define Shared Contracts:** Types, interfaces, API contracts that are read-only in Phase 2
6. **Choose the execution mode:** Chunk Mode (default) or Mission Mode on Fable 5 —
   see [decision-trees.md](../meta/decision-trees.md). In Mission Mode the same
   plan serves as the overall specification: the Chunks become sections of the Definition of Done
   and are delivered as *one* prompt instead of individually.

## Agent Prompt

```
Analyze the requirement: <REQUIREMENT>

Create a plan with numbered Chunks.
Each Chunk must:
- Be implementable in a fresh context window
- Touch at most 3-5 files
- Have a clear "done" criterion
- State which files are created/changed

If the plan has more than 8 Chunks: propose how to reduce the scope.

Mark dependencies between Chunks.
Mark which Chunks are parallelizable.
Also propose the execution mode (Chunk | Mission) with a one-sentence rationale.
```

## Chunk Format

```
### Chunk <NO>: <Title>

**Files:** <list of affected files>
**Depends on:** <Chunk no. or "none">
**Parallelizable:** yes/no
**Agent:** <Claude Code | Antigravity>
**Done criterion:** <What must be true for this Chunk to be done>
```

## Gate
- [ ] Plan has at most 8 Chunks
- [ ] Each Chunk has max 3-5 files
- [ ] Each Chunk has a clear done criterion
- [ ] Dependencies are marked
- [ ] Shared Contracts are defined
- [ ] If a SPEC exists: every Acceptance Criterion is covered by at least one Chunk done criterion
- [ ] Execution mode set (Chunk | Mission)
- [ ] Human has reviewed and approved the plan

## Output
Plan.md in the project root or in docs/

## Next
[Phase 2: Building](02-building.md) — one new thread per Chunk
