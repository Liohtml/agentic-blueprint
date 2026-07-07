---
name: setup-autonomous-loop
description: Sets up a safe, gated autonomous agent loop — scheduled repo maintenance, a PR guardian, a dependency sweeper, or a custom loop — with an autonomy level (L1 report / L2 propose / L3 push), a declared change scope, rate limits, an abort condition, and a cost circuit breaker. Use when the user wants to run an agent unattended or on a schedule, automate repo maintenance, "design a loop instead of prompting", or make autonomous agent work safe with human gates.
---

# Set Up an Autonomous Loop

This skill turns "I want an agent to run unattended" into a **gated autonomous
loop**: a declared level of independence, a bounded change scope, and abort
conditions — so the loop amplifies good judgment instead of amplifying
mistakes. It is the portable distillation of the Agentic Blueprint's
gated-autonomy model. Full canon (deeper than needed to act):
[autonomy-levels](https://github.com/Liohtml/agentic-blueprint/blob/master/blueprint/loops/autonomy-levels.md)
·
[operations-loops](https://github.com/Liohtml/agentic-blueprint/blob/master/blueprint/loops/operations-loops.md).

## Core Idea

You are not writing one prompt — you are designing a **loop** that will run
again and again without you in the room. The whole discipline is deciding, up
front, **what may happen without a human present.** That is the autonomy level.
Everything the loop is allowed to touch is the **change scope**. Everything
else is **escalated, never done.**

## The Autonomy Levels (one axis)

| Level | May do without a human | Never |
|-------|------------------------|-------|
| **L1 Report** | Observe, triage, write a report/draft for the human | Change anything; act outward |
| **L2 Propose** | Make changes inside its scope, verified by an independent checker, delivered as a **branch/PR only** | Push to the working branch; merge |
| **L3 Push** | Commit + push to the working branch on a schedule, inside its scope | Merge |

**Human gates hold at every level** — never automate these:
- **Merging** — always a human decision.
- **Scope changes and deletions** — always escalated.
- **Outward-facing actions** (creating issues, posting comments, publishing) —
  only under an explicit grant recorded by the human, with rate limits.
  Without a grant, an L1 loop reports *to the human*, not to the world.

## Procedure

Work through these with the user; produce a filled `LOOP.md` (template in
`templates/LOOP.md.template`) plus the wiring instructions.

1. **Name the job.** One sentence: what does this loop maintain or produce?
   Pick a pattern if one fits (`reference/autonomy-and-patterns.md`):
   repo-health audit, PR guardian, dependency patch sweeper, or custom.

2. **Start at L1.** Every new loop starts at **L1**, whatever its target level.
   Promotion is a later human decision on a track record (see step 8).

3. **Declare the change scope.** A path allowlist + allowed change types
   (e.g. "lockfiles + manifest patch versions only", "docs/ only, no
   deletions"). L1 scope is "none (report-only)" plus any explicitly granted
   outward actions. Anything outside → escalate.

4. **Set rate limits.** Max actions per run (e.g. "max 3 PRs/run, one change
   per PR"). Keeps a misfire small.

5. **Define the abort condition.** The loop MUST be able to stop itself:
   rate limit exhausted, circuit-breaker trip, scope violation, or a failing
   verification. A scope violation always **stops the run and escalates** (the
   runtime abort); the *governance* consequence is separate — see step 10.

6. **Wire the cost circuit breaker** (a pair — the second half is what makes
   the first real):
   - Every run **records its actual spend** in the durable state file at run
     end.
   - Every re-entry **reads that record first**; if spend since the baseline
     exceeds the ceiling → first action is **stop + report**.
   - Honest limit: a hard mid-run token stop is not enforceable in most agent
     runtimes. **Recording is what arms the breaker** — no record, no breaker.

7. **Choose the durable state file.** The loop is stateless between runs;
   continuity comes from a **file, not a process**. It records: run history,
   what was attempted, blockers, and the spend from step 6. A fresh session
   re-enters by reading this file first.

8. **Verification (L2+).** An **independent checker** (separate context —
   never the maker reviewing itself) validates each change before it becomes a
   PR. This is the "no self-review" gate.

9. **Wire the schedule** — but note: **installing or changing a schedule is a
   human decision.** Offer the portable baseline (cron / CI schedule that
   starts a fresh session) over anything that assumes a long-lived process; a
   dead session cannot resume itself. See `reference/autonomy-and-patterns.md`
   for tool-specific hooks (Claude Code routines, GitHub Actions, etc.).

10. **Set the promotion rule.** Default: **5 consecutive clean runs**, then a
    human promotes L1→L2→L3 (logged). A run is *clean* when the loop took no
    **unjustified autonomous action**. **Escalations are always clean** — never
    penalize the loop for asking. Governance consequence of a scope violation:
    at **L2/L3** it demotes one level; an **L1** violation, or **repeated**
    violations at any level, **suspends the loop** pending human review.

## Output

- A completed `LOOP.md` for the project (from the template).
- The scheduler-wiring snippet for the user's tool.
- A one-line summary of the level, scope, and abort condition the user is
  signing off on.

Do **not** install a schedule, grant outward actions, or raise the autonomy
level yourself — surface each as a decision for the human.

## Anti-patterns

- A loop with no abort condition — that is "fire and forget", not a gated loop.
- A cost ceiling with no spend recording — an unarmed breaker; it will never
  fire.
- Starting a new loop at L2/L3 "to save time" — every loop earns its level.
- The maker checking its own work — verification needs a separate context.
