# Improvement Loop

The three other loops ([Build-Test](build-test-loop.md), [Cleanup-Verify](cleanup-verify-loop.md),
[Review-Fix](review-fix-loop.md)) improve a **feature**. This loop improves the
**project itself** — the framework, its docs, its tooling — cycle by cycle. It is the
codification of the loop this repository ran on itself in June 2026:
[dogfooding retro](https://github.com/Liohtml/agentic-blueprint/blob/master/docs/retros/2026-06-10-continuous-loop-retro.md),
[live backlog](https://github.com/Liohtml/agentic-blueprint/blob/master/docs/BACKLOG.md) (the worked example).

## Phase

Meta — it runs between and across feature work, not inside phases 0-5. Each cycle
uses the feature loops internally where they apply.

## Trigger

The backlog's **Open** section is non-empty **AND** the maintainer has given an
explicit go. Starting or restarting the loop is a maintainer decision — never the
agent's.

## Flow (one cycle)

```
LOOP (one cycle):
  1. Pull 1-3 items from the backlog's Open section
  2. Research: sourced findings (links, data, precedent), not vague ideas
  3. Devil's-advocate review of the proposal
     Verdict: approve / approve-with-fixes / reject
     - reject, no viable fix path → EXIT LOOP (abort)
  4. Implement via parallel subagents:
     - strict file ownership (no two agents on the same file)
     - implementation agents run NO git commands
  5. Apply the DA fixes
  6. Run the project's test gate
  7. Orchestrator commits and pushes
  8. Update the backlog:
     - move items to Done with date + summary
     - log any maintainer decisions in the decision log
  9. Backlog Open empty OR maintainer stop?
     - YES → EXIT LOOP
     - NO → next cycle → GOTO LOOP
```

## Max Items per Cycle

**3.** Note: this is an **item count, not an iteration cap**. Within a cycle, the
three feature loops keep their own hard iteration limits (5 / 3 / 7). The number of
cycles is unbounded — the loop runs until an abort condition fires.

## On Success (per cycle)

Pushed commits + an updated backlog. **The backlog entry is the cycle's exit
artifact** — if the Done section doesn't record what shipped, the cycle isn't done.

## On Abort

- Maintainer stop decision — **never continue past a maintainer stop**
- Empty backlog (nothing left in Open)
- DA reject with no viable fix path

In every case: stop and report (loop status in the backlog, summary to the
maintainer). Do not restart on your own — see Trigger.

## The Gate: Devil's-Advocate Review

Nothing ships without surviving devil's-advocate review. This is the loop's quality
gate, the equivalent of Phase 4's "an agent never reviews itself".

Track record from this repo's own run: the DA found **substantive defects in 4 of 4
cycles** — including in freshly written rules. The headline finding was a
self-application failure: a change introduced new gate items and failed to apply
them to its own example in the same commit. Therefore: **new gate items must be
applied to everything shipped in the same change.** Fresh rules are the easiest to
forget; the DA is not optional even (especially) for small cycles.

## Working Memory: the Backlog File

The backlog file is the loop's **only durable state** — a file, not a process.
Template: [BACKLOG.md.template](../templates/BACKLOG.md.template). Sections:

- **Open (prioritized)** — candidate items for the next cycles
- **Loop status** — is the loop running, ended, or interrupted; anything pending
- **Done** — one entry per shipped cycle: date, summary, DA verdict, fixes applied
- **Decision log** — every maintainer question and answer, with date
- **Loop rules** — the short-form rules agents must follow in this repo

Strategic questions — scope, deletions, structure, branding, anything
outward-facing — go to the maintainer and are logged in the decision log.
**Never guessed.**

## Interruption & Resumption Protocol

> This section is the canonical home of this protocol — other docs point here.

Assume every process dies: sessions hit usage caps, monitors time out, wakeups fail
to fire. Continuity comes from **persisted state + re-entry**, never from a
long-lived process.

**If an external limit interrupts mid-cycle:**
1. Commit work-in-progress with a transparent **"unreviewed, DA pending"** note in
   both the commit message and the backlog's Loop status.
2. The pending review is the **first action of the next session** — before any new
   item is touched.

**Re-entry procedure (fresh session):**
1. Read the backlog first.
2. Reconstruct the cycle state from Loop status.
3. Complete any pending DA review, then continue the interrupted cycle or start the
   next one.

## Running It Unattended

The guaranteed layer is the state-based resumption above. Scheduled re-entry is
best-effort on top of it — pick mechanisms by what they can actually survive:

- **Portable baseline: an external scheduler.** OS cron or a GitHub Actions
  schedule starts a **fresh** agent session with the
  [orchestrator prompt](../prompts/improvement-orchestrator.md). Works everywhere
  and survives dead sessions, because each run is a re-entry, not a continuation.
- **In-session mechanisms — cannot revive a dead session.** Interval/loop skills
  can re-run a prompt while the session lives; GitHub MCP PR-activity subscriptions
  can wake a *running* session on review comments or CI events
  (environment-dependent). Useful for tightening a live loop, useless once the
  session dies — never rely on them as the only scheduler.
- **Cloud:** managed-agent sessions for overnight single missions, and scheduled
  deployments where available (beta) — see
  [managed-agents.md](../agents/managed-agents.md).

**Hard rails for unattended cycles:**

- The feature loops' iteration caps stay **hard limits**.
- A per-cycle cost ceiling is a **monitored convention, not an enforced limit** —
  the orchestrator checks actual usage at cycle end (e.g. via the
  [Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md))
  and stops if the ceiling is exceeded.
- These human gates are **never automated**: merging, scope changes, deletions,
  anything outward-facing (issues, posts, publishing).

Every unattended cycle leaves an auditable trail: commits + backlog updates.

## See Also

- [orchestration.md](../agents/orchestration.md) — how to run the
  research → DA → implement pipeline deterministically with structured verdicts
- [decision-trees.md](../meta/decision-trees.md) — model tiering and cost decisions
  (not duplicated here)
