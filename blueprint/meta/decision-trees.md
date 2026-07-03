# Decision Trees

## Which Model for Which Role? (Brain / Orchestrator / Worker / Scout)

The tiering doctrine — **"judgment up, volume down"**: the higher the leverage of a
single decision, the higher the model tier; the more tokens a role burns, the lower
the tier. (Maintainer decision 2026-07-03; this *reverses* the 2026-06-09 evaluation's
"the Lead belongs on Fable" guidance — orchestration is mostly mechanics, and the
highest-leverage moments in this repo's own loop cycles were consistently the
judgment steps: devil's-advocate reviews, verification, design decisions.)

| Role | Model | Called for |
|---|---|---|
| **Brain** | Fable 5 (`claude-fable-5`) | Judgment moments, not loop residency: Phase 0/1 sparring and architecture decisions, devil's-advocate reviews, judge/verify stages in workflows — and **Mission Chunks**, where the executing agent *is* the judgment. Effort high/xhigh. |
| **Orchestrator** | Opus 4.8 (`claude-opus-4-8`) | Leading teams and improvement-loop cycles — spawn, collect, bookkeeping, commits — plus hard logic with correctness risk (parsers, algorithmics, aggregation). Fast mode available. |
| **Worker / Researcher** | Sonnet 5 (`claude-sonnet-5`) | The volume tier: implementation, research, tests, docs — near-Opus on coding at Sonnet cost. |
| **Scout** | Haiku 4.5 (`claude-haiku-4-5`) | Read-only explore, mechanical bulk edits. |

```
Task received
    |
    v
Judgment moment — a single decision with high leverage
(architecture, DA review, judge/verify stage) OR a Mission Chunk?
    ├── YES → Fable 5, the Brain (effort high/xhigh;
    |         Mission: complete spec in the first turn)
    |
    └── NO: Orchestrating others (team Lead, loop orchestrator)
            or hard logic with correctness risk?
            ├── YES → Opus 4.8, the Orchestrator
            |
            └── NO: Read-only research / explore / mechanical bulk edit?
                    ├── YES → Haiku 4.5, the Scout
                    └── NO → Sonnet 5, the Worker (standard)
```

The exception is deliberate: a **Mission Chunk** runs Fable as the *executing* model —
there, the worker is the brain. The hierarchy above governs orchestrated multi-agent
work. And the split has an escalation rule (see
[orchestration.md](../agents/orchestration.md)): the orchestrator hands ambiguous
verdicts, borderline aborts, and scope-interpretation calls to a Fable judgment call —
or to the human where the project rules require it.

**Cost anchors** (in/out per MTok) — this is the single canonical place for concrete
prices in the Blueprint; all other documents reference this section:

Fable $10/$50 · Opus $5/$25 · Sonnet 5 $3/$15 (introductory $2/$10 through
2026-08-31; note Sonnet 5's new tokenizer produces ~30% more tokens for the same
text than Sonnet 4.6, so effective per-task cost is higher than the sticker
suggests) · Haiku $1/$5.
Fable costs 2× Opus — the added value lies in judgment quality and long-horizon
autonomy, not in every single task. Effort is the second dimension: levels
low–max; `xhigh` is the sweet spot for coding/agentic work, `low` for mechanical
subagent stages.

## When to Use Which Agent?

Claude Code handles all task types. Solo work goes to a single Claude Code session;
in an Agent Team the Lead assigns Chunks to teammates (e.g. UI/design to a Sonnet
teammate — see [agent-teams.md](../agents/agent-teams.md)). Reviews always go to the
`/code-review` skill plus a second Claude Code agent with fresh context — never to
the author (see "Which Review Tool to Choose?" below).

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
                    ├── YES → Hybrid: Opus 4.8 orchestrates the team, Fable 5
                    |        on call for judgment stages (DA/judge/verify);
                    |        a Mission-sized task handed to a teammate still
                    |        runs on Fable — the worker-is-the-brain exception
                    |        applies inside Hybrid too
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
