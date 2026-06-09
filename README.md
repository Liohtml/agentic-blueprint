<p align="center">
  <img src="assets/social-preview.png" alt="Agentic Blueprint" width="100%">
</p>

<h3 align="center">A framework for autonomous AI-driven engineering workflows</h3>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#clone--go--agent-teams">Clone & Go</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#project-structure">Structure</a> &bull;
  <a href="#credits">Credits</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/agents-Claude_Code_%2B_Antigravity-purple" alt="Agents">
</p>

---

## What is Agentic Blueprint?

Agentic Blueprint is a **reusable, modular framework** that defines how AI agents autonomously engineer software. Instead of ad-hoc prompting, it gives your agents a structured playbook: phases, quality gates, feedback loops, and coordination protocols.

Drop it into any project. Your agents know what to do.

**This is not a library or CLI tool.** It's a set of markdown files that guide AI agents through a disciplined development workflow — from ideation to merge.

### Key Features

- **6-Phase Development Model** — Ideation, Planning, Building, Cleanup, Review, Merge
- **Multi-Agent Coordination** — Claude Code + Antigravity (or any secondary agent) working in parallel without conflicts
- **Automated Feedback Loops** — Build-Test, Cleanup-Verify, and Review-Fix loops with defined iteration limits
- **Quality Gates** — Binary pass/fail checks between every phase
- **Context Engineering** — Rules for keeping agent context minimal and precise
- **Templates** — Ready-to-use templates for CLAUDE.md, AGENTS.md, plans, and PRs
- **Self-Evolving** — Built-in retro template to improve the blueprint after each feature

---

## Quick Start

### 1. Copy into your project

```bash
# Clone the blueprint
git clone https://github.com/Liohtml/agentic-blueprint.git

# Copy into your project
cp agentic-blueprint/AGENTIC-BLUEPRINT.md ./
cp -r agentic-blueprint/blueprint/ ./blueprint/
```

### 2. Configure for your project

Edit `blueprint/config.md`:

```markdown
- Name: My SaaS App
- Tech-Stack: Next.js + Supabase
- Antigravity-Profil: A (UI/Design)
- Review-Tool: Manuell
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

**Voraussetzungen:** [tmux](https://github.com/tmux/tmux/wiki) ≥ 3.x · Node.js · git · Claude Code CLI

### 1. Clone & bootstrap

```bash
git clone https://github.com/Liohtml/agentic-blueprint.git
cd agentic-blueprint
./scripts/bootstrap.sh
```

`bootstrap.sh` installs the Observer dependencies and verifies your environment
(checks for tmux, node, and git — missing tools get a friendly install hint).

### 2. Enable the agent-teams flag

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
# Make it permanent:
echo 'export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1' >> ~/.zshrc
```

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
first, strict file-ownership, model-tiering (Opus for hard logic, Sonnet for the rest),
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
| 4 | **Build small, merge often** | Max 3-5 files per chunk. More than 8 chunks = reduce scope. |
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
|-- observer/                     # Agent Observer — live dashboard for running agent teams
    |-- DATA-NOTES.md             #   Verified real shapes of ~/.claude files (data contract)
    |-- README.md                 #   Run instructions + architecture
    |-- package.json              #   `npm run observe` (build + serve :4317), `npm run dev`
    |-- src/
    |   |-- types.ts              #   Shared TypeScript contract (frozen after scaffold)
    |   |-- collector/            #   teamParser, taskParser, inboxParser, transcriptParser,
    |   |                         #     pricing, metrics, aggregator, watcher
    |   |-- server.ts             #   Node http + SSE backend (no Express)
    |   |-- bin/observe.ts        #   CLI: observe [--team] [--port]
    |-- web/                      #   Vite + React + Tailwind + uPlot frontend
    |   |-- src/                  #   App, AgentGrid/AgentCard, charts (token/cost/tasks/messages)
    |-- fixtures/                 #   Anonymized test fixtures for vitest
```

---

## Who Is This For?

- **Solo developers** using AI agents to ship faster — gives your agents structure instead of chaos
- **Small teams** with multiple agents running in parallel — prevents conflicts and ensures quality
- **Anyone moving from vibe coding to agentic engineering** — the framework enforces discipline without slowing you down

## Requirements

- An AI coding agent (Claude Code, Cursor, Codex, or similar)
- A git-based workflow
- That's it. No dependencies, no installation, no runtime.

---

## Credits & Inspiration

This framework was built on the shoulders of practitioners who are pushing agentic engineering forward:

### Direct Inspiration

- **[Mickey / pawel-cell](https://github.com/pawel-cell/micky-podcast-agentic-engineering)** — The agentic engineering workflow, skills for source code context, code structure cleanup, and the grep-loop review workflow that directly inspired this blueprint's feedback loop architecture.

- **[Michael Shimeles](https://github.com/michaelshimeles/skills)** — Skills collection that informed the modular skill-based approach to agent configuration.

- **[David Ondrej](https://www.youtube.com/@DavidOndrej)** — For hosting the podcast ["Why This Dev Ships 100x Faster Than 99% of Engineers"](https://www.youtube.com/watch?v=example) that captured and disseminated these workflows to a broader audience.

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
