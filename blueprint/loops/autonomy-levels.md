# Autonomy Levels — L1 / L2 / L3

> Policy document, not a loop spec. It lives in `loops/` because loops are its
> consumers — every loop in this directory declares a level from this file.
> Adapted from the maturity phases in
> [loop-engineering](https://github.com/cobusgreyling/loop-engineering)
> (Cobus Greyling), reworked for this blueprint's gate model.

Every autonomous loop runs at a declared **autonomy level**. The levels sit on
a single axis: **what may happen without a human present.** Everything else —
*which* files and change types a loop may touch — is the orthogonal
[change scope](#change-scope-orthogonal-to-the-level) declaration.

## The Levels

| Level | Name | May do without a human | May never do |
|-------|------|------------------------|--------------|
| **L1** | Report | Observe, triage, and write a report/draft for the maintainer | Change anything; act outward |
| **L2** | Propose | Make changes inside its change scope, verified by an independent checker, delivered as a **branch/PR only** | Push to the working branch; merge |
| **L3** | Push | Commit and push to the working branch on a schedule, inside its change scope | Merge |

At every level, the **human gates** hold. This file is the canonical owner of
the list (other docs point here):

- **Merging** — always a human decision, at every level.
- **Scope changes and deletions** — always escalated, never decided by the loop.
- **Outward-facing actions** (creating issues, posting comments, publishing) —
  never automated **unless** the maintainer has explicitly granted them as part
  of the loop's change scope, with rate limits, logged in the decision log.
  Without such a grant, an L1 loop reports *to the maintainer* (summary file,
  draft), not to the outside world.

## Change Scope (orthogonal to the level)

Every loop at L2 or above declares a **change scope** up front: a path
allowlist plus allowed change types (e.g. "lockfiles + manifest patch versions
only", "docs/ only, no deletions"). A scope may be narrow or — by explicit,
logged maintainer grant — broad. Anything outside the scope is **escalated,
never done.**

## Promotion and Demotion

- **Every new loop starts at L1**, regardless of its declared *target* level.
- **Promotion is a maintainer decision**, logged in the decision log. The
  evidence is the loop's **existing auditable trail** — the artifacts it
  already produces (reports, PRs, commits, and its durable state file's run
  entries, including recorded spend and scope compliance). No separate run
  database exists or is required; if the trail is empty, there is nothing to
  promote on.
- Default track record: **5 consecutive clean runs** — the maintainer may set
  a different N per loop in `config.md`. A run is *clean* when the loop took
  no **unjustified autonomous action** (something it did that it should have
  escalated). **Escalations are always clean** — a loop is never penalized
  for asking.
- **Violations:** a scope violation at L2/L3 demotes the loop one level. Any
  violation at L1 (an L1 loop that acted at all) — or repeated violations at
  any level — **suspends the loop pending maintainer review**.

## Cost Circuit Breaker (unattended runs)

Unattended runs get a **cost ceiling**, enforced as a pair — the second half
is what makes the first half real:

1. **Every unattended run records its actual spend** in the loop's durable
   state file at run end (e.g. from the
   [Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md)
   or `/cost`), alongside a one-line scope-compliance note.
2. **Every re-entry reads that record first.** If recorded spend since the
   ceiling's baseline exceeds the ceiling, the run's first action is
   **stop + report** — no new work.

Honest framing: mid-run hard token stops are not enforceable in Claude Code
(`task_budget` remains a soft limit), and **if no spend record exists, the
breaker cannot fire — recording is what arms it.** A loop that skips step 1
has no circuit breaker, whatever its config says.

## Where the Existing Loops Sit

- **Build-Test, Cleanup-Verify, Review-Fix** — run inside human-triggered
  phases and deliver into a PR: **L2 by construction.**
- **The Improvement Loop, run unattended** — commits and pushes on re-entry:
  **L3 with a broad scope grant**, logged as a maintainer decision. Attended
  cycles (maintainer present) are ordinary supervised work; levels govern what
  happens *without* a human.
- **Operations loops** ([operations-loops.md](operations-loops.md)) — declare
  a target level in their pattern spec and start at L1 like every new loop.

## See Also

- [operations-loops.md](operations-loops.md) — the cadence-driven loop class
  that consumes these levels
- [improvement-loop.md](improvement-loop.md) — interruption/resumption
  protocol and unattended-run doctrine (canonical)
