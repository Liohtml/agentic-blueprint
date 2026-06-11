# agentic-blueprint

## Project
The Agentic Engineering Blueprint: a framework for building software with AI agents
(6 phases, feedback loops, quality gates), plus the Agent Observer dashboard.
This repo **dogfoods its own blueprint** — every change here follows the process
it describes.

## Read First
- [AGENTIC-BLUEPRINT.md](AGENTIC-BLUEPRINT.md) — the framework itself, and the
  working instruction for agents in this repo.
- [docs/BACKLOG.md](docs/BACKLOG.md) — the roadmap and working doc of the
  continuous improvement loop, including the maintainer decision log.

## Language
English-first. All content, commits, and docs in English. (Maintainer decision
2026-06-09; a German translation may come later as a separate contribution.)

## Workflow Rules
- **No change ships without a devil's-advocate review.** Every backlog item goes
  through research → DA review → implement → fix → test before push.
- **Strict file ownership for parallel agents.** No two agents touch the same
  file in the same cycle. Declare ownership up front.
- **Implementation agents run NO git commands.** No commit, no push, no branch
  operations — the orchestrator commits. This applies to subagents without exception.
- **Observer tests must be green before every push:**
  `cd observer && npx vitest run`
- **No merge without explicit human approval.** Merging stays with the maintainer.
- **Strategic questions (scope, branding, deletions, structure) go to the
  maintainer** — never guess them. Log decisions in docs/BACKLOG.md.
- If an external limit (session cap, timeout) interrupts a cycle mid-review:
  commit work-in-progress with a transparent "unreviewed, DA pending" note and
  complete the review first thing in the next session.
- The setup wizard prompt exists twice (README.md +
  blueprint/templates/setup-wizard-prompt.md) — any change must update both;
  verify with a diff.
- **Terminal setup is opt-in.** Developers may customize shells/editors via
  `terminal-setup/` — it's not required for the blueprint itself, but useful
  for daily workflow optimization.

## Linking Conventions
- Links **between files inside `blueprint/`**: relative paths.
- Links **from `blueprint/` to anything outside it** (docs/, observer/): absolute
  GitHub URLs (`https://github.com/Liohtml/agentic-blueprint/...`) — blueprint
  files get copied into other projects and relative links would break there.

## Community Boundaries
- Tasks reserved as good-first-issues live in
  [docs/community/good-first-issues.md](docs/community/good-first-issues.md).
  **Do not implement them** — they are deliberately left for new contributors.

## Safety
- No hardcoded secrets/credentials.
- Do not install packages younger than 14 days.
- Small, clean commits; no force-push.
