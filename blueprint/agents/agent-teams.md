# Agent Teams (Claude Code) — Setup & Runbook

> Real Teammates instead of subagents/workflow: multiple full Claude Code sessions
> collaborating as a team — each in its own tmux split pane, with a shared
> task list and inter-agent messages. This document describes our setup as
> actually used (verified while building the **[Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md)**).

## What this is (and what it is not)

| Mechanism | Isolation | Communication | When |
|---|---|---|---|
| **Subagent** (Agent tool, one-shot) | own context, no pane | return text to Lead | short, self-contained research/edit |
| **Workflow** (script) | deterministically orchestrated | function returns | many uniform steps, fan-out |
| **Agent Team** (this doc) | **own session per Teammate** | **SendMessage + shared task list** | long-lived builds with division of labor |

An Agent Team is a `1:1` correspondence of **team = task list**. The Lead creates
the team, sets up tasks with dependencies, spawns Teammates, and coordinates via messages.

## Fresh Clone — Quick Start

On a fresh machine, three steps are enough:

```bash
./scripts/bootstrap.sh                   # dependencies + environment check
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
tmux new -s teamwork && claude
```

Then fill out the **[team prompt template](../templates/team-prompt.md)** and paste it into
Claude — it contains all mandatory rules (contract-first, File Ownership, Model Tiering,
task graph, Build-Test Loop, no self-review, no merge without Human Go) as prefabricated
sections with `<PLACEHOLDERS>`.

Observe a running team (second pane):

```bash
./scripts/observe.sh --team <TEAM-NAME>
```

---

## Prerequisites

1. **Enable the feature flag** (otherwise no team tools):
   ```bash
   export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
   ```
   Best made permanent in `~/.zshrc`.

2. **tmux** for the split-pane display (each Teammate = one pane):
   ```bash
   brew install tmux   # macOS
   tmux -V             # ≥ 3.x; tested with 3.6b
   ```

3. **Start inside tmux.** Check `echo $TMUX` — empty = you are NOT in tmux,
   in which case there are no split panes (Teammates then run "in-process" without a visible pane).

### In-Process vs. Split-Pane
- **Split-pane** (recommended): started inside tmux → each Teammate gets its own
  visible pane. You see all agents working simultaneously. This is exactly what the
  **Agent Observer** is for — it reads the local files and shows status/tokens/costs
  of all panes at a glance.
- **In-process**: without tmux. Works, but without separate panes; observation only via
  messages/task list (or the Observer, which works file-based).

### ⚠️ Ghostty caveat
Ghostty (and some other GPU terminals) sometimes render tmux splits incorrectly or
intercept keyboard shortcuts. If panes flicker or splits do not appear: start tmux in a
native terminal (Terminal.app, iTerm2) and run Claude inside it.
Inside tmux, `$TERM_PROGRAM=tmux` and `$TERM=tmux-256color` — that is correct.

## Runbook

```bash
# 1. Terminal → start tmux session
tmux new -s teamwork

# 2. Set the flag (if not in your shell config)
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# 3. Start Claude Code in the project
cd ~/my-project
claude

# 4. Give the team prompt (Lead role). The Lead:
#    - TeamCreate "<team>"            → ~/.claude/teams/<team>/config.json + task list
#    - TaskCreate / TaskUpdate        → tasks + dependencies (blocks / blockedBy)
#    - Agent(team_name, name, model)  → spawn Teammates (one pane each)
#    - SendMessage                    → coordination; TaskUpdate → progress
```

Recommended procedure for the Lead (matches our [phases](../phases/01-planning.md)):
1. **Shared Contract first.** One "blocker" task (e.g. types/interfaces) blocks all
   others. Only spawn/release once it is green. After that the contract is **read-only**.
2. **File Ownership instead of branches.** One shared branch, shared filesystem;
   isolation comes from strictly separated file owners (see
   [coordination protocol](./coordination.md)). No Teammate touches someone else's files.
3. **Model dependencies in the task graph** (`addBlocks` / `addBlockedBy`) so that
   Teammates only pull released, unblocked tasks.

## Model Tiering (cost control)

Teammates are tiered per role at spawn time — expensive model only for the tricky
parts, standard model for the rest. Since Fable 5 (06/2026) there are four tiers
(for current prices see [decision-trees.md](../meta/decision-trees.md)):

| Model | When to use |
|---|---|
| **Fable 5** (`fable`) | Lead/coordinator, Mission Chunks, architecture-critical migrations, final review. 2× the Opus price — use deliberately, not broadly. |
| **Opus** (`opus`) | Hard logic: parsers, algorithms, aggregation with correctness risk |
| **Sonnet** (`sonnet`) | Standard: scaffold, UI, CRUD, tests, docs |
| **Haiku** (`haiku`) | Explore/research subagents, mechanical bulk edits |

```
Agent(team_name: "<team>", name: "lead",   model: "fable",  ...)   # Mission coordination
Agent(team_name: "<team>", name: "parser", model: "opus",   ...)   # hard logic
Agent(team_name: "<team>", name: "ui",     model: "sonnet", ...)   # standard
Agent(team_name: "<team>", name: "scout",  model: "haiku",  ...)   # explore/research
```

Rule of thumb: **Fable** only for the Lead and tasks whose failure costs the whole run;
**Opus** for parsers/aggregation/algorithmics with correctness risk, **Sonnet** for
scaffold, UI, CRUD, tests, **Haiku** for read-only groundwork. (On the Observer: T5
transcript parser and T7 aggregator on Opus, all remaining eight on Sonnet — today
the Lead would run on Fable.)

## Cost Notes

- A team with N Teammates = N parallel sessions → **N times the token consumption**.
  10 agents across multiple Build-Test Loops add up quickly.
- **Cache** dominates the costs: Teammates read a lot of context (large
  `cache_read` share). Short, precise task descriptions + one central
  notes/contract document (instead of explaining everything to each agent individually) reduce consumption.
- Spawn **on demand**: blocker task first on its own, only then the rest — that way
  9 expensive panes are not waiting idle for the contract.
- The **[Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md)** estimates live costs per agent from the
  `usage` fields of the transcripts (the price table is editable and **not authoritative** —
  verify prices yourself).

## Where the Data Lives (observation & debugging)

| What | Path |
|---|---|
| Team config + members | `~/.claude/teams/<team>/config.json` |
| Inboxes (messages) | `~/.claude/teams/<team>/inboxes/<name>.json` |
| Task list | `~/.claude/tasks/<team>/<n>.json` |
| Transcripts (tokens/tools) | `~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl` |

These are exactly the files the **Agent Observer** evaluates — no external monitoring needed.

## Cleanup

```text
1. Work finished & verified → obtain Human Go for merging.
2. Shut down Teammates: SendMessage { type: "shutdown_request" } to each Teammate
   (they confirm with shutdown_response; this ends their process/pane).
3. Team cleanup: delete the team (TeamDelete) or remove ~/.claude/teams/<team>/
   when no longer needed. Same for the task list under ~/.claude/tasks/<team>/.
4. Close the tmux session: `tmux kill-session -t teamwork`.
```

> Merge discipline: **no merge without Human Go.** The human remains the conductor
> (see [coordination.md](./coordination.md)).
