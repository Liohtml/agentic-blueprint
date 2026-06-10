<p align="center">
  <img src="assets/social-preview.png" alt="Agentic Blueprint" width="100%">
</p>

<h3 align="center">A framework for autonomous AI-driven engineering workflows</h3>

<p align="center">
  <a href="#your-first-10-minutes">First 10 Minutes</a> &bull;
  <a href="docs/GETTING-STARTED.md">Getting Started</a> &bull;
  <a href="#quick-start-developers">Quick Start</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#project-structure">Structure</a> &bull;
  <a href="#credits--inspiration">Credits</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.4-blue" alt="Version 1.4">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
</p>

---

Agentic Blueprint is a structured playbook for building software with AI agents: phases, quality gates, feedback loops, and coordination rules — all as plain markdown files. It is **built for [Claude Code](https://claude.com/claude-code)**; the core principles (phases, gates, loops) are tool-agnostic and transfer to other agents, but everything here is tested with and written for Claude Code.

---

## Your First 10 Minutes

The blueprint is **just folders and text files — no code required**. You don't need a terminal to try it:

1. **Get the files.** Click the green **Code** button on GitHub and choose **Download ZIP** (or use **"Use this template"** if you want your own copy on GitHub). Unzip it.
2. **Open the folder** in Claude Code — or upload `AGENTIC-BLUEPRINT.md` to a chat at [claude.ai](https://claude.ai).
3. **Paste these prompts**, one at a time:

> **Prompt 1 — understand it:**
> "Read `AGENTIC-BLUEPRINT.md` and explain in plain language how this workflow would change the way I build things with you."

> **Prompt 2 — make it yours:**
> "Read `blueprint/config.md`. Interview me one question at a time and fill it out for my project."

> **Prompt 3 — start your first feature:**
> "Read `AGENTIC-BLUEPRINT.md`. I want to build [describe your idea in one sentence]. Start with Phase 0 and act as my sparring partner."

> **Prompt 4 — get a reviewable plan:**
> "Phase 0 is done. Move to Phase 1 and draft a plan with small chunks I can approve one by one."

That's the whole loop: the agent reads the rules, you make the decisions, it does the work in disciplined phases. For a guided end-to-end walkthrough, continue with [Getting Started](docs/GETTING-STARTED.md).

---

## Choose Your Path

| | Path | Start here |
|---|------|------------|
| 🟢 | **Beginner / non-technical** — you've never used a terminal, or you just want the workflow without any setup | [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md) — a guided "first win" in under 15 minutes, no terminal needed |
| 🔵 | **Developer / expert** — you want the blueprint in your own repo, or a full multi-agent team with a live dashboard | [Quick Start](#quick-start-developers) and [Clone & Go — Agent Teams](#clone--go--agent-teams) |

New terms (Phase, Gate, Chunk, Mission Mode, ...) are defined in the [Glossary](docs/glossary.md).

---

## What is Agentic Blueprint?

Agentic Blueprint is a **reusable, modular framework** that defines how AI agents autonomously engineer software. Instead of ad-hoc prompting, it gives your agents a structured playbook: phases, quality gates, feedback loops, and coordination protocols.

Drop it into any project. Your agents know what to do.

**This is not a library or CLI tool.** It's a set of markdown files that guide AI agents through a disciplined development workflow — from ideation to merge.

### Key Features

- **6-Phase Development Model** — Ideation, Planning, Building, Cleanup, Review, Merge
- **Mission Mode (Fable 5)** — Long-horizon autonomous runs: full spec up front, binary definition of done, quality gates unchanged
- **4-Tier Model Strategy** — Fable 5 for the lead and mission-critical work, Opus for hard logic, Sonnet as standard, Haiku for scouting — with effort as the second cost dimension
- **Multi-Agent Coordination** — Claude Code agents (plus an optional secondary agent) working in parallel without conflicts
- **Automated Feedback Loops** — Build-Test, Cleanup-Verify, and Review-Fix loops with defined iteration limits
- **Quality Gates** — Binary pass/fail checks between every phase
- **Context Engineering** — Rules for keeping agent context minimal and precise
- **Templates** — Ready-to-use templates for CLAUDE.md, AGENTS.md, plans, and PRs
- **Self-Evolving** — Built-in retro template to improve the blueprint after each feature

---

## Quick Start (Developers)

### 1. Copy into your project

```bash
# Clone the blueprint
git clone https://github.com/Liohtml/agentic-blueprint.git

# Copy into your project
cp agentic-blueprint/AGENTIC-BLUEPRINT.md ./
cp -r agentic-blueprint/blueprint/ ./blueprint/
```

### 2. Configure for your project

Edit `blueprint/config.md` — or let the agent interview you (see [Your First 10 Minutes](#your-first-10-minutes), Prompt 2):

```markdown
- Name: My SaaS App
- Tech stack: Next.js + Supabase
- Secondary agent: none
- Review tool: /code-review skill + second Claude Code agent
```

### 3. Generate project-specific agent files

Tell your agent:

> "Read `blueprint/config.md` and `blueprint/templates/CLAUDE.md.template`. Generate a project-specific `CLAUDE.md` based on the configuration."

### 4. Start building

Begin every feature with:

> "Read `AGENTIC-BLUEPRINT.md`. I want to build [feature]. Start with Phase 0."

The agent follows the phases automatically.

---

## Clone & Go — Agent Teams

Spin up a full Claude Code agent team from a fresh clone in under five minutes.

**Requirements (this path only):** [tmux](https://github.com/tmux/tmux/wiki) ≥ 3.x · Node.js ≥ 20 · git · [Claude Code CLI](https://claude.com/claude-code)

### 1. Clone & bootstrap

```bash
git clone https://github.com/Liohtml/agentic-blueprint.git
cd agentic-blueprint
./scripts/bootstrap.sh
```

`bootstrap.sh` installs the Observer dependencies and verifies your environment
(checks for tmux, node, and git — missing tools get a friendly install hint).

### 2. Enable the agent-teams flag

Agent teams are an **experimental Claude Code feature**, gated behind an environment variable:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

To make it permanent, add that line to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent).

### 3. Start a tmux session

```bash
tmux new -s agent-teams
```

Each teammate gets its own split-pane — you see them all working simultaneously.

### 4. Launch Claude and paste your team prompt

```bash
claude
```

Fill in [`blueprint/templates/team-prompt.md`](blueprint/templates/team-prompt.md)
and paste it into Claude. The template covers every rule the team needs: shared contract
first, strict file-ownership, model-tiering (Fable 5 for the lead and mission-critical
work, Opus for hard logic, Sonnet for the rest, Haiku for scouting),
task-graph with `blocks`/`blockedBy`, build-test-loop max 5 iterations, no self-review,
and no merge without your Go.

### 5. Watch the team live (second pane)

```bash
# Open a new pane: Ctrl-b "
./scripts/observe.sh --team <name>
```

Open **http://localhost:4317** — the **[Agent Observer](observer/README.md)** streams live
token counts, costs, tool activity, and task progress for every pane — built with these
exact same team rules.

> See [`blueprint/agents/agent-teams.md`](blueprint/agents/agent-teams.md) for the full
> setup runbook and coordination protocol.

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

### Multi-Agent Coordination

```
    YOU (Conductor)
    /             \
   /               \
Claude Code      Antigravity
(Engineering)    (UI / Review / Orchestration)
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
|   |   |-- antigravity.md        #   Secondary agent (3 configurable profiles)
|   |   |-- coordination.md       #   Multi-agent protocol
|   |   |-- agent-teams.md        #   Live teammates in tmux split-panes (setup + runbook)
|   |   |-- managed-agents.md     #   Cloud execution profile (Managed Agents + Outcome rubrics)
|   |
|   |-- loops/                    # Feedback loop specs
|   |   |-- build-test-loop.md
|   |   |-- cleanup-verify-loop.md
|   |   |-- review-fix-loop.md
|   |
|   |-- templates/                # Copy-paste ready templates
|   |   |-- CLAUDE.md.template
|   |   |-- AGENTS.md.template
|   |   |-- PLAN.md.template
|   |   |-- PR-TEMPLATE.md
|   |
|   |-- meta/                     # Self-improvement tools
|       |-- how-to-adapt.md       #   Bootstrapping guide for new projects
|       |-- decision-trees.md     #   When to use which agent/phase/loop
|       |-- changelog.md          #   Blueprint version history
|       |-- retro-template.md     #   Post-feature retrospective
|
|-- docs/
|   |-- GETTING-STARTED.md        # Guided first-win walkthrough (two tracks)
|   |-- glossary.md               # Short definitions of all blueprint terms
|   |-- examples/                 # Worked example: full 6-phase run on one small feature
|   |-- BACKLOG.md                # Roadmap / continuous-improvement backlog
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
