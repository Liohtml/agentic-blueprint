# Phase 2: Building

## Purpose
Implement the plan — as individual Chunks (Chunk Mode, default) or as a
coherent Mission on Fable 5 (Mission Mode). One fresh thread per Chunk/Mission.

## Who
- **Agent:** Works autonomously
- **Human:** Only intervenes on Escalation

## Input
- One Chunk from the plan with a done criterion
- Targeted context (specific files, not the entire codebase)

## Process

1. **Start a new thread** — clean context window
2. **Load context:** Only the files the Chunk needs + Shared Contracts
3. **Implement:** Write code according to the done criterion
4. **Write tests:** At least one test per new function
5. **Build-Test Loop:** Loop until all tests are green (max 5 iterations)
6. **Check the Gate:** All checks fulfilled?

## Agent Prompt

```
Implement Chunk <NO> from the plan: <PLAN_LINK>

Reference: <TARGETED CONTEXT — specific files/folders>
Done criterion: <CRITERION>

Rules:
- Write tests for the core logic
- Do not install packages younger than 14 days
- No hardcoded secrets
- If you are stuck after 5 attempts: STOP and report the blocker
```

## Build-Test Loop

See: [build-test-loop.md](../loops/build-test-loop.md)

Max 5 iterations. On abort: document the blocker and escalate to the human.

## Mission Mode (Fable 5)

Since Fable 5 (06/2026) there are two execution modes. Mission Mode uses the
model's long-horizon autonomy: instead of 8 micro-Chunks, one well-specified
overall assignment.

| | Chunk Mode (default) | Mission Mode |
|---|---|---|
| Model | Sonnet / Opus | Fable 5 |
| Unit | 1 Chunk (3-5 files) | 1 Mission (coherent feature part, also >5 files) |
| Specification | Done criterion per Chunk | Complete plan as one prompt in the first turn |
| Effort | Standard | `high` / `xhigh` |
| When | Standard work, parallel Teammates | Migrations, coherent subsystems, refactors across many files |

**Mission Mode rules:**

1. **Full spec up front.** Fable's long-horizon quality depends directly on the
   specification quality — the Phase 1 plan is delivered as *one* prompt,
   not fed in piecemeal. Underspecified Missions are expensive guessing.
2. **Definition of Done as a checklist** — every criterion binary-checkable.
3. **Gates remain.** Mission Mode changes the execution size, not the
   quality bars: Cleanup (Phase 3) and Review (Phase 4) run unchanged.
4. **Optional token budget** per Mission (see [build-test-loop.md](../loops/build-test-loop.md)).
5. **Cost check:** Fable costs 2× Opus. Mission Mode pays off when the
   coordination overhead of Chunk Mode (thread switches, context reloads,
   Handoffs) exceeds the price premium — for migrations practically always.

**Agent prompt (Mission):**

```
Mission: <FEATURE/MIGRATION — complete description>

Specification: <PLAN_LINK — the complete plan, not a single Chunk>

Definition of Done:
- [ ] <CRITERION 1 — binary-checkable>
- [ ] <CRITERION 2>

Context: <entry points — the agent explores further on its own>

Rules:
- Work through the Mission completely before reporting back
- Write tests for the core logic; run the suite after every substep
- Do not install packages younger than 14 days
- No hardcoded secrets
- On blockers that concern the specification: STOP and escalate — do not guess
```

Mode decision: see [decision-trees.md](../meta/decision-trees.md).

## Parallelization

Multiple agents can build different Chunks simultaneously when:
- The Chunks are marked as "parallelizable"
- They touch different files
- Shared Contracts are read-only (defined in Phase 1)
- Each agent works on its own branch: `feature/<chunk-no>-<agent>-<description>`

## Gate
- [ ] Done criterion of the Chunk fulfilled
- [ ] All new functions have at least one test
- [ ] All tests green
- [ ] No hardcoded secrets/credentials
- [ ] No packages younger than 14 days installed
- [ ] Feature works locally

## Output
Working code with tests on a feature branch

## Next
[Phase 3: Structure Cleanup](03-cleanup.md)
