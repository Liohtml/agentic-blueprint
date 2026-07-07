# Backlog — Continuous Improvement Loop

> Working document of the orchestrator loop. Each cycle: pull 1-3 items from "Open" →
> research + devil's-advocate review → implement → test → push → update this file.
> Strategic direction questions go to the maintainer — they are never guessed.

## Open (prioritized)

- [ ] **Create the good-first-issues on GitHub** — drafts live in
  `docs/community/good-first-issues.md`; needs maintainer go (outward-facing).
- [ ] **Enable GitHub Discussions** (Show and Tell / Q&A / Ideas) and mark the repo as a
  **Template Repository** — both are repo settings only the maintainer can flip.
- [ ] **Repo-settings virality checklist (maintainer-only, from research cycle v1.8):**
  set ~8 topics (`ai-agents`, `claude`, `claude-code`, `agentic-workflow`,
  `developer-tools`, `prompt-engineering`, `multi-agent`, `ai-engineering`); verify
  `assets/social-preview.png` is uploaded under Settings → Social preview (1280×640,
  <1MB — the README banner is not the social preview; it must be uploaded in Settings
  separately); consider tagged releases per
  blueprint version as a growth cadence. **Star-history chart: do NOT add until
  >500 stars** — a flat line signals the opposite of traction.
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

**The v1.10 cycle (gated-autonomy formalization, maintainer go 2026-07-06) is
complete** — design DA approve-with-fixes (18 findings, all applied before
implementation), verification DA on the shipped diff approve-with-fixes
(2 blockers, 5 major, 5 minor — all applied in the closing commit; mid-cycle
commit d0ded9f carried the transparent "verification DA pending" note per the
interruption protocol). Shipped via this branch's PR — merging stays with the
maintainer. Attended cycle
(maintainer-triggered, orchestrator supervised), so the new unattended-run
spend-recording rule does not bind it; noted here explicitly because the rule
ships in this cycle and applies from the first unattended run onward. Declared
change scope of the cycle (self-application of the new scope rule):
`blueprint/loops/` (2 new specs), `blueprint/prompts/dependency-sweeper-agent.md`
(new), `AGENTIC-BLUEPRINT.md`, `blueprint/config.md`,
`blueprint/loops/improvement-loop.md`, `blueprint/meta/changelog.md`,
`README.md` (badge + structure tree), `docs/BACKLOG.md` — no deletions, no
observer/ source changes, no outward-facing actions (the PR is the cycle's
deliverable — an L2/L3 output, not an outward-facing action under the new
taxonomy). Scope compliance: clean.

