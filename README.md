<p align="center">
  <img src="assets/social-preview.png" alt="Agentic Blueprint" width="100%">
</p>

<h3 align="center">A framework for autonomous AI-driven engineering workflows</h3>

<p align="center">
  <a href="#your-first-10-minutes">First 10 Minutes</a> &bull;
  <a href="docs/GETTING-STARTED.md">Getting Started</a> &bull;
  <a href="#quick-start-developers">Quick Start</a> &bull;
  <a href="#clone--go--agent-teams">Agent Teams</a> &bull;
  <a href="#run-agents-safely--docker-sandbox">Docker Sandbox</a> &bull;
  <a href="terminal-setup/README.md">Terminal Setup</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#project-structure">Structure</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.7-blue" alt="Version 1.7">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
</p>

---

Agentic Blueprint is a structured playbook for building software with AI agents: phases, quality gates, feedback loops, and coordination rules — all as plain markdown files. It is **built for [Claude Code](https://claude.com/claude-code)**; the core principles (phases, gates, loops) are tool-agnostic and transfer to other agents, but everything here is tested with and written for Claude Code.

---

## Your First 10 Minutes

The blueprint is **just folders and text files — no code required**. And you don't set it up yourself: **the agent does the setup for you.**

### With Claude Code (recommended)

[Claude Code](https://claude.com/claude-code) is Anthropic's AI coding agent — a program that reads and edits the files in a folder for you; install it from that link if you don't have it yet. To "open it in your project folder": in a terminal, type `cd path/to/your/project` and then `claude` — or, if you use the VS Code extension, open the folder in VS Code and open the Claude panel.

1. **Open Claude Code in your project folder.** An existing project works; a brand-new empty folder works too. *(You should see: Claude Code running, waiting for your message.)*
2. **Paste the setup wizard prompt below** — it's one message. (Also available as a file: [`blueprint/templates/setup-wizard-prompt.md`](blueprint/templates/setup-wizard-prompt.md).)
3. **Answer the questions.** One at a time, in plain language, each with a suggested default — if you're unsure, take the suggestion. *(You should see at the end: a plain-language summary plus a ready-to-copy Phase 0 prompt for your first feature.)*

<details>
<summary><b>📋 Click to show the wizard prompt (copy everything inside the box)</b></summary>

<!-- KEEP IN SYNC: this prompt exists in README.md and blueprint/templates/setup-wizard-prompt.md — change both -->
```text
You are my setup wizard for the Agentic Engineering Blueprint
(https://github.com/Liohtml/agentic-blueprint). Set it up in this folder.
I may not be technical: use plain language, avoid jargon, and tell me in
one sentence what you are about to do before each step.

## Safety rules (apply to every step)
- Never overwrite or delete an existing file without asking me first.
- If a CLAUDE.md or AGENTS.md already exists, propose a merge — show me
  exactly what you would add — never replace it.
- Run no git commands in this project (no commit, push, branch, init) —
  a temporary clone elsewhere for fetching files is fine.

## Step 1 — Look around
Check what is in this folder and tell me what you find.
- Existing project (e.g. package.json, pyproject.toml, go.mod, Cargo.toml,
  source folders present): infer the tech stack from those files and
  confirm it with me in one sentence.
- Empty (or nearly empty) folder: say so, and make clear you will NOT
  scaffold any project structure now. Scaffolding is offered later, after
  Phase 0 (ideation) and Phase 1 (planning) of the first feature — never
  blindly up front.

## Step 2 — Get the blueprint files
From https://github.com/Liohtml/agentic-blueprint fetch exactly two things:
- AGENTIC-BLUEPRINT.md  -> into the project root
- the complete blueprint/ folder -> into the project root
Do NOT bring in observer/, docs/, scripts/, or anything else.
Pick whatever method works here: shallow git clone into a temp folder and
copy the two items over, `npx degit`, or curl the GitHub tarball and
extract only those paths. If neither git, npx, nor curl is available:
fetch the files one by one with your web-fetch capability, or tell me
the single tool to install and the exact install command — then wait
for my go. Afterwards verify that AGENTIC-BLUEPRINT.md and
blueprint/config.md exist in this folder, and clean up any temp files.

## Step 3 — Fill out blueprint/config.md by interviewing me
Ask me ONE question at a time, in plain language. For every question,
propose a sensible default (use what you learned in Step 1) and add:
"If you're unsure, take the suggestion." Cover at least: project name,
one-sentence description, tech stack, secondary agent (default: none),
review tool (default: /code-review skill), directory assignments (keep
minimal or mark as "decided later" for an empty project), and commit
style. Write my answers into blueprint/config.md as we go.

## Step 4 — Generate CLAUDE.md and AGENTS.md
Generate a project-specific CLAUDE.md and AGENTS.md in the project root,
using blueprint/templates/CLAUDE.md.template and
blueprint/templates/AGENTS.md.template plus the filled-in config.
Remember the safety rule if either file already exists.

## Step 5 — Wrap up in plain language
Give me a short summary: which files now exist, which rules apply from
now on (work happens in phases, each phase ends at a gate I approve,
nothing merges without my explicit Go), and what to do next. End by
printing this ready-to-copy prompt for my first feature:

"Read AGENTIC-BLUEPRINT.md. I want to build [describe your idea in one
sentence]. Start with Phase 0 and act as my sparring partner. Ask me one
question at a time."
```

</details>

### No terminal? Use claude.ai

If you don't use Claude Code, you can still try the workflow in a plain chat:

1. **Get the files.** Click the green **Code** button on GitHub and choose **Download ZIP** (or use **"Use this template"** if you want your own copy on GitHub). Unzip it.
2. **Upload `AGENTIC-BLUEPRINT.md`** to a new chat at [claude.ai](https://claude.ai).
3. **Paste these prompts**, one at a time:

> **Prompt 1 — understand it:**
> "Read `AGENTIC-BLUEPRINT.md` and explain in plain language how this workflow would change the way I build things with you."

> **Prompt 2 — make it yours:**
> "Read `blueprint/config.md`. Interview me one question at a time and fill it out for my project." (Upload `blueprint/config.md` first.)

> **Prompt 3 — start your first feature:**
> "Read `AGENTIC-BLUEPRINT.md`. I want to build [describe your idea in one sentence]. Start with Phase 0 and act as my sparring partner."

> **Prompt 4 — get a reviewable plan:**
> "Phase 0 is done. Move to Phase 1 and draft a plan with small chunks I can approve one by one."

That's the whole loop: the agent reads the rules, you make the decisions, it does the work in disciplined phases. For a guided end-to-end walkthrough, continue with [Getting Started](docs/GETTING-STARTED.md).

---

## Choose Your Path

| | Path | Start here |
|---|------|------------|
| 🟢 | **Beginner / non-technical** — you've never used a terminal, or you just want the workflow without any setup | [Track A in Getting Started](docs/GETTING-STARTED.md#-track-a--im-not-technical) — a guided "first win" in under 15 minutes, no terminal needed |
| 🔵 | **Developer / expert** — you want the blueprint in your own repo, or a full multi-agent team with a live dashboard | [Quick Start](#quick-start-developers) and [Clone & Go — Agent Teams](#clone--go--agent-teams) |

New terms (Phase, Gate, Chunk, Mission Mode, ...) are defined in the [Glossary](docs/glossary.md).

---

## What is Agentic Blueprint?

Agentic Blueprint is a **reusable, modular framework** that defines how AI agents autonomously engineer software. Instead of ad-hoc prompting, it gives your agents a structured playbook: phases, quality gates, feedback loops, and coordination protocols.

Drop it into any project. Your agents know what to do.

**This is not a library or CLI tool.** It's a set of markdown files that guide AI agents through a disciplined development workflow — from ideation to merge.

### Key Features

- **6-Phase Development Model** — Ideation, Planning, Building, Cleanup, Review, Merge
- **Agent-Driven Setup** — One copy-paste [wizard prompt](blueprint/templates/setup-wizard-prompt.md) and the agent installs and configures the blueprint in your project itself
- **One-Command Agent Teams** — [`scripts/start-team.sh`](scripts/start-team.sh) checks your environment in plain language, starts tmux, and launches the team
- **Docker Sandbox** — Ready-to-use [container template](docs/docker-sandbox.md) so agents can work autonomously without touching your host system
- **Mission Mode (Fable 5)** — Long-horizon autonomous runs: full spec up front, binary definition of done, quality gates unchanged
- **4-Tier Model Strategy** — Fable 5 for the lead and mission-critical work, Opus for hard logic, Sonnet as standard, Haiku for scouting — with effort as the second cost dimension
- **Multi-Agent Coordination** — Claude Code agents (plus an optional secondary agent) working in parallel without conflicts
- **Automated Feedback Loops** — Build-Test, Cleanup-Verify, and Review-Fix loops with defined iteration limits
- **Quality Gates** — Binary pass/fail checks between every phase
- **Context Engineering** — Rules for keeping agent context minimal and precise
- **Templates** — Ready-to-use templates for CLAUDE.md, AGENTS.md, plans, backlogs, and PRs
- **Self-Evolving** — A first-class [Improvement Loop](blueprint/loops/improvement-loop.md): backlog → research → devil's-advocate review → implement → test → push, resumable from its backlog file after any interruption — plus the retro template for per-feature learnings
- **Deterministic Orchestration** — [Multi-agent patterns](blueprint/agents/orchestration.md) for Fable 5: fan-out pipelines, adversarial verification, judge panels, and structured result contracts between agents

---

## Quick Start (Developers)

### Recommended: let the agent set it up

1. Open Claude Code in your project folder (existing repo or empty directory — both work).
2. Paste the **setup wizard prompt** — shown inline in [Your First 10 Minutes](#your-first-10-minutes), or copy it from [`blueprint/templates/setup-wizard-prompt.md`](blueprint/templates/setup-wizard-prompt.md).
3. Answer the interview questions.

The wizard detects your tech stack, fetches `AGENTIC-BLUEPRINT.md` + `blueprint/` from this repo, fills out `blueprint/config.md` with you, and generates `CLAUDE.md` + `AGENTS.md` — without overwriting anything you already have.

### Manual setup (alternative)

If you'd rather do it by hand:

```bash
# Clone the blueprint
git clone https://github.com/Liohtml/agentic-blueprint.git

# Copy into your project
cp agentic-blueprint/AGENTIC-BLUEPRINT.md ./
cp -r agentic-blueprint/blueprint/ ./blueprint/
```

Then edit `blueprint/config.md` (name, tech stack, secondary agent, review tool) and tell your agent:

> "Read `blueprint/config.md` and `blueprint/templates/CLAUDE.md.template`. Generate a project-specific `CLAUDE.md` based on the configuration."

### Start building

Begin every feature with:

> "Read `AGENTIC-BLUEPRINT.md`. I want to build [feature]. Start with Phase 0."

The agent follows the phases automatically.

---

## Clone & Go — Agent Teams

Spin up a full Claude Code agent team — multiple agents working in parallel, each in
its own terminal pane — with **one command**.

**Requirements (this path only):** [tmux](https://github.com/tmux/tmux/wiki) ≥ 3.x · Node.js ≥ 20 · git · [Claude Code CLI](https://claude.com/claude-code)

### 1. Clone once

```bash
git clone https://github.com/Liohtml/agentic-blueprint.git
cd agentic-blueprint
./scripts/bootstrap.sh   # installs observer deps, checks your environment
```

### 2. Start the team — one command

```bash
./scripts/start-team.sh
```

The script checks everything (git, node, claude, tmux — every missing piece gets a
plain-language install hint), enables the experimental agent-teams flag, starts tmux
for you, and launches Claude Code in **your current folder**. Options: `--check`
(checks only), `--observer <team>` (adds a live dashboard pane), `--help`.

**You should see:** five ✓ lines, a three-line tmux crash course, then Claude Code
inside a tmux pane (green status bar at the bottom).

### 3. Paste your team prompt

Fill in [`blueprint/templates/team-prompt.md`](blueprint/templates/team-prompt.md)
and paste it into Claude. The template covers every rule the team needs: shared contract
first, strict file-ownership, model-tiering (Fable 5 for the lead and mission-critical
work, Opus for hard logic, Sonnet for the rest, Haiku for scouting),
task-graph with `blocks`/`blockedBy`, build-test-loop max 5 iterations, no self-review,
and no merge without your Go.

### 4. Watch the team live

```bash
./scripts/start-team.sh --observer <team-name>   # or in a new pane: ./scripts/observe.sh --team <name>
```

Open **http://localhost:4317** — the **[Agent Observer](observer/README.md)** streams live
token counts, costs, tool activity, and task progress for every pane — built with these
exact same team rules.

> Manual steps (what the script does under the hood), a "Type this → You should see"
> walkthrough, and a troubleshooting table live in
> [`blueprint/agents/agent-teams.md`](blueprint/agents/agent-teams.md).

---

## Run Agents Safely — Docker Sandbox

Before giving agents real autonomy, put them in a container: inside it they cannot
touch your host files, keys, or other projects. The repo ships a ready-to-use template:

```bash
docker build -t agent-sandbox sandbox/
docker run -it --rm -v "$PWD":/workspace -w /workspace agent-sandbox
```

Two paths — **VS Code Dev Container** (beginner-friendly, click "Reopen in Container")
and **plain Docker** — plus an honest list of what the sandbox does *not* protect:
**[docs/docker-sandbox.md](docs/docker-sandbox.md)**.

---

## How It Works

### The 6 Phases

```
Phase 0        Phase 1        Phase 2        Phase 3        Phase 4        Phase 5
IDEATION  -->  PLANNING  -->  BUILDING  -->  CLEANUP   -->  REVIEW   -->  MERGE
  You +          You +         Agent(s)       Agent          Review         You
  Agent          Agent         autonomously   cleans up      Agent +        approve
  brainstorm     create plan   build chunks   duplicates     Build Agent    & merge
                                                             loop to 5/5
```

### The Core Principles

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Human thinks, Agent builds** | You make architecture decisions. Agents execute. |
| 2 | **Context is King, less is more** | Never load the entire codebase. Reference specific files only. |
| 3 | **Code is the best documentation** | Load dependency source code directly, not prose docs. |
| 4 | **Build small, merge often** | Max 3-5 files per chunk — or one well-specified Fable 5 mission. More than 8 chunks = reduce scope. |
| 5 | **Structure after every feature** | Cleanup phase is never skipped. |
| 6 | **Automated feedback loops** | Agents loop with defined abort conditions. No endless spinning. |

### Feedback Loops

Each loop has a hard iteration limit. When reached, the agent stops and escalates to you.

| Loop | Phase | Max Iterations | On Abort |
|------|-------|---------------|----------|
| Build-Test | Building | 5 | Report blocker |
| Cleanup-Verify | Cleanup | 3 | Rollback to original |
| Review-Fix | Review | 7 | Human takes over |
| [Improvement](blueprint/loops/improvement-loop.md) | Between features (system-level) | 1-3 backlog items per cycle\* | Maintainer stop / empty backlog |

\* The Improvement Loop's "1-3 items" is a per-cycle item count, not an iteration cap — cycles end on maintainer stop or an empty backlog, and the maintainer (not iteration exhaustion) is the abort authority.

### Multi-Agent Coordination

```
    YOU (Conductor)
    /             \
   /               \
Claude Code      Second Claude Code agent
(Engineering)    (teammate or separate session:
   |              UI, review, parallel chunks)
   |                |
   |-- src/lib/     |-- src/components/
   |-- src/api/     |-- src/ui/
   |-- tests/       |-- src/layouts/
   |                |
   \--- src/types/ (shared, read-only in build phase) ---/
```

Agents never touch the same files. Shared contracts are defined in planning and locked during building.

---

## Project Structure

```
your-project/
|
|-- AGENTIC-BLUEPRINT.md          # Root: principles, phase overview, role summary (~100 lines)
|-- CLAUDE.md                     # Generated from template + config
|-- AGENTS.md                     # Generated from template + config
|
|-- blueprint/
|   |-- config.md                 # Project-specific variables (you fill this out)
|   |
|   |-- phases/                   # Detailed docs per phase
|   |   |-- 00-ideation.md        #   Problem definition, scope, success criteria
|   |   |-- 01-planning.md        #   Chunk-based planning with templates
|   |   |-- 02-building.md        #   Autonomous implementation per chunk
|   |   |-- 03-cleanup.md         #   Service layer extraction, deduplication
|   |   |-- 04-review-loop.md     #   Automated review cycle to 5/5
|   |   |-- 05-merge.md           #   Final validation and merge
|   |
|   |-- agents/                   # Role definitions
|   |   |-- claude-code.md        #   Primary engineering agent
|   |   |-- coordination.md       #   Multi-agent protocol
|   |   |-- orchestration.md      #   Deterministic multi-agent patterns (pipelines, adversarial verify, judge panels)
|   |   |-- agent-teams.md        #   Live teammates in tmux split-panes (setup + runbook)
|   |   |-- managed-agents.md     #   Cloud execution profile (Managed Agents + Outcome rubrics)
|   |
|   |-- loops/                    # Feedback loop specs
|   |   |-- build-test-loop.md
|   |   |-- cleanup-verify-loop.md
|   |   |-- review-fix-loop.md
|   |   |-- improvement-loop.md   #   System-level loop: backlog -> research -> DA review -> ship
|   |
|   |-- templates/                # Copy-paste ready templates
|   |   |-- setup-wizard-prompt.md
|   |   |-- CLAUDE.md.template
|   |   |-- AGENTS.md.template
|   |   |-- PLAN.md.template
|   |   |-- BACKLOG.md.template
|   |   |-- PR-TEMPLATE.md
|   |
|   |-- prompts/                  # Ready-to-paste agent prompts
|   |   |-- improvement-orchestrator.md  # Start/resume the improvement loop in any project
|   |   |-- repo-guardian-agent.md       # Persistent in-repo reviewer persona
|   |   |-- repo-health-agent.md         # Scheduled multi-repo audit routine
|   |
|   |-- meta/                     # Self-improvement tools
|       |-- how-to-adapt.md       #   Bootstrapping guide for new projects
|       |-- decision-trees.md     #   When to use which agent/phase/loop
|       |-- changelog.md          #   Blueprint version history
|       |-- retro-template.md     #   Post-feature retrospective
|
|-- docs/
|   |-- GETTING-STARTED.md        # Guided first-win walkthrough (two tracks)
|   |-- docker-sandbox.md         # Run agents safely in a container (two paths)
|   |-- glossary.md               # Short definitions of all blueprint terms
|   |-- examples/                 # Worked example: full 6-phase run on one small feature
|   |-- BACKLOG.md                # Roadmap / continuous-improvement backlog
|
|-- sandbox/                      # Docker sandbox template (Dockerfile + devcontainer.json)
|
|-- scripts/
|   |-- start-team.sh             # One command: checks env, starts tmux + agent team
|   |-- observe.sh                # Launch the Agent Observer dashboard
|   |-- bootstrap.sh              # Fresh-clone setup: deps + environment check
|
|-- observer/                     # Agent Observer — live dashboard for running agent teams
    |-- DATA-NOTES.md             #   Verified real shapes of ~/.claude files (data contract)
    |-- README.md                 #   Run instructions + architecture
    |-- package.json              #   `npm run observe` (build + serve :4317), `npm run dev`
    |-- bin/observe.ts            #   CLI: observe [--team] [--port] [--no-open]
    |-- src/
    |   |-- types.ts              #   Shared TypeScript contract (frozen after scaffold)
    |   |-- server.ts             #   Node http + SSE backend (no Express)
    |   |-- collector/            #   teamParser, taskParser, inboxParser, transcriptParser,
    |                             #     pricing, metrics, aggregator, watcher
    |-- web/                      #   Vite + React + Tailwind + uPlot frontend
    |   |-- src/                  #   App, AgentGrid/AgentCard, charts (token/cost/tasks/messages)
    |-- fixtures/                 #   Anonymized test fixtures for vitest
```

---

## Who Is This For?

- **Solo developers** using AI agents to ship faster — gives your agents structure instead of chaos
- **Small teams** with multiple agents running in parallel — prevents conflicts and ensures quality
- **Anyone moving from vibe coding to agentic engineering** — start with the [no-terminal track](docs/GETTING-STARTED.md) if you're not technical; the framework enforces discipline without slowing you down

## Requirements

The requirements depend on which path you take:

| Path | What you need |
|------|---------------|
| **Blueprint only** (phases, gates, loops, templates) | An AI coding agent — built for [Claude Code](https://claude.com/claude-code), principles transfer to others — and a git-based workflow. No dependencies, no installation, no runtime. |
| **Agent Teams + Observer** (optional) | [tmux](https://github.com/tmux/tmux/wiki) ≥ 3.x, Node.js ≥ 20, git, Claude Code CLI, and the experimental agent-teams flag (see [Clone & Go](#clone--go--agent-teams)). |

## Roadmap

Planned improvements live in [docs/BACKLOG.md](docs/BACKLOG.md) — the working document of the project's continuous-improvement loop.

---

## Credits & Inspiration

This framework was built on the shoulders of practitioners who are pushing agentic engineering forward:

### Direct Inspiration

- **[Mickey / pawel-cell](https://github.com/pawel-cell/micky-podcast-agentic-engineering)** — The agentic engineering workflow, skills for source code context, code structure cleanup, and the grep-loop review workflow that directly inspired this blueprint's feedback loop architecture.

- **[Michael Shimeles](https://github.com/michaelshimeles/skills)** — Skills collection that informed the modular skill-based approach to agent configuration.

- **[David Ondrej](https://www.youtube.com/@DavidOndrej)** — For hosting the podcast "Why This Dev Ships 100x Faster Than 99% of Engineers" that captured and disseminated these workflows to a broader audience.

### Conceptual Foundations

- **[Andrej Karpathy](https://x.com/karpathy)** — The auto-research loop concept referenced throughout the video, which forms the philosophical basis for automated feedback loops in this blueprint.

- **[Vercel / open-source CLI](https://github.com/nicepkg/opensource)** — The `npx open-source` approach to loading dependency source code directly into project context, replacing traditional documentation.

- **[Greptile](https://www.greptile.com/)** — The AI code review tool whose confidence scoring system (1-5) inspired the quality gate architecture in Phase 4.

### The Community

The agentic engineering community on X/Twitter, whose daily experiments, debates, and shared learnings about context engineering, model selection, and agent workflows continuously shape how we build with AI.

---

## License

[MIT](LICENSE) — use it however you want.

---

<p align="center">
  <sub>Built with structured agent collaboration. Agents wrote 95% of this. A human made sure it was right.</sub>
</p>
