# Spec-Driven Development (SDD) and the Blueprint

> How the Blueprint maps onto the SDD loop that the major frameworks converged
> on through 2025, and where the [SPEC template](../blueprint/templates/SPEC.md.template)
> fits between Phase 0 and Phase 1.

## What SDD is

Spec-Driven Development inverts the usual order: instead of prompting an agent
with an idea and refining the result, you write an explicit, reviewable
specification first and treat it as the source of truth for everything
downstream. The major frameworks — [GitHub Spec Kit](https://github.com/github/spec-kit),
AWS Kiro, OpenSpec, BMAD — differ in tooling and naming (Spec Kit splits
Implement into `/tasks` + `/implement`; some make Verify an explicit step,
others fold it into Implement), but converged on the same core loop:

1. **Specify** — what and why: problem, scope, testable behavior, acceptance criteria
2. **Plan** — how: architecture, constraints, ordered work items
3. **Implement / Tasks** — execute the plan in reviewable units
4. **Verify** — check the result against the spec, not against vibes (explicit in some frameworks, implicit in others)

This is not a new methodology for us. The Blueprint has worked this way since
v1 — SDD is the industry converging on the same shape. Adopting the shared
vocabulary and adding one explicit artifact (the SPEC file) makes the Blueprint
interoperable with these frameworks without changing any phase or gate.

## Mapping: Blueprint phases ↔ SDD phases

| SDD phase | Blueprint phase(s) | Artifact |
|---|---|---|
| Specify | 0 — Ideation & Scoping | [SPEC.md](../blueprint/templates/SPEC.md.template) (formalized Phase 0 output) |
| Plan | 1 — Planning | [PLAN.md](../blueprint/templates/PLAN.md.template) with Chunks |
| Implement / Tasks | 2 — Building + 3 — Structure Cleanup | Code + tests (Chunk or Mission Mode), then refactored structure |
| Verify | 2 (gate) + 4 — Review Loop | Chunk done criteria checked at the Phase 2 gate; the Phase 4 gate checks quality (score 5/5) *and* the full acceptance-criteria list on the assembled result |
| *(Ship — beyond the SDD loop)* | 5 — Merge & Validate | Merged PR after Human Go |

Phase 3 (Structure Cleanup) is a Blueprint addition *inside* Implement — it
refactors, it does not verify anything against the spec. Verification is split:
each Chunk's done criterion is checked at the Phase 2 gate, and the Phase 4 gate
re-checks the complete criteria list against the assembled result. The explicit
Ship phase with a human gate is a superset of the SDD loop, not a deviation from it.

## When to write the SPEC

After the [Phase 0 gate](../blueprint/phases/00-ideation.md) passes, before
[Phase 1](../blueprint/phases/01-planning.md) starts. Phase 0 may end with
informal notes or an issue; the SPEC turns that into one structured file the
planning agent can consume. Rule of thumb (checkable *before* any planning):
write a SPEC when the feature will clearly span more than one Chunk's worth of
work — more than ~5 files, or more than a day. For a one-file bugfix, the issue
itself is enough — do not add ceremony where a sentence suffices.

The SPEC stays human-owned: the human resolves the Open Questions and sets the
status to `approved`. That preserves principle 1 — *human thinks, agent builds*.
If the SPEC and the plan ever diverge, the SPEC wins: change the SPEC first,
then update the plan — never the other way around.

## SPEC → PLAN → RUBRIC

One chain of criteria, refined at each step but never reinvented:

```
SPEC Acceptance Criteria          (binary-checkable, written at the Phase 0/1 boundary)
        │  Phase 1 gate: each criterion is covered by ≥1 Chunk done criterion
        ▼
PLAN Success Criteria             (the plan's Success Criteria section; coverage comes
                                   from the per-Chunk done criteria)
        │  Cloud Execution Profile: the plan's criteria checklist passed 1:1 as rubric
        ▼
Outcome rubric                    (user.define_outcome — independent grader)
```

If a criterion appears in the rubric that is not traceable back to the SPEC,
either the SPEC was incomplete (fix it) or scope crept in (cut it). See
[managed-agents.md](../blueprint/agents/managed-agents.md) for the rubric
mechanics.

## Why this matters for Mission Mode

Mission Mode on Fable 5 delivers the complete specification as *one* prompt in
the first turn — its rule #1 is "full spec up front", and underspecified
Missions are expensive guessing (see [02-building.md](../blueprint/phases/02-building.md)).
Before the SPEC template, that first turn was assembled ad hoc from Phase 0
notes plus the plan. With it, the Mission prompt has a fixed, complete shape:
Behavior gives the testable statements, Constraints bound the solution space,
Acceptance Criteria become the Mission prompt's Definition of Done, and an empty Open
Questions section proves the human already made the calls the agent would
otherwise have to guess or escalate mid-run. Same model, same phases — fewer
clarification round-trips and fewer wasted iterations.

## External references

- [GitHub Spec Kit](https://github.com/github/spec-kit) — reference SDD framework; its
  `/specify` → `/plan` → `/tasks` → `/implement` commands cover Specify/Plan/Implement
  (verification there happens inside implement; the Blueprint makes it an explicit phase)
- Related in the Blueprint: [00-ideation.md](../blueprint/phases/00-ideation.md),
  [01-planning.md](../blueprint/phases/01-planning.md),
  [SPEC.md.template](../blueprint/templates/SPEC.md.template)
