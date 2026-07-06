# Operations Loops — the Maintenance Loop Class

> The feature loops ([Build-Test](build-test-loop.md), [Cleanup-Verify](cleanup-verify-loop.md),
> [Review-Fix](review-fix-loop.md)) improve a **feature**. The
> [Improvement Loop](improvement-loop.md) improves the **system**. Operations
> loops **maintain the repository** — on a cadence, between feature work.
> Pattern catalog adapted from
> [loop-engineering](https://github.com/cobusgreyling/loop-engineering)
> (Cobus Greyling), rebuilt on this blueprint's gates.

## What Makes a Loop an Operations Loop

Feature loops are triggered by a phase; the improvement loop is triggered by a
maintainer go. Operations loops are triggered by a **schedule** (cron, GitHub
Actions, a Claude Code routine). Each run is a fresh session that re-enters
from persisted state — the mechanism is not restated here: the canonical
scheduling and interruption/resumption doctrine lives in
[improvement-loop.md](improvement-loop.md) ("Running It Unattended").

**Installing or changing a schedule is a maintainer decision — never the
agent's** (the cadence analog of the improvement loop's trigger rule). Once
installed, the schedule triggers runs.

## Pattern Format

Every operations loop declares all of the following before its first run:

| Field | Meaning |
|-------|---------|
| **Purpose** | What the loop maintains, in one sentence |
| **Cadence** | How often it runs (and via which scheduler) |
| **Target autonomy level** | L1-L3 per [autonomy-levels.md](autonomy-levels.md) — the loop still **starts at L1** and is promoted on track record |
| **Change scope** | Path + change-type allowlist (L2+); outward-facing grants listed explicitly |
| **Rate limits** | Max actions per run |
| **Abort condition** | When the run stops itself and escalates |
| **Escalation** | Where out-of-scope findings and ambiguity go |
| **Cost ceiling** | Per-run ceiling, enforced via the [circuit-breaker pair](autonomy-levels.md#cost-circuit-breaker-unattended-runs) |
| **Durable state** | The file the loop reads on re-entry and writes at run end (run record incl. spend + scope compliance) |

The mandatory **abort condition** is how this class satisfies Core Principle 6
("agents work in loops with defined abort conditions"): rate-limit exhaustion,
a circuit-breaker trip, and any scope violation are always abort conditions;
patterns may add their own. Operations loops have no iteration cap — rate
limits and the breaker are their hard limits.

## Starter Catalog

Three patterns. The first two formalize prompts this repo already ships; their
operational numbers stay **canonical in the prompt** — this spec points, it
does not restate (two sources of truth would drift).

> Note for copiers: both existing prompts are written for this repo's owner
> (`Liohtml` is hardcoded). Replace the owner/repo references before use.

### 1. Repo Health Audit

- **Purpose:** periodic audit across security, bugs, dependencies, tests,
  README, and issue triage.
- **Cadence:** weekly (daily for actively developed repos).
- **Target level:** L1 — report to the maintainer. Creating `[repo-health]`
  issues and small fix PRs is an **outward-facing/L2 grant** the maintainer
  may add to the change scope; the prompt's own constraints (1-2 files,
  <50 lines, no business logic) then define that scope.
- **Rate limits, escalation, constraints:** canonical in
  [repo-health-agent.md](../prompts/repo-health-agent.md) ("Rules &
  Constraints", "Rate limiting").
- **Abort condition:** rate limits exhausted, breaker trip, or scope violation.
- **Status in this repo:** the prompt ships here and has been used ad hoc; no
  schedule is installed (that installation is a logged maintainer decision).

### 2. PR Guardian

- **Purpose:** review every PR, triage every issue, respond to discussion —
  the repo's institutional memory.
- **Cadence:** daily, or event-driven (PR-activity subscriptions) while a
  session lives — see the in-session caveat in improvement-loop.md.
- **Target level:** L1 — reviews and comments are outward-facing and require
  an explicit maintainer grant (the prompt already forbids merging and closing
  without human approval; that stays absolute per
  [autonomy-levels.md](autonomy-levels.md)).
- **Rate limits, escalation, personality guardrails:** canonical in
  [repo-guardian-agent.md](../prompts/repo-guardian-agent.md).
- **Abort condition:** rate limits exhausted, breaker trip, or scope violation.

### 3. Dependency Patch Sweeper

- **Purpose:** keep dependencies current at **patch level** without human
  babysitting.
- **Cadence:** weekly.
- **Target level:** L2. **L1 form (where it starts):** report available patch
  bumps as a summary for the maintainer — no PRs.
- **Change scope (L2):** lockfiles + manifest **patch versions only**. No
  minor/major bumps, no new packages. The blueprint's 14-day package rule
  applies unchanged: a patch younger than 14 days is reported, not bumped.
- **Rate limits:** max 3 bump PRs per run, one dependency per PR.
- **Abort condition:** rate limit exhausted, breaker trip, scope violation, or
  a failing test suite after a bump (revert the bump, report, stop).
- **Escalation:** minor/major updates, security advisories, and anything
  failing verification go into the run report.
- **Verification (maker/checker):** an independent checker runs the project's
  test gate on every bump PR before it is opened.
- **Durable state:** the loop's run-record file (for this repo: the backlog's
  Loop status section).
- **Prompt:** [dependency-sweeper-agent.md](../prompts/dependency-sweeper-agent.md)

## See Also

- [autonomy-levels.md](autonomy-levels.md) — levels, human gates, promotion
  rules, circuit breaker (canonical)
- [improvement-loop.md](improvement-loop.md) — scheduling baseline,
  interruption & resumption protocol (canonical)
- [orchestration.md](../agents/orchestration.md) — maker/checker and
  adversarial verification patterns
