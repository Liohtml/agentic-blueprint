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
- [ ] **Observer: effort/task-budget display** — verify transcript data shapes per the
  DATA-NOTES process first, then extend parser/UI (from the Fable 5 evaluation, wave 3).
- [ ] **End-to-end worked example** — a small real project showing a full 6-phase run
  (not just the Observer as a reference).
- [ ] **German translation** — once English content stabilizes, offer DE as a translation
  (maintainer decision 2026-06-09: English is the primary language).

## In progress

(nothing — next cycle starts on the next heartbeat)

## Done

- [x] **2026-06-09 (cycle 2):** SPEC.md.template + docs/spec-driven-development.md
  (Blueprint ↔ SDD mapping, SPEC → PLAN → rubric chain), phase 0/1 cross-links,
  glossary entries (Acceptance Criteria, SPEC, SDD). Devil's-advocate review applied:
  no phantom gate, non-circular when-to-spec heuristic, honest Spec Kit description,
  Phase 3 correctly placed inside Implement, PLAN terminology aligned (Success Criteria).
- [x] **2026-06-09 (cycle 1, v1.4):** English-first release. Research agent (15 sourced
  ideas) + devil's advocate (10 findings, 2 blockers) + 3 implementation agents:
  "first 10 minutes" quickstart, GETTING-STARTED (non-technical + developer tracks),
  glossary, contributor funnel (.github/, CONTRIBUTING, 5 good-first-issue drafts),
  full DE→EN translation of the blueprint, dead-link fixes, canonical price source,
  observer/README drift fix, template alignment. All DA blockers resolved.
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
