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

## Loop status

**Loop restarted 2026-07-02 by maintainer go** for one v1.7 cycle ("free hand —
make the repo ultra strong for agent systems in the loop"). **Cycle in progress —
committed with post-implementation DA review pending** (design-stage DA is done:
approve-with-fixes, all fixes applied; the verification DA of the shipped artifacts
is outstanding and is the first action before the cycle closes). Once it passes,
the loop is idle again pending the next maintainer go. Before that, the loop
had ended on 2026-06-10 (maintainer decision) with PR #7 merged and Antigravity
removed (v1.5). Remaining open items are community-reserved (good-first-issues) or
maintainer-gated (repo settings, demo GIF, observer data shapes) — see Open above.
A new loop can be started any time with
[blueprint/prompts/improvement-orchestrator.md](../blueprint/prompts/improvement-orchestrator.md).

> Note for the PR: absolute GitHub links from blueprint/ files to docs/ (SDD page,
> pricing.ts) point at `master` and 404 until PR #7 merges — intentional, they serve
> the copy-into-your-project use case after the merge.

## Done

- [x] **2026-07-02 (v1.7, loop-codification cycle):** The Improvement Loop shipped
  as a first-class framework component — the loop this repo ran on itself is now a
  spec (`blueprint/loops/improvement-loop.md`, incl. the canonical interruption &
  resumption protocol and an honest "Running it unattended" section), plus
  deterministic orchestration patterns for Fable 5
  (`blueprint/agents/orchestration.md`: fan-out/pipeline, adversarial verification,
  judge panels, loop-until-dry, structured result contracts), the loop's working
  memory as a template (`blueprint/templates/BACKLOG.md.template`), and the
  previously missing orchestrator prompt
  (`blueprint/prompts/improvement-orchestrator.md`). Item entered Open via the
  maintainer go of 2026-07-02 (decision log) and shipped the same cycle. DA review
  of the design BEFORE implementation: approve-with-fixes — 2 blockers (loop
  bookkeeping self-application; continuity mechanisms attributed to the wrong
  layer), 7 major, 4 minor; all fixes applied, package cut from 5 files to 4.
  Orchestrator prompt dry-run-tested in a fresh session against a simulated
  "DA pending" backlog state before push.

- [x] **2026-06-10 (v1.6, user-testing cycle):** Onboarding hardening after a real
  non-technical tester failed at setup. Setup wizard prompt (agent does the whole
  setup; existing vs. empty project), `scripts/start-team.sh` (one command replaces
  four manual tmux steps, plain-language preflight errors), Docker sandbox guide +
  template (`docs/docker-sandbox.md`, `sandbox/`), agent-teams runbook in
  "Type this → You should see" format. DA review with the failed-tester lens:
  3× approve-with-fixes, 13 fixes applied (incl. copied-blueprint script paths,
  tmux flag for existing sessions, node:22 image, Claude Code install explainer).
  Version decision logged: three user-facing features → v1.6.

- [x] **2026-06-10 (cycle 4, v1.5):** Wrap-up — Antigravity removed repo-wide
  (file deleted, 8 live documents cleaned, verification grep empty; historical docs
  untouched), dogfooding retro on cycles 0-3 (docs/retros/), learnings persisted into
  a repo-root CLAUDE.md, PR #7 merged, loop ended by maintainer decision.
- [x] **2026-06-10 (cycle 3):** End-to-end worked example (docs/examples/): full 6-phase
  run on a fictional expense-tracker CLI with filled SPEC/PLAN artifacts, one failed
  build-test iteration, one rejected review finding. DA verdict: 3× approve-with-fixes,
  2× approve — all 16 fixes applied, incl. the headline finding (the example now walks
  through the new Phase 1/Phase 4 gate items and checks off the SPEC criteria on the
  assembled result) and two DA-legitimized canonical gaps closed: Execution Mode
  section added to PLAN.md.template, mode-proposal line added to the Phase 1 prompt.
- [x] **2026-06-09/10 (cycle 2):** SPEC.md.template + docs/spec-driven-development.md
  (Blueprint ↔ SDD mapping, SPEC → PLAN → rubric chain), phase 0/1 cross-links,
  glossary entries (Acceptance Criteria, SPEC, SDD). Full DA review (after the
  session-limit interruption): 5× approve-with-fixes, no reject — all fixes applied:
  binary AC example, SPEC threshold aligned with the chunk rule (>1 chunk / ~5 files),
  SPEC-wins conflict rule, traceability now **gate-enforced** (new Phase 1 gate item:
  every AC covered by a chunk done criterion; new Phase 4 gate item: criteria
  verified on the assembled result), DoD terminology aligned, hardcoded name removed.
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
| 2026-06-10 | Remove Antigravity entirely | ✅ Removed in v1.5 — roles covered by teammates / second Claude Code agent |
| 2026-06-10 | Finish planned work, merge PR #7, end the loop | ✅ Executed — see Loop status |
| 2026-07-02 | Restart the loop for a Fable 5 rework, "free hand to make the repo ultra strong for agent systems in the loop" | ✅ Maintainer go — v1.7 cycle: codify the improvement loop + orchestration patterns (see Done) |

## Loop rules (short version)

1. No item gets implemented without surviving devil's-advocate review.
2. Strict file ownership per implementation agent — no two agents on the same file.
3. Observer tests must be green before every push (`cd observer && npx vitest run`).
4. Small, clean commits. No merge, no force-push — merging stays with the maintainer.
5. Scope / branding / structural questions → ask the maintainer.