**Loop restarted 2026-07-02 by maintainer go** for one v1.7 cycle ("free hand —
make the repo ultra strong for agent systems in the loop"); that cycle is complete.
**The v1.9 cycle (Brain/Orchestrator/Worker retiering, maintainer go 2026-07-03) is
complete** — the loop is idle again pending the next maintainer go (the glossary
one-liner follow-up got its maintainer go and is done, see the decision log). The
v1.8 cycle (viral README restructure) completed earlier the same day. Mid-cycle, commit c29944a
was pushed with a transparent "unreviewed, DA pending" note (interruption protocol);
the DA then returned approve-with-fixes and all fixes landed in the closing commit. (Mid-cycle, commit
a4a5fda was pushed with a transparent "verification DA pending" note — the loop's
own interruption protocol in action; the verification DA then returned
approve-with-fixes and all fixes landed in the closing commit.) Before that, the loop
had ended on 2026-06-10 (maintainer decision) with PR #7 merged and Antigravity
removed (v1.5). Remaining open items are community-reserved (good-first-issues) or
maintainer-gated (repo settings, demo GIF, observer data shapes) — see Open above.
A new loop can be started any time with
[blueprint/prompts/improvement-orchestrator.md](../blueprint/prompts/improvement-orchestrator.md).

> Note for the PR: absolute GitHub links from blueprint/ files to docs/ (SDD page,
> pricing.ts) point at `master` and 404 until PR #7 merges — intentional, they serve
> the copy-into-your-project use case after the merge.

## Done

- [x] **2026-07-06 (v1.10, gated-autonomy cycle):** Autonomy maturity model +
  operations-loop class, adapted from
  [loop-engineering](https://github.com/cobusgreyling/loop-engineering) after a
  sourced comparison pass (maintainer go: "repo admin free hand"). Shipped:
  `autonomy-levels.md` (L1 report / L2 propose / L3 push on a single axis;
  change scope orthogonal; human gates canonically owned there; promotion on
  auditable track record, default 5 clean runs, escalations always clean;
  record-then-read cost circuit breaker), `operations-loops.md` (pattern
  format with mandatory abort condition; catalog formalizing repo-health +
  repo-guardian with numbers canonical in the prompts; new Dependency Patch
  Sweeper), `dependency-sweeper-agent.md` prompt, two new Safety Rules in the
  root doc, improvement-loop hard rails upgraded to the breaker pair,
  config.md instance table. Design DA: approve-with-fixes — **4 blockers**
  (ops catalog vs. "issues never automated" contradiction; two-axis level
  model that fit none of our own loops; promotion track record with no data
  source; circuit breaker with no data source), 7 major, 7 minor — **all 18
  applied** before implementation. Deliberately not adopted: STATE.md
  template (LEARNINGS.md community boundary), CLI clones, tool-agnostic
  starters, pattern registry. Verification DA on the shipped diff:
  approve-with-fixes — 2 blockers (L1 table cell vs. grant mechanism;
  premature "PR open" claim in this file), 5 major (grandfathering,
  unattended-L1 scope declaration, sweeper single-source, pattern-vs-instance
  field ownership, L1 operation notes for the legacy prompts), 5 minor —
  all 12 applied in the closing commit. **Follow-on (same branch):** the
  gated-autonomy model packaged as a portable
  [Agent Skills](https://agentskills.io) bundle
  `skills/setup-autonomous-loop/` (new top-level `skills/` dir) so it installs
  into Claude Code, Codex, and other Agent-Skills tools — not just projects
  copying `blueprint/`. Skill DA (on Opus, Fable at quota):
  approve-with-fixes — 2 blockers (scope-violation demote-vs-suspend drift;
  missing CLAUDE.md sync rule), 2 major (vendor-list overclaim hedged;
  linking convention extended to skill bundles), 3 minor — all applied. New
  CLAUDE.md sync rule binds the skill to canon.

- [x] **2026-07-03 (v1.9, retiering cycle):** Role-based model doctrine shipped —
  "judgment up, volume down": Fable 5 = Brain (DA/judge/verify, architecture,
  Missions), Opus 4.8 = Orchestrator (Lead, loop cycles, hard logic), Sonnet 5 =
  Worker/Researcher, Haiku 4.5 = Scout. Canonical rework in decision-trees.md
  (incl. escalation rule + Sonnet 5 cost anchors with intro-pricing/tokenizer
  caveats), "Model per stage — the brain pattern" in orchestration.md, alignment
  across root doc/agent-teams/team-prompt/config/README/review-fix-loop, and the
  orchestrator prompt's model recommendation corrected (DA blocker). Observer:
  claude-sonnet-5 pricing entry + test. DA on the design: approve-with-fixes —
  1 blocker, 5 major (incl. "~80% mechanics" overclaim dropped; changelog states
  the reversal of the 2026-06-09 evaluation explicitly), 4 minor; all applied
  except the glossary one-liner (maintainer-gated, see Open). Prices/IDs verified
  against the current API reference.

- [x] **2026-07-03 (v1.8, viral-README cycle):** README rebuilt for the 5-second
  test — visible one-message paste entry (raw URLs), "gated autonomy" tagline with
  the safety hook in the hero, "Vibe coding vs. Blueprint" before/after table,
  Improvement Loop as Level 2 with its own one-paste, "What this is NOT" honesty
  block, progressive disclosure (structure tree + alternative starts collapsed),
  live stars badge. Research: 15 sourced findings verified against five breakout
  agent-repo READMEs. DA on the concrete diff: approve-with-fixes — 2 blockers
  (Level-2 paste pointed at a backlog file the wizard never creates → orchestrator
  prompt got a first-run bootstrap branch; "survives any crash" overclaimed past
  the spec's own hedging → reworded to the honest mechanism), 6 major, 8 minor;
  all applied. Wizard-prompt sync rule verified byte-identical. Maintainer
  decisions: version bump to 1.8; GIF recording + repo settings remain
  maintainer-gated (see Open).

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
  maintainer go of 2026-07-02 (decision log) and shipped the same cycle. Two DA
  passes: design DA before implementation (approve-with-fixes — 2 blockers: loop
  bookkeeping self-application, continuity mechanisms attributed to the wrong
  layer; 7 major, 4 minor; all applied, package cut from 5 files to 4) and a
  verification DA on the shipped artifacts (approve-with-fixes — 1 major: an
  unbacked "scheduled deployments" claim, removed; 3 minor: template link that
  would break on copy-out, README table semantics footnote, auditability of the
  dry-run claim; all applied). Orchestrator prompt dry-run-tested: a fresh
  session with only the prompt and a simulated "DA pending" backlog correctly
  prioritized the pending review over new items; its finding (pin the WIP commit
  hash in Loop status) was applied to prompt + template.

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
| 2026-07-03 | Rebuild the README for maximum attention/virality — "so simple a primary-schooler can set up an autonomous agent loop" | ✅ Maintainer go — v1.8 cycle; Hugging Face MCP server installed for image generation (needs maintainer HF token for auth) |
| 2026-07-03 | Bump the blueprint version to 1.8 for the README cycle, or keep 1.7? | ✅ Bump to 1.8 (v1.6 precedent: onboarding/README work carries a version + changelog entry) |
| 2026-07-03 | Model-tiering doctrine: Fable 5 as brain, Opus 4.8 as orchestrator, Sonnet 5 as worker/researcher ("judgment up, volume down") — inverts "Lead belongs on Fable" | ✅ Maintainer vision, v1.9 cycle go |
| 2026-07-03 | Glossary "Model Tiering" one-line maintenance correction (entry contradicted v1.9 doctrine; glossary otherwise community-reserved per good-first-issue 3) | ✅ Maintainer go — single row corrected, Issue 3 (extension + cross-links) stays reserved |
| 2026-07-06 | Adopt loop-engineering concepts (autonomy levels, operations loops, scope/breaker safety) — "repo admin free hand, deliver maximum value, PRs/merge allowed" | ✅ Maintainer go — v1.10 cycle. Merge still left to the maintainer: the blanket grant predates the content, and "no merge without human approval" reads as approval of the specific change |
| 2026-07-06 | STATE.md/run-history template vs. community-reserved LEARNINGS.md — where is the boundary? | ⏳ Open — needs an explicit maintainer boundary decision before any run-history template ships (logged, not guessed) |
| 2026-07-07 | Package the v1.10 gated-autonomy work as a portable Skill for Claude Code, Codex etc. ("/run-skill-generator … Up to You") | ✅ Maintainer go (broad admin grant) — built `skills/setup-autonomous-loop` on the Agent Skills open standard. Recommended defaults chosen (one flagship skill; top-level `skills/`) since the interactive question tool errored; logged here so the maintainer can redirect scope/home if desired |

## Loop rules (short version)

1. No item gets implemented without surviving devil's-advocate review.
2. Strict file ownership per implementation agent — no two agents on the same file.
3. Observer tests must be green before every push (`cd observer && npx vitest run`).
4. Small, clean commits. No merge, no force-push — merging stays with the maintainer.
5. Scope / branding / structural questions → ask the maintainer.
