# Backlog — Continuous Improvement Loop

> Working document of the orchestrator loop. Each cycle: pull 1-3 items from "Open" →
> research + devil's-advocate review → implement → test → push → update this file.
> Strategic direction questions go to the maintainer — they are never guessed.

## Open (prioritized)

- [ ] **Create the good-first-issues on GitHub** — drafts live in
  `docs/community/good-first-issues.md`; needs maintainer go (outward-facing).
- [ ] **Enable GitHub Discussions** (Show and Tell / Q&A / Ideas) and mark the repo as a
  **Template Repository** — both are repo settings only the maintainer can flip.
- [ ] **Demo GIF for the README** — animated Observer/agent-team banner (the single
  biggest README conversion lever per the AFFiNE playbook). Needs a recorded session.
- [ ] **New blueprint templates from research cycle 1:** RUBRIC.md.template (outcome-graded
  loops, +10pp task success per Anthropic), HANDOFF.md.template (relay pattern),
  LEARNINGS.md template (project memory), team-sizing heuristics in agent-teams.md
  (3-5 teammates, 5-6 tasks each). Partly reserved as good-first-issues — don't
  implement what is published as a community starter task.
- [ ] **SPEC.md.template + SDD mapping page** — connect the 6 phases to the
  spec-driven-development four-phase loop (GitHub Spec Kit, Kiro, OpenSpec converge on it).
- [ ] **Observer: effort/task-budget display** — verify transcript data shapes per the
  DATA-NOTES process first, then extend parser/UI (from the Fable 5 evaluation, wave 3).
- [ ] **Check CLAUDE.md.template / AGENTS.md.template against v1.3** — mission mode,
  4-tier model strategy and the new context rules must be reflected in generated files.
- [ ] **End-to-end worked example** — a small real project showing a full 6-phase run
  (not just the Observer as a reference).
- [ ] **German translation** — once English content stabilizes, offer DE as a translation
  (maintainer decision 2026-06-09: English is the primary language).

## In progress (cycle 1 — 2026-06-09)

- [x] Research agent: agentic-coding innovations, onboarding patterns, contributor strategies
- [x] Devil's advocate: critique from non-technical / senior engineer / contributor perspectives
- [ ] Implementation wave (3 agents, strict file ownership):
  - README & onboarding (README.md, observer/README.md, docs/GETTING-STARTED.md, docs/glossary.md)
  - Contributor funnel (CONTRIBUTING.md, .github/, docs/community/good-first-issues.md)
  - Blueprint translation to English + dead-link fixes + canonical pricing source (AGENTIC-BLUEPRINT.md, blueprint/**)

## Done

- [x] **2026-06-09 (cycle 0):** Fable 5 evaluation + roadmap waves 1-3 — 4-tier model
  strategy, mission mode, task budgets, cloud execution profile, observer pricing fix,
  modernized context rules. See `docs/2026-06-09-fable-5-evaluation.md` and PR #7.

## Decision log (maintainer feedback)

| Date | Question | Decision |
|---|---|---|
| 2026-06-09 | Continuous improvement loop with engineering team + devil's advocate, orchestrator model | ✅ Maintainer vision, loop started (30-min cycles) |
| 2026-06-09 | Primary repo language | ✅ English (German optional as a translation later) |
| 2026-06-09 | Delete sources/ + docs/superpowers/ (DA recommendation) | ❌ Keep everything — don't advertise it, but don't delete |
| 2026-06-09 | Positioning | ✅ Honest "Built for Claude Code"; core principles may be noted as transferable |

## Loop rules (short version)

1. No item gets implemented without surviving devil's-advocate review.
2. Strict file ownership per implementation agent — no two agents on the same file.
3. Observer tests must be green before every push (`cd observer && npx vitest run`).
4. Small, clean commits. No merge, no force-push — merging stays with the maintainer.
5. Scope / branding / structural questions → ask the maintainer.
