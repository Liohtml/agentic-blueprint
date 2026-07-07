# Reference — Autonomy Model & Loop Patterns

> Loaded on demand when the procedure in `SKILL.md` needs depth. This is a
> portable distillation; the canonical, maintained specs live in the Agentic
> Blueprint:
> [autonomy-levels.md](https://github.com/Liohtml/agentic-blueprint/blob/master/blueprint/loops/autonomy-levels.md)
> and
> [operations-loops.md](https://github.com/Liohtml/agentic-blueprint/blob/master/blueprint/loops/operations-loops.md).
> On any conflict, the canonical specs win.

## Loop Classes

Not every loop is the same kind of thing:

- **Feature loops** — improve one feature (build→test, cleanup→verify,
  review→fix). Triggered by a phase, human present.
- **Improvement loop** — improves the project/system itself. Triggered by a
  human go.
- **Operations loops** — *maintain* a repo on a **cadence**, between feature
  work. This skill mostly sets up operations loops.

Feature loops use iteration caps; operations loops use **rate limits + the
circuit breaker** as their hard limits and **must declare an abort condition**.

## Pattern Catalog

Each pattern declares: Purpose · Cadence (recommendation) · Target level
(starts L1) · Change scope · Rate limits · Abort condition · Escalation ·
Cost ceiling · Durable state. The concrete numbers below (cadences, rate
limits) are **recommendations** — in a real project the loop's own prompt
owns the authoritative values, so there is one source of truth per loop.

### Repo Health Audit
- **Purpose:** periodic audit — security, bugs, dependencies, tests, README,
  issue triage.
- **Cadence:** weekly (daily if actively developed).
- **Target level:** L1 (report). Creating issues / small fix PRs is an
  outward-facing / L2 grant, added to the scope by a human.
- **Abort:** rate limits exhausted, breaker trip, scope violation.

### PR Guardian
- **Purpose:** review every PR, triage every issue, respond to discussion.
- **Cadence:** daily or event-driven (while a session lives).
- **Target level:** L1 — reviews/comments are outward-facing and need a grant;
  merging/closing stay human at every level.
- **Abort:** rate limits exhausted, breaker trip, scope violation.

### Dependency Patch Sweeper
- **Purpose:** keep dependencies current at **patch level** only.
- **Cadence:** weekly.
- **Target level:** L2; **L1 form** = report available patch bumps, no PRs.
- **Change scope (L2):** lockfiles + manifest patch versions only. No
  minor/major bumps, no new packages. Respect any "don't install packages
  younger than N days" rule.
- **Rate limits:** e.g. max 3 bump PRs/run, one dependency per PR.
- **Abort:** rate limit exhausted, breaker trip, scope violation, or a red
  test suite after a bump (revert, report, stop).
- **Verification:** an independent checker runs the test gate on each bump PR
  before it opens.

## Scheduling — Portable, Then Tool-Specific

Continuity comes from **persisted state + re-entry**, never from a long-lived
process. Assume every session dies (usage caps, timeouts, failed wakeups).

- **Portable baseline (works everywhere):** an external scheduler — OS `cron`
  or a CI schedule (e.g. GitHub Actions `on: schedule`) that starts a **fresh**
  agent session pointed at the loop's re-entry prompt. Each run is a re-entry,
  so it survives dead sessions.
- **Tool-specific, in-session (cannot revive a dead session):**
  - *Claude Code:* routines / scheduled triggers, or PR-activity subscriptions
    that wake a *running* session on review/CI events.
  - *Others (Codex, Copilot, Cursor, …):* whatever cron/CI hook the platform
    exposes — same rule: prefer the fresh-session re-entry.

**Installing or changing a schedule is a human decision** — the loop proposes
a cadence; the human wires it.

## The Re-entry Prompt

The loop's scheduled entry point should, in order:
1. Read the **durable state file** first.
2. Trip the **circuit breaker** if recorded spend exceeds the ceiling → stop.
3. Reconstruct where the last run left off (pending verification first).
4. Do one run's worth of work, inside scope, within rate limits.
5. Write the run record (what was done, escalations, **spend**, scope
   compliance) back to the state file.

## Portability Note

This skill's core (SKILL.md + this reference + the template) uses only the
portable Agent Skills fields (`name`, `description`, markdown, bundled files),
so it works across Agent-Skills-compatible tools. Anything tool-specific is
labeled as such above.
