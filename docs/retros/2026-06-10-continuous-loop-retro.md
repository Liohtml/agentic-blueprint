# Post-Feature Retro

> Run this retro after every larger feature or sprint.
> Goal: continuously improve the Blueprint.

**Feature:** Fable 5 restructure + continuous improvement loop, cycles 0-3
**Date:** 2026-06-10
**Agents involved:** Claude Code (orchestrator), research subagent, devil's-advocate (DA) review subagent, up to 3 parallel implementation subagents per cycle
**Duration:** 2 days (2026-06-09 to 2026-06-10), 4 cycles: 0 (Fable 5 evaluation, 3 waves), 1 (English-first, v1.4), 2 (SPEC/SDD), 3 (worked example)

---

## What Went Well?

- **The devil's advocate found real substance every single time** — not style nits.
  Examples: gate-enforcement gaps (SPEC traceability existed on paper but no gate
  checked it — cycle 2 added Phase 1/Phase 4 gate items), number inconsistencies
  across docs, and the headline cycle-3 finding (see Surprises). DA verdicts:
  cycle 1: 10 findings / 2 blockers caught before implementation; cycle 2:
  5× approve-with-fixes; cycle 3: 3× approve-with-fixes / 2× approve, 16 fixes —
  all applied.
- **Strict file ownership held up**: up to 3 implementation agents ran in parallel
  (cycle 1: quickstart/onboarding, contributor funnel, DE→EN translation) with
  zero file collisions and zero merge conflicts.
- **The research agent delivered sourced, actionable ideas** (15 in cycle 1) instead
  of vague suggestions — several converted directly into backlog items and shipped work.
- **Escalation discipline worked**: 3 strategic questions (primary language, proposed
  deletions, positioning) went to the maintainer and were all answered *before*
  implementation started — nothing had to be reverted for a wrong guess.

## What Went Badly?

- **A session usage limit interrupted cycle 2 mid-DA-review.** The work had to be
  committed unreviewed, with a transparent note in the commit/backlog. The DA review
  was completed afterwards (verdict: 5× approve-with-fixes, no reject) and the fixes
  landed in a follow-up commit — but for a window of time, unreviewed work sat on the
  branch, which violates the spirit of loop rule 1.
- **One implementation agent violated the "no git commands" protocol** and committed
  its own work instead of leaving commits to the orchestrator. No damage, but the rule
  clearly was not prominent enough in the subagent prompt.
- **The heartbeat monitor died twice at its timeout** instead of running persistently —
  the loop only continued because the orchestrator noticed manually. "Continuous" was,
  in practice, manually restarted.
- **The worked example initially ignored exactly the gate items that the same commit
  introduced** (the new Phase 1/Phase 4 SPEC-traceability gates). The DA caught it;
  the fixed example now walks through those gate items explicitly. Embarrassing, but
  a strong argument for never skipping the DA.

## Surprises

- The most valuable DA finding was self-referential: we shipped new gates and then
  failed to apply them to our own example *in the same change*. Assumption "the author
  agent knows its own fresh rules best" — wrong. Fresh rules are the easiest to forget.
- Wrong assumption: "a 30-min heartbeat just keeps running." External limits (session
  usage caps, tool timeouts) are a real failure mode of long-running loops and need an
  explicit protocol, not hope.
- Positive: the DA-review step never degenerated into rubber-stamping — even cycle 3,
  the smallest scope, produced 16 substantive fixes.

## Numbers

| Metric | Value |
|--------|-------|
| Chunks planned (here: cycles) | 4 |
| Chunks executed (here: cycles) | 4 |
| Build-Test Loop average (iterations) | n/a (not tracked) |
| Cleanup-Verify Loop average | n/a (not tracked) |
| Review-Fix Loop average | 1 DA iteration per cycle (fixes applied in one pass) |
| Escalations to the human | 3 (language, deletions, positioning) — all answered pre-implementation |
| Final review scores | Cycle 1: 10 findings / 2 blockers (pre-impl., all resolved); cycle 2: 5× approve-with-fixes; cycle 3: 3× approve-with-fixes, 2× approve (16 fixes) |
| Total cost (USD, from the Observer) | n/a (Observer not running during the loop) |
| Model mix (share Fable/Opus/Sonnet/Haiku) | n/a (not tracked) |

## Blueprint Adjustments

> What should be changed in the Blueprint based on this experience?

- [x] Adjust prompt templates: make the **no-git rule for implementation subagents more
      prominent** (top of the prompt, not buried in protocol notes) — one agent committed
      on its own this sprint.
- [x] Adjust loop limits: add a **loop rule for external interruptions** — if a session
      limit or timeout interrupts a cycle mid-review, commit work-in-progress with a
      transparent "unreviewed, DA pending" note and complete the review first thing in
      the next session. Also: heartbeat/monitor processes must be restartable and are
      assumed to die — the orchestrator re-checks loop state at session start.
- [x] Adjust Gate checklists: add a self-application check — **changes that introduce new
      gate items must apply those items to everything shipped in the same change**
      (caught by the DA in cycle 3).
- [ ] Sharpen agent roles: no change needed — research / DA / implementation split worked.
- [ ] New phase/loop needed? No — the existing cycle structure (research → DA → implement
      → test → push → backlog update) held up across all 4 cycles.

## Persisting Learnings

> Learnings that should influence future runs do not belong only in this doc —
> they must land where agents read them automatically.

- [x] `CLAUDE.md` / `AGENTS.md` updated (project-specific rules) — repo-root `CLAUDE.md`
      created from this retro (DA review mandatory, file ownership, no-git for
      implementation agents, test gate, escalation rules).
- [ ] Blueprint change proposed as a PR (framework-wide rules) — the adjustments above
      ship on this branch; framework-wide template changes go into the next cycle.
- [ ] Agent memory updated — no memory store configured for this repo yet.

## Conclusion

The devil's-advocate review is the single highest-leverage step of the loop — it caught
real defects in all four cycles, including in its own freshly written rules. The weakest
point is not quality but **continuity**: external limits and dying monitors interrupt the
loop, so resumption (commit-with-note, review-after, restartable heartbeat) must be a
written protocol rather than improvisation.
