# Decision Trees

## Which Model for Which Task? (since Fable 5, 06/2026)

```
Task received
    |
    v
Long-horizon Mission (migration, multi-hour autonomous run,
architecture decisions, team Lead role)?
    ├── YES → Fable 5 (effort high/xhigh, complete spec in the first turn)
    |
    └── NO: Hard logic with correctness risk (parsers, algorithmics, aggregation)?
            ├── YES → Opus 4.8
            |
            └── NO: Read-only research / explore / mechanical bulk edit?
                    ├── YES → Haiku 4.5
                    └── NO → Sonnet 4.6 (standard)
```

**Cost anchors** (in/out per MTok) — this is the single canonical place for concrete
prices in the Blueprint; all other documents reference this section:

Fable $10/$50 · Opus $5/$25 · Sonnet $3/$15 · Haiku $1/$5.
Fable costs 2× Opus — the added value lies in long-horizon autonomy, not in every single task.

## When to Use Which Agent?

```
Task received
    |
    v
Is it a UI/design task?
    |
    ├── YES: Is Antigravity on Profile A (UI/Design)?
    |       ├── YES → Antigravity
    |       └── NO → Claude Code (or switch the Antigravity profile)
    |
    └── NO: Is it code/logic/backend/tests?
            └── YES → Claude Code
```

## When to Start a New Thread?

```
Current thread
    |
    v
New phase begins?
    ├── YES → New thread
    |
    └── NO: Agent gets imprecise / hallucinates / repeats itself?
            ├── YES → New thread
            |
            └── NO: Topic change (new Chunk / new Mission)?
                    ├── YES → New thread
                    └── NO → Continue in the current thread
```

(Hard percentage thresholds are obsolete since 1M context + server-side compaction —
the agent's quality signals are the better trigger.)

## When to Escalate?

```
Agent is working on a problem
    |
    v
Loop limit reached?
    ├── YES → STOP, Escalation to the human
    |
    └── NO: Agent is going in circles (same error repeated)?
            ├── YES → STOP, Escalation to the human
            |
            └── NO: Agent wants to change Shared Contracts?
                    ├── YES → STOP, Escalation to the human
                    └── NO → Agent continues working
```

## Chunk Mode or Mission Mode? (Phase 2)

```
Plan reviewed (Phase 1 completed)
    |
    v
Coherent long-horizon assignment
(migration, subsystem, refactor across many files)?
    ├── NO → Chunk Mode (default): 3-5 files per Chunk, Sonnet/Opus Teammates
    |
    └── YES: Specification complete (Definition of Done binary-checkable)?
            ├── NO → Back to Phase 1 — sharpen the spec
            |        (Mission without a spec = expensive guessing)
            |
            └── YES: Does the work split into independent parallel parts?
                    ├── YES → Hybrid: Fable Lead coordinates the team,
                    |        Missions/Chunks as tasks to tiered Teammates
                    └── NO → Mission Mode: Fable 5, effort high/xhigh,
                               one prompt, fresh thread
```

## When to Parallelize Chunks?

```
Plan reviewed
    |
    v
Chunk A and Chunk B touch different files?
    ├── YES: Neither depends on the other?
    |       ├── YES → Run in parallel
    |       └── NO → Sequential (dependent Chunk waits)
    |
    └── NO → Sequential (same files = collision risk)
```

## Which Review Tool to Choose?

```
Project setup
    |
    v
Claude Code available?
    ├── YES → /code-review skill as the first stage (every PR)
    |        + second agent with fresh context for critical PRs
    |        (the author never reviews their own work — different session/pane)
    |
    └── NO: External review tool (e.g. Greptile) available?
            ├── YES → Use the external tool
            └── NO → Manual review by the human
```
