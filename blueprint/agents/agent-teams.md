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

## Quick Start — One Command

> **Where is this script?** `start-team.sh` lives in the
> [agentic-blueprint repo](https://github.com/Liohtml/agentic-blueprint) — i.e.
> in a **clone** of it — **not** in the `blueprint/` folder you copy into your
> own project. The same goes for `bootstrap.sh` and `observe.sh`. If you only
> copied `blueprint/`, fetch the script once:
>
> ```bash
> curl -fsSL https://raw.githubusercontent.com/Liohtml/agentic-blueprint/master/scripts/start-team.sh -o start-team.sh && chmod +x start-team.sh
> ```
>
> ... or use the [Manual Setup](#manual-setup-what-the-script-does) below.

The fastest way in. (Fresh clone? Run `./scripts/bootstrap.sh` once first — it
installs the observer dependencies and checks your environment.)

**Type this** — run the script from YOUR project folder, the team works there
(adjust the path to wherever your clone or downloaded copy lives):

```bash
./scripts/start-team.sh
```

**You should see:** five ✓ lines (git, node, claude, tmux, agent-teams flag), a
hint on how to make the flag permanent, a three-line tmux crash course — and
then a full-screen view with a green status bar at the bottom of the terminal.
That status bar is tmux; Claude Code is starting in the first pane.

The script
([source](https://github.com/Liohtml/agentic-blueprint/blob/master/scripts/start-team.sh))
bundles all four manual steps into one. If anything is missing, it stops and
tells you in plain language what to install and how. Options:

| Option | What it does |
|---|---|
| `--check` | Run the install checks only, start nothing. |
| `--observer <team>` | Also open a second pane running the Agent Observer dashboard for `<team>`. |
| `-h`, `--help` | Show usage. |

**Type this** (inside the Claude pane): fill out the
**[team prompt template](../templates/team-prompt.md)** and paste it into Claude —
it contains all mandatory rules (contract-first, File Ownership, Model Tiering,
task graph, Build-Test Loop, no self-review, no merge without Human Go) as
prefabricated sections with `<PLACEHOLDERS>`.

**You should see:** the Lead creating the team and tasks (`TeamCreate`,
`TaskCreate`), then new panes appearing — one per spawned Teammate.

To watch a running team in your browser, in a second pane (`Ctrl-b` then `"`):

**Type this** (`observe.sh` also lives in the clone — see the note at the top):

```bash
./scripts/observe.sh --team <TEAM-NAME>
```

**You should see:** the observer starting and serving on
`http://localhost:4317` — open that URL in your browser.

---

## Manual Setup (what the script does)

You do not need these steps if you used `./scripts/start-team.sh` — they are
documented here so you can see what happens under the hood.

1. **Install tmux** for the split-pane display (each Teammate = one pane).

   **Type this:**
   ```bash
   brew install tmux        # macOS
   sudo apt install tmux    # Debian/Ubuntu
   ```
   **You should see:** `tmux -V` printing version 3 or newer (tested with 3.6b).

2. **Enable the feature flag** (otherwise no team tools).

   **Type this:**
   ```bash
   export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
   ```
   **You should see:** nothing — exports are silent. Verify with
   `echo $CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, which should print `1`.
   Best made permanent by adding the line to `~/.zshrc` (zsh) or `~/.bashrc` (bash).

3. **Start a tmux session.**

   **Type this:**
   ```bash
   tmux new -s agent-team
   ```
   **You should see:** a green status bar at the bottom of the terminal — that's
   tmux. Verify with `echo $TMUX`: it prints a socket path. Empty = you are NOT
   in tmux, and Teammates would run "in-process" without visible panes.

4. **Start Claude Code in the project** (inside the tmux session, with the flag
   set in that same shell).

   **Type this:**
   ```bash
   cd ~/my-project
   claude
   ```
   **You should see:** the Claude Code welcome screen inside the tmux pane.

### In-Process vs. Split-Pane
- **Split-pane** (recommended): started inside tmux → each Teammate gets its own
  visible pane. You see all agents working simultaneously. This is exactly what the
  **Agent Observer** is for — it reads the local files and shows status/tokens/costs
  of all panes at a glance.
- **In-process**: without tmux. Works, but without separate panes; observation only via
  messages/task list (or the Observer, which works file-based).

## Runbook — Leading the Team

Give the team prompt (Lead role). The Lead:

```text
TeamCreate "<team>"            → ~/.claude/teams/<team>/config.json + task list
TaskCreate / TaskUpdate        → tasks + dependencies (blocks / blockedBy)
Agent(team_name, name, model)  → spawn Teammates (one pane each)
SendMessage                    → coordination; TaskUpdate → progress
```

**You should see:** one new tmux pane per spawned Teammate, and tasks moving
through the shared task list.

Recommended procedure for the Lead (matches our [phases](../phases/01-planning.md)):
1. **Shared Contract first.** One "blocker" task (e.g. types/interfaces) blocks all
   others. Only spawn/release once it is green. After that the contract is **read-only**.
2. **File Ownership instead of branches.** One shared branch, shared filesystem;
   isolation comes from strictly separated file owners (see
   [coordination protocol](./coordination.md)). No Teammate touches someone else's files.
3. **Model dependencies in the task graph** (`addBlocks` / `addBlockedBy`) so that
   Teammates only pull released, unblocked tasks.

## Troubleshooting

The three most common failure pictures:

| Symptom | Cause | Fix |
|---|---|---|
| Teammates do not appear as panes (they run "in-process", no splits) | You are not inside tmux — `echo $TMUX` prints nothing | Start tmux first (`./scripts/start-team.sh` or `tmux new -s agent-team`) and run `claude` inside it |
| Team tools (`TeamCreate`, `SendMessage`, …) do not exist | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is not set **in the shell that launched claude** | Exit claude, run `export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in that same shell (or use `./scripts/start-team.sh`, which sets it for you), then restart `claude` |
| Panes flicker, splits render broken, or keyboard shortcuts get swallowed | Ghostty (and some other GPU terminals) sometimes render tmux splits incorrectly or intercept shortcuts | Start tmux in a native terminal (Terminal.app, iTerm2) and run Claude inside it. Inside tmux, `$TERM_PROGRAM=tmux` and `$TERM=tmux-256color` — that is correct |

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
4. Close the tmux session: `tmux kill-session -t agent-team`.
```

> Merge discipline: **no merge without Human Go.** The human remains the conductor
> (see [coordination.md](./coordination.md)).
