# Team Lead Prompt Template — Agent Teams

> Copy this prompt into Claude Code, fill in all `<PLACEHOLDERS>`, and start your team.
> Generalized from building the **[Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md)**.
> Setup & runbook: **[blueprint/agents/agent-teams.md](../agents/agent-teams.md)**.

---

You are the team Lead for the following undertaking. Create the team, set up the task graph,
and coordinate the Teammates through to completion.

## Mission

**Goal:** `<SHORT DESCRIPTION — e.g. "Build a live dashboard for Agent Teams">`

**Repo:** `<PATH-TO-REPO>` · **Branch:** `<FEATURE-BRANCH>`

**Tech constraints:**
- `<TECH STACK — e.g. "Node 20 + TypeScript, no framework except Vite for the web UI">`
- `<FURTHER CONSTRAINTS — e.g. "no Express; only Node stdlib http">`

**Definition of Done:**
- [ ] `<ACCEPTANCE CRITERION 1 — e.g. "npm test && npm run typecheck run clean">`
- [ ] `<ACCEPTANCE CRITERION 2 — e.g. "Dashboard shows live data of a real team">`

---

## Mandatory Rules (non-negotiable)

### 1 · Shared Contract first

Create a **blocker task T1** (e.g. `types.ts`, API interface, data contract).

- T1 **blocks all other tasks** (`addBlocks: ["T2", "T3", …]`).
- Spawn only the T1 worker. Only when T1 is `completed` are the remaining tasks
  released and the remaining Teammates spawned.
- After release, the contract is **READ-ONLY** — changes require: STOP all agents,
  human decides, restart of the affected tasks.

### 2 · File Ownership (no overlap)

Every Teammate exclusively owns their files.
**No Teammate touches another Teammate's files.**

Define the ownership matrix in the plan before the first agents are spawned:

| Teammate | Own files / directories |
|---|---|
| `<AGENT-1>` | `<PATHS — e.g. src/server/, src/parsers/>` |
| `<AGENT-2>` | `<PATHS — e.g. web/src/, web/index.html>` |
| `<AGENT-3>` | `<PATHS — e.g. src/metrics/, src/watcher/>` |

If two tasks need the same file → **sequential**, not parallel.
Details: [coordination.md](../agents/coordination.md).

### 3 · Model Tiering (cost control)

For current prices see [decision-trees.md](../meta/decision-trees.md).

| Model | When to use |
|---|---|
| **Fable 5** | Lead/coordinator, Mission Chunks, architecture-critical tasks (2× the Opus price — use deliberately) |
| **Opus** | Hard logic, parsers, algorithms, aggregation with correctness risk |
| **Sonnet** | Scaffold, UI, CRUD, tests, docs, everything else |
| **Haiku** | Explore/research subagents, mechanical bulk edits |

```
Agent(team_name: "<TEAM>", name: "<LEAD-AGENT>", model: "fable",  …)
Agent(team_name: "<TEAM>", name: "<HARD-AGENT>", model: "opus",   …)
Agent(team_name: "<TEAM>", name: "<REST-AGENT>", model: "sonnet", …)
Agent(team_name: "<TEAM>", name: "<SCOUT-AGENT>", model: "haiku", …)
```

Spawn **on demand**: T1 first on its own, only after T1 is green the rest.
10 idle panes waiting for a contract is expensive.

### 4 · Task Graph with Dependencies

Set up **all tasks with `addBlocks` / `addBlockedBy`** before you spawn the first Teammates.
Teammates only pull released, unblocked tasks.

Example graph (adapt it to your undertaking):

```
T1 [shared-contract]  →  blocks T2, T3, T4, T5
T3 [server]           →  blocks T6
T4 [parser]           →  blocks T7
T6 + T7               →  block T8 [integration]
…
```

### 5 · Build-Test Loop (max 5 iterations)

Each Teammate runs **at most 5 build-test iterations** per task.
On expiry: **STOP** — document the blocker, escalate to the Lead.
No endless fiddling.

### 6 · No Self-Review

The author of a Chunk does **not review their own code**.
Assign reviews to another Teammate or keep them as the Lead.

### 7 · No Merge Without Human Go

No Teammate merges, force-pushes, or closes PRs on their own.
The human gives the final go after their own review.

---

## Team Composition

```bash
# Create the team (you are the Lead)
TeamCreate "<TEAM-NAME>"
```

| # | Teammate | Task | Model | Own files |
|---|---|---|---|---|
| T1 | `<CONTRACT-AGENT>` | Types / shared interface | sonnet | `<e.g. src/types.ts>` |
| T2 | `<AGENT-A>` | `<TASK>` | sonnet | `<PATHS>` |
| T3 | `<AGENT-B>` | `<TASK>` | opus | `<PATHS>` |
| T4 | `<AGENT-C>` | `<TASK>` | sonnet | `<PATHS>` |

_Spawn the T1 worker first. After T1 is green: spawn the rest in one wave._

---

## Completion & Verification

When all tasks are `completed`:

1. **Smoke test:** `<COMMAND — e.g. "npm test && npm run typecheck">`
2. **Integration check:** Start the result manually: `<COMMAND — e.g. "npm run observe">`
3. **Verify visually:** `<WHAT TO CHECK — e.g. "Dashboard shows live token data">`
4. **Cleanup:** Send `{ type: "shutdown_request" }` to every Teammate; they reply with
   `shutdown_response` and end their process/pane.
5. **Obtain Human Go:** No merge without confirmation by the human.
6. **Clean up the team:** `TeamDelete "<TEAM-NAME>"` + `tmux kill-session -t <SESSION>`.

---

## Worked Example — Agent Observer

This template is an abstraction of how the **[Agent Observer](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/README.md)**
in this repo was built:

- **10 Teammates** (T1–T10) on a shared branch (`feature/agent-observer`).
- **T1** (`types.ts`) as the blocker contract — all others waited for T1 to be green.
- **T5** (transcript parser) and **T7** (token aggregator) on **Opus** (hard logic),
  all remaining eight on **Sonnet**.
- Strict File Ownership: no Teammate touched another's files.
- No merge without Human Go after the final review.

Observe a running team live:

```bash
./scripts/observe.sh --team <TEAM-NAME>
# opens the dashboard at http://localhost:4317
```
