# Agentic Engineering Blueprint v1.10

> This document is the central working instruction for all agents in this project.
> It is loaded automatically and defines principles, phases, and roles.
> Detailed instructions live in the linked modules under `blueprint/`.

---

## Core Principles

1. **Human thinks, agent builds** — The human makes architecture and design decisions. Agents execute and propose, but never decide on architecture, scope, or technology choices on their own.

2. **Context is King, less is more** — Never load the entire codebase. Reference deliberately: specific files, folders, functions. Start a new thread on phase transitions or when the agent gets imprecise. Hard percentage thresholds are obsolete since 1M context + server-side compaction — curation remains mandatory nonetheless: precise context beats large context.

3. **Code is the best documentation** — Reference the source code of dependencies directly: first via the native agent tools (grep/read in `node_modules`, web_fetch of the repo sources), `npx open-source <repo-url>` as fallback. Human-written docs only when the code is not enough.

4. **Build small, merge often** — Break features into Chunks. Each Chunk: max 3-5 files, one fresh context window, one clear done criterion. More than 8 Chunks = reduce scope. Exception: **Mission Chunks** on Fable 5 — a well-specified long-horizon assignment (full spec in the first turn, binary Definition of Done, effort high/xhigh) replaces several micro-Chunks. See [02-building.md](blueprint/phases/02-building.md).

5. **Restructure after every feature** — Run cleanup after every build cycle. Build service layers, eliminate duplicates. NEVER skipped.

6. **Automated Feedback Loops** — Agents work in loops with defined abort conditions. No endless looping, no manual back-and-forth.

---

## Phase Overview

| Phase | Name | Who | Output | Detail |
|-------|------|-----|--------|--------|
| 0 | Ideation & Scoping | Human + agent sparring | Problem statement, scope | [00-ideation.md](blueprint/phases/00-ideation.md) |
| 1 | Planning | Human thinks, agent plans | Plan.md with Chunks | [01-planning.md](blueprint/phases/01-planning.md) |
| 2 | Building | Agent(s) autonomous | Code + tests | [02-building.md](blueprint/phases/02-building.md) |
| 3 | Structure Cleanup | Agent with cleanup skill | Clean structure | [03-cleanup.md](blueprint/phases/03-cleanup.md) |
| 4 | Review Loop | Review agent + build agent | PR with score 5/5 | [04-review-loop.md](blueprint/phases/04-review-loop.md) |
| 5 | Merge & Validate | Human gives the go | Merged PR | [05-merge.md](blueprint/phases/05-merge.md) |

**Rules:** No phase skipping. New thread per phase. Gates are binary. Parallelization only in Phase 2.

---

## Agent Roles

### Claude Code — "The Engineer"
Responsible for: code logic, architecture, backend, tests, DevOps, fixes on review feedback.
Not responsible for: design decisions, reviewing its own work, merging without Human Go.
Detail: [claude-code.md](blueprint/agents/claude-code.md)

### Coordination
Multi-agent protocol for teammates and an optional second Claude Code agent
(separate session or teammate): collision avoidance, Handoff artifacts.
Detail: [coordination.md](blueprint/agents/coordination.md)

### Agent Teams (live collaboration)
Real Teammates in tmux split panes (instead of subagents/workflow): setup, runbook,
Model Tiering, costs, cleanup. Including the **Agent Observer** live dashboard.
Detail: [agent-teams.md](blueprint/agents/agent-teams.md)

### Cloud Execution Profile (optional)
Phases 2–4 as a managed-agent session on Anthropic infrastructure: the Phase 1 plan
becomes the outcome rubric, an independent grader evaluates every iteration
(structurally enforced "no self-review"). For overnight runs and migrations
with a clear Definition of Done.
Detail: [managed-agents.md](blueprint/agents/managed-agents.md)

### Orchestration (deterministic multi-agent patterns)
Running multi-agent work as a deterministic procedure instead of ad-hoc prompting:
fan-out/pipeline, adversarial verification, judge panels, loop-until-dry, and
structured result contracts (research finding / DA verdict / implementation report)
between pipeline stages.
Detail: [orchestration.md](blueprint/agents/orchestration.md)

