# Blueprint Changelog

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
