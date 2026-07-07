# Blueprint Changelog

## v1.10 — 2026-07-06

Gated autonomy, formalized — an autonomy maturity model and a second loop
class, adapted from the maturity phases and pattern catalog of
[loop-engineering](https://github.com/cobusgreyling/loop-engineering)
(Cobus Greyling) and rebuilt on this blueprint's gate model. Maintainer go
2026-07-06 ("repo admin free hand" after a sourced research pass over that
repo). Design DA before implementation: approve-with-fixes — 4 blockers
(the ops catalog contradicted the "issues are never automated" gate; the
level model bundled two axes so the repo's own unattended improvement loop
fit no level; promotion required a track record nothing recorded; the
re-entry circuit breaker had no data source), 7 major, 7 minor — all applied.
A second, verification DA on the shipped diff: approve-with-fixes — 2 blockers
(an L1 table cell contradicting the grant mechanism in the same file; the
backlog's exit artifact stating a PR existed before it did), 5 major
(grandfathering rule for pre-existing loops, scope declaration required for
unattended L1, single-source for the sweeper's numbers, pattern-vs-instance
field ownership, L1 operation notes so the two legacy prompts are actually
runnable at L1), 5 minor — all applied in the closing commit.

### New
- **Autonomy Levels** (`blueprint/loops/autonomy-levels.md`, canonical): a
  single axis — what may happen without a human. **L1 report / L2 propose
  (branch/PR only) / L3 push (never merge)**; change scope as an orthogonal
  declaration; human gates owned here (merging always human; outward-facing
  actions only under an explicit, logged maintainer grant with rate limits);
  promotion by maintainer decision on a clean track record read from the
  loop's existing auditable trail (default 5 clean runs, escalations always
  clean — only unjustified autonomous actions count against a loop); L1
  violations or repeated violations suspend the loop. **Cost circuit breaker
  as a pair**: every unattended run records actual spend in its state file,
  every re-entry reads it first — recording is what arms the breaker; mid-run
  hard stops remain honestly unenforceable.
- **Operations Loops** (`blueprint/loops/operations-loops.md`): the second
  loop class — cadence-driven maintenance with a mandatory pattern format
  (incl. **abort condition**, satisfying Core Principle 6; rate limits and
  the breaker replace iteration caps). Installing/changing a schedule is a
  maintainer decision (cadence analog of the improvement loop's trigger
  rule). Starter catalog: Repo Health Audit and PR Guardian formalize the
  two prompts this repo already ships (numbers stay canonical in the
  prompts), plus a new Dependency Patch Sweeper (target L2, starts L1,
  patch-only scope, 14-day rule kept, maker/checker verification).
- **`blueprint/prompts/dependency-sweeper-agent.md`**: the sweeper as a real
  prompt (L1 report mode by default, L2 only after logged promotion; scope
  violation = self-suspend).
- **Portable skill `skills/setup-autonomous-loop/`**: the gated-autonomy model
  packaged as an [Agent Skills](https://agentskills.io) open-standard bundle
  (SKILL.md + reference + LOOP.md template) so it installs into any
  Agent-Skills-compatible tool (Claude Code, Codex, …), not just projects that
  copy `blueprint/`. Uses only portable frontmatter fields; canon stays in
  `blueprint/loops/` with a new CLAUDE.md sync rule binding the two. Its own
  DA pass (on Opus, Fable at quota): approve-with-fixes — 2 blockers
  (scope-violation consequence contradicted canon's demote-vs-suspend split;
  missing sync rule), 2 major (vendor-list overclaim hedged to capability;
  linking convention extended to copied-out skill bundles), 3 minor — all
  applied. `skills/` is a new top-level directory (README structure tree +
  linking conventions updated).

### Changed
- `AGENTIC-BLUEPRINT.md` (v1.10): loop classes & autonomy levels paragraph in
  the Feedback Loops section; two new Safety Rules — declared change scope
  for unattended runs, and the record-then-read cost circuit breaker.
- `blueprint/loops/improvement-loop.md`: hard rails updated — the cost
  ceiling is now the breaker pair (was: "monitored convention"); the
  human-gates list points at its new canonical owner (autonomy-levels.md);
  unattended operation classified as L3 with a broad, logged scope grant;
  opening taxonomy mentions the third loop class.
- `blueprint/config.md`: "Autonomous Loops" instance table (deployment
  decisions live here, pattern definitions in operations-loops.md — one
  owner each; honestly framed as a maintainer checklist, not a self-firing
  gate).
- README: version badge 1.10; structure tree gains the two loop specs and
  the sweeper prompt.
- `docs/BACKLOG.md`: cycle recorded per the loop's own bookkeeping (maintainer
  go + LEARNINGS-boundary question in the decision log, Done entry, Loop
  status with the cycle's declared change scope).

### Explicitly not adopted (logged rationale)
- STATE.md/run-history template (collides with the community-reserved
  LEARNINGS.md territory — needs a separate maintainer boundary decision),
  CLI tooling clones (the Observer is this repo's tooling investment),
  tool-agnostic starters (contradicts the logged "Built for Claude Code"
  positioning), a machine-readable pattern registry (three patterns need no
  index).

### Version decision
Additive (two loop specs, one prompt, config section, one portable skill); no
phase/gate-semantics breakage for existing copies → minor bump to 1.10, per the
v1.7 precedent. The `setup-autonomous-loop` skill folds into 1.10 (still
unreleased) as the portable packaging of the same gated-autonomy work rather
than minting a separate version.

## v1.9 — 2026-07-03

Model retiering to a role-based doctrine — **"judgment up, volume down"**:
**Fable 5 = Brain** (judgment moments: architecture, devil's-advocate reviews,
judge/verify stages, Mission Chunks), **Opus 4.8 = Orchestrator** (team Lead,
loop cycles, hard logic), **Sonnet 5 = Worker/Researcher** (volume tier),
**Haiku 4.5 = Scout**. Maintainer vision (decision log 2026-07-03). This
**reverses** the 2026-06-09 Fable 5 evaluation's "the Lead belongs on Fable"
guidance — the rationale is qualitative maintainer judgment plus the observed
pattern across this repo's loop cycles that the DA/verify steps, not
orchestration, were consistently the highest-leverage moments.

### Changed
- `blueprint/meta/decision-trees.md` (canonical): role-based tree with the
  escalation rule; cost anchors gain Sonnet 5 (incl. dated intro pricing and
  the new-tokenizer caveat) and the effort-levels line; Hybrid tree now "Opus
  orchestrates, Fable on call" with the worker-is-the-brain exception kept for
  Missions (incl. Mission-sized teammate tasks).
- `blueprint/agents/orchestration.md`: new "Model per stage — the brain
  pattern" section with a tiered pipeline skeleton and the **escalation rule**
  (ambiguous verdicts, borderline aborts, and scope-interpretation calls go to
  a brain judgment call or the human — the orchestrator never settles them).
- `blueprint/prompts/improvement-orchestrator.md`: orchestrator model
  recommendation corrected from "top-tier" to Opus-tier + brain-on-call (DA
  blocker: the repo's most-executed prompt contradicted the new doctrine).
- Tiering language aligned in `AGENTIC-BLUEPRINT.md` (v1.9),
  `blueprint/agents/agent-teams.md` (table, spawn example, rule of thumb,
  Observer example), `blueprint/templates/team-prompt.md`,
  `blueprint/config.md`, README; `blueprint/loops/review-fix-loop.md` one-shot
  note rescoped to Missions.
- `observer/src/collector/pricing.ts` + test: `claude-sonnet-5` entry added
  ($3/$15 standard; comment notes the intro window) so the Observer prices the
  recommended volume tier without the unknown-model fallback warning.

### Known inconsistency (maintainer-gated)
- `docs/glossary.md` "Model Tiering" entry still says "Fable 5 for the lead" —
  the glossary is community-reserved (good-first-issue 3) and the interactive
  maintainer ask was unavailable this cycle; logged in the backlog for an
  explicit one-line-correction decision.

## v1.8 — 2026-07-03

Viral README restructure — the fold rebuilt around a visible one-message entry
and "gated autonomy" positioning, grounded in a sourced research pass over five
breakout agent-repo READMEs (browser-use, spec-kit, OpenHands, cline, OpenClaw)
and DA-reviewed against overclaiming (approve-with-fixes: 2 blockers, 6 major,
8 minor — all applied). Maintainer decision: version bump to 1.8 per the v1.6
precedent (onboarding/README work carries a version).

### New
- **README fold**: one-message paste entry (raw URL, works on first fetch) with
  a beginner explainer, safety hook in the tagline ("Autonomous agents. Human
  gates."), "Start in 60 Seconds" uncollapsed, Level 2 one-paste for the
  Improvement Loop, "Vibe coding vs. Blueprint" before/after table, "What this
  is NOT" honesty block (incl. "not enforced by a runtime — the human with the
  merge button is the enforcement mechanism"), Level 3 (teams/observer/sandbox)
  compressed, structure tree and alternative starts collapsed. Live stars badge
  replaces the static PRs-welcome shield.
- **Orchestrator bootstrap** (`blueprint/prompts/improvement-orchestrator.md`):
  FIRST ACTION now covers the first run in a fresh project — if the backlog file
  doesn't exist, create it from BACKLOG.md.template, record the maintainer go,
  ask for the first Open items (DA blocker: the Level 2 paste previously pointed
  at a file the wizard never creates).

### Changed
- Claims aligned with the corpus's own hedging: "survives any crash" →
  "designed to resume from a single backlog file"; claude.ai path honestly
  labeled "a guided walkthrough, not the full setup"; footer "95%" replaced
  with "nearly all" + commit-history receipt.
- `docs/BACKLOG.md`: maintainer repo-settings virality checklist (topics,
  social preview, template button, Discussions, star-history only >500 stars).
- Hero demo GIF: placeholder + recording spec in the README source
  (maintainer-gated — needs a real session recording).

## v1.7 — 2026-07-02

The Improvement Loop — the self-improving system the repo ran on itself in June
2026, codified as a first-class framework component. Maintainer-initiated cycle
("free hand to make the repo ultra strong for agent systems in the loop"),
devil's-advocate-reviewed before implementation (approve-with-fixes: 2 blockers,
7 major, 4 minor — all applied, including shrinking the package from 5 files to 4).

### New
- **Improvement Loop** (`blueprint/loops/improvement-loop.md`): the 4th feedback
  loop, operating on the system itself — backlog → research → DA review →
  implement → test → push → backlog update. Standard loop skeleton, the
  devil's-advocate gate, the canonical interruption & resumption protocol
  (continuity from persisted state + re-entry, never from long-lived processes),
  and a "Running it unattended" section with honest mechanism attribution:
  external schedulers (cron / GitHub Actions) are the portable baseline;
  in-session mechanisms (interval skills, PR-activity subscriptions) cannot
  revive a dead session; state-based resumption is the guaranteed layer.
- **Orchestration patterns** (`blueprint/agents/orchestration.md`): deterministic
  multi-agent patterns for Fable 5 — fan-out/pipeline (barriers only when a stage
  needs all results), adversarial verification (N independent refuters), judge
  panels, loop-until-dry, the improvement-cycle pipeline, plus structured result
  contracts (research finding / DA verdict / implementation report JSON envelopes)
  as the canonical machine contracts between pipeline stages.
- **`blueprint/templates/BACKLOG.md.template`**: the loop's working memory —
  Open / Loop status / Done / Decision log / Loop rules — generalized from this
  repo's own `docs/BACKLOG.md`. The file IS the loop state; a fresh session
  resumes from it alone.
- **`blueprint/prompts/improvement-orchestrator.md`**: the copy-paste prompt that
  starts or RESUMES the loop in any blueprint project (the backlog referenced
  "re-running the orchestrator prompt" — the prompt now actually exists).
  Non-negotiables at the top (no-git subagents, DA gate, file ownership, test
  gate, maintainer escalations), first action = resume pending DA reviews from
  the backlog. Dry-run-tested before shipping: a fresh session with no memory,
  given only the prompt and a simulated "DA pending" backlog, correctly
  reconstructed the cycle state and prioritized the pending review over new
  items; its one finding (pin the WIP commit hash in Loop status) is applied
  in the prompt's interruption protocol and the template's Pending line.

### Changed
- `AGENTIC-BLUEPRINT.md`: version 1.7; Improvement Loop row in the feedback-loop
  table (with item-count-vs-iteration-cap semantics footnote); Orchestration role
  section.
- README: version badge 1.7; the "Self-Evolving" claim now points at the real
  mechanism (improvement loop + orchestrator prompt) instead of only the retro
  template; project-structure tree now includes `blueprint/prompts/`.
- `docs/BACKLOG.md`: v1.7 cycle recorded per the loop's own bookkeeping rules
  (maintainer go in the decision log, item through Open → Done) — the shipped
  backlog is itself a valid instance of the loop it documents.

### Version decision
Additive (new loop, new docs, new template, new prompt); no phase/gate/loop-semantics
changes, no restructure → minor bump to 1.7, consistent with the v1.6 precedent.
2.0 would falsely signal breakage to projects that copied `blueprint/`.

## v1.6 — 2026-06-10

Onboarding hardening — driven by real user testing (a non-technical tester
failed at setup), implemented as wizard + one-command launcher + Docker
sandbox, then devil's-advocate-reviewed with 13 fixes applied.

### New
- **Setup wizard prompt** (`blueprint/templates/setup-wizard-prompt.md`, also
  inline in the README): one copy-paste message and the agent does the entire
  setup itself — detects existing vs. empty project, fetches the blueprint
  files (with a no-tools fallback), interviews for config.md one question at
  a time with defaults, generates CLAUDE.md/AGENTS.md, ends with a ready
  Phase 0 prompt. Safety rules: never overwrite without asking, merge —
  never replace — existing agent files, no git commands in the project.
- **`scripts/start-team.sh`**: one command replaces the four manual Agent
  Teams steps — plain-language preflight checks (git/node≥20/claude/tmux≥3
  with install hints), sets the experimental flag (including for existing
  tmux sessions), starts claude in the caller's project folder, optional
  `--observer <team>` pane that stays open on failure, `--check`, `--help`.
- **Docker sandbox** (`docs/docker-sandbox.md` + `sandbox/` template):
  run agents safely in a container — Dev Container path for beginners and
  plain-docker path, with an honest "what the sandbox does NOT protect"
  section, persistent-login volume hint, and a commented node:22 Dockerfile
  + devcontainer.json.

### Changed
- README "Your First 10 Minutes" and Quick Start now lead with the wizard
  (manual clone+cp kept as the alternative); a plain-language paragraph
  explains what Claude Code is and how to open it in a folder.
- `docs/GETTING-STARTED.md`: explicit "existing project vs. starting from
  scratch" paths with what-you-should-see expectations; docker-sandbox
  pointer.
- `blueprint/agents/agent-teams.md`: runbook rewritten in "Type this →
  You should see" format, three-row troubleshooting table (not-in-tmux,
  flag-not-set, GPU-terminal rendering), and an explicit note that the
  helper scripts live in the repo clone — with a curl one-liner for
  copied-blueprint users.

## v1.5 — 2026-06-10

Antigravity removed; dogfooding retro; continuous-loop wrap-up.

### Removed
- **Antigravity agent role** (maintainer decision): `blueprint/agents/antigravity.md`
  deleted; all live documents now use generic roles — teammates in an Agent Team,
  or a second Claude Code agent in a separate session. UI/design work goes to a
  Sonnet teammate, orchestration is the Lead role, reviews go through `/code-review`
  plus a second agent. Historical documents (older changelog entries, the Fable 5
  evaluation, planning artifacts) are unchanged on purpose.

### New
- **docs/retros/2026-06-10-continuous-loop-retro.md** — the repo's own retro template
  applied to the continuous-improvement loop (cycles 0-3), including the honest
  failure points (session-limit interruption, a protocol-violating subagent commit,
  the twice-dead heartbeat, the worked example initially skipping its own new gates).
- **CLAUDE.md** (repo root) — the retro's learnings persisted as agent rules for
  working on this repository (dogfooding, DA-review requirement, file ownership,
  test gate, link conventions, good-first-issues reservation).

## v1.4 — 2026-06-09

English-first release: onboarding, contributor funnel, full translation
(cycle 1 of the continuous improvement loop — research agent + devil's
advocate + three implementation agents with strict file ownership).

### New
- **"Your First 10 Minutes"** copy-paste quickstart (no terminal required) and a
  beginner/expert path table in the README.
- **docs/GETTING-STARTED.md**: guided first win in under 15 minutes, with a
  non-technical (browser-only) and a developer track plus troubleshooting.
- **docs/glossary.md** (18 core terms) and **docs/BACKLOG.md** as the public roadmap.
- **Contributor funnel**: CONTRIBUTING.md rewritten around minimal friction with
  explicit maintainer promises, `.github/` issue and PR templates, and five
  ready-to-post good-first-issue drafts (`docs/community/good-first-issues.md`).

### Changed
- **Entire blueprint + root doc translated German → English** (maintainer decision;
  a German translation is welcome as a future contribution).
- **Honest positioning**: "Built for Claude Code" — removed "Cursor, Codex, or
  similar"; core principles noted as transferable.
- README requirements split per path — resolves the "no dependencies, that's it"
  contradiction with the tmux/Node/CLI requirements of the Agent Teams path.
- blueprint→observer links are now absolute GitHub URLs so they survive the
  copy-into-your-project use case.
- `decision-trees.md` is the single canonical source for model price anchors.
- `CLAUDE.md.template` context rules aligned with v1.3 (no hard 30/70 thresholds,
  direct source access as the dependency default).

### Fixed
- `observer/README.md` architecture section now matches the real file tree
  (the old text described directories that never existed).
- Removed the placeholder YouTube link in the README credits.
- README version badge synced with the blueprint version.

## v1.3 — 2026-06-09

Mission Mode + wave 2 of the Fable 5 roadmap.

### New
- **Mission Mode** in Phase 2 (`02-building.md`): second execution mode on
  Fable 5 — complete spec in the first turn, binary Definition of Done,
  effort high/xhigh, Gates unchanged. Plus mode selection as step 6 + Gate
  in Phase 1 and a new decision tree (Chunk vs Mission vs Hybrid).
- **Task Budgets** (`output_config.task_budget`, beta) as an optional soft
  token limit in all three loop specs — iteration limits remain the hard limit.
- **Persisting learnings** in the retro template (CLAUDE.md / Blueprint PR /
  agent memory) + cost and model-mix metrics.
- **Cloud Execution Profile** (`blueprint/agents/managed-agents.md`): Phases 2–4
  as a managed-agent session with an outcome rubric — the Phase 1 plan becomes a
  gradeable rubric, loop limits become `max_iterations`, the grader structurally
  enforces "no self-review". Incl. local-vs-cloud decision tree.

### Changed
- **Context rules relaxed** (`AGENTIC-BLUEPRINT.md`): hard 30%/70% thresholds
  removed — new thread on phase transitions or imprecision; curation
  remains mandatory (1M context + server-side compaction).
- **`npx open-source` demoted to fallback** — default is direct source access
  via grep/read/web_fetch (Principle 3, quick rules, config.md).
- **Review tree modernized**: `/code-review` skill + second agent as the first
  stage, Greptile as external fallback. Antigravity Profile B (review) dropped —
  secondary agent in config.md now optional.
- Blueprint version in `AGENTIC-BLUEPRINT.md` synchronized to 1.3 (was at 1.0).

### Checked, no change needed
- Prompt language audit: no aggressive trigger language (CRITICAL/MUST/"when in doubt")
  found in the templates — hits in `repo-health-agent.md` are severity labels.

## v1.2 — 2026-06-09

Fable 5 reassessment (wave 1 of the roadmap).

### New
- **Fable 5 evaluation** (`docs/2026-06-09-fable-5-evaluation.md`): complete
  reassessment of all Blueprint components against the Fable 5 release (keep /
  relax / downgrade / integrate) plus a 3-wave roadmap.
- **4-tier Model Tiering** (Fable 5 / Opus / Sonnet / Haiku) in
  `agent-teams.md`, `team-prompt.md` and a new decision tree in
  `decision-trees.md`. Fable 5 for Lead + Mission Chunks, Haiku for explore.

### Fixed
- **Observer pricing** (`observer/src/collector/pricing.ts`): Opus 4.8 corrected
  to $5/$25 (was incorrectly at $15/$75), Haiku 4.5 to $1/$5, Fable 5
  ($10/$50) added.

### Planned (waves 2/3, see evaluation)
- Mission Mode in Phase 2, Task Budgets in loop specs, relax context rules,
  prompt language audit, outcome-graded loops (managed agents), memory for retros.

## v1.1 — 2026-06-09

Agent Teams + live observability.

### New
- **Agent Teams setup** (`blueprint/agents/agent-teams.md`): real Teammates in tmux
  split panes instead of subagents/workflow — feature flag, tmux prerequisite + Ghostty
  caveat, runbook, Model Tiering, cost notes, cleanup.
- **Agent Observer** (`observer/`): local live dashboard showing status, runtime,
  tokens (in/out/cache), cost estimate, activity, tasks, and messages of every
  agent of a running team from Claude Code's own `~/.claude` files.
  Node `http` + SSE backend, Vite/React/Tailwind/uPlot frontend. Start: `npm run observe`.
- Built by a 10-member Agent Team ("agent-observer") following strict File
  Ownership partitioning and shared-contract-first.

## v1.0 — 2026-05-22

Initial version of the Agentic Engineering Blueprint.

### Included
- 6 core principles
- 6-phase model (ideation to merge)
- Agent roles: Claude Code + Antigravity (3 profiles)
- Multi-agent coordination protocol
- Context engineering rules and hierarchy
- 3 feedback loops with abort conditions
- 4 quality Gates
- Templates for CLAUDE.md, AGENTS.md, PLAN.md, PR
- Meta system: bootstrapping, decision trees, retro template
- Based on: "Why This Dev Ships 100x Faster" (David Ondrej / Mickey Podcast)