### Model Tiering — Brain / Orchestrator / Worker / Scout (since 07/2026)
"Judgment up, volume down": **Fable 5** is the *Brain* — called at judgment
moments (architecture, devil's-advocate reviews, judge/verify stages) and for
Mission Chunks, not parked in the loop. **Opus 4.8** is the *Orchestrator* —
leads teams and loop cycles, owns hard logic. **Sonnet 5** is the
*Worker/Researcher* — the volume tier. **Haiku 4.5** is the *Scout* — explore
and bulk edits. Effort as a second dimension: `xhigh` for Missions and
judgment stages, `high` standard, `low` for mechanical subagents.
Decision tree, escalation rule, and current price anchors:
[decision-trees.md](blueprint/meta/decision-trees.md)

---

## Context Engineering Quick Rules

- **Curation:** As little as possible, as much as necessary. New thread on phase transitions or imprecision — not at a percentage threshold
- **Hierarchy:** Layer 1 (always) > Layer 2 (phase) > Layer 3 (task) > Layer 4 (never proactively)
- **Dependencies:** Source directly via grep/read/web_fetch; `npx open-source <repo>` as fallback
- **Prompt templates:** See the respective phase file

---

## Feedback Loops

| Loop | Phase | Max iterations | On abort |
|------|-------|----------------|----------|
| Build-Test | 2 | 5 | Report blocker |
| Cleanup-Verify | 3 | 3 | Rollback |
| Review-Fix | 4 | 7 | Human takes over |
| Improvement | meta* | 1-3 items per cycle* | Maintainer stop / empty backlog |

\* The Improvement Loop runs on the **system itself**, between features, not inside a
phase: backlog → research → devil's-advocate review → implement → test → push →
backlog update. "1-3 items per cycle" is an item count, not an iteration cap — cycles
are unbounded until an abort condition fires; inside a cycle the three feature loops
keep their own hard limits. Its durable state is the backlog file, which makes it
resumable after any interruption. Detail: [improvement-loop.md](blueprint/loops/improvement-loop.md)

Optionally in addition: **Task Budgets** (`output_config.task_budget`, beta) as a soft
token limit per loop run — the model sees the countdown and moderates itself.
The iteration limit remains the hard limit.

**Loop classes & autonomy levels (since 1.10):** besides the feature loops and
the Improvement Loop there is a third loop class — **Operations Loops**, cadence-driven
maintenance loops (audits, PR guardianship, dependency patch sweeps) with rate
limits and abort conditions instead of iteration caps:
[operations-loops.md](blueprint/loops/operations-loops.md). Every autonomous
loop runs at a declared **autonomy level** — L1 report / L2 propose (branch/PR
only) / L3 push (never merge) — with promotion by maintainer decision on a
clean track record: [autonomy-levels.md](blueprint/loops/autonomy-levels.md).

Detail: [blueprint/loops/](blueprint/loops/)

---

## Safety Rules

- Do not install packages younger than 14 days
- No hardcoded secrets/credentials
- An agent never reviews itself
- No merge without human approval
- Every unattended (scheduled) loop run declares a **change scope** up front —
  path + change-type allowlist. Anything outside the scope is escalated, never
  done. ([autonomy-levels.md](blueprint/loops/autonomy-levels.md))
- Unattended runs have a **cost ceiling** with a re-entry circuit breaker:
  each run records its actual spend in the loop's state file; each re-entry
  reads it first and stops if the ceiling is exceeded. Recording is what arms
  the breaker — without the record there is no breaker.

---

## Project Configuration

Before use: fill out `blueprint/config.md`.
Bootstrapping guide: [how-to-adapt.md](blueprint/meta/how-to-adapt.md)

---

## Meta

- **Version:** 1.10
- **Changelog:** [changelog.md](blueprint/meta/changelog.md)
- **Retro template:** [retro-template.md](blueprint/meta/retro-template.md)
- **Decision trees:** [decision-trees.md](blueprint/meta/decision-trees.md)
