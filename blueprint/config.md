# Project Configuration

> Fill out this file before using the Blueprint.
> The agent reads this file to make project-specific decisions.

## Project

- **Name:** <PROJECT_NAME>
- **Description:** <1-2 sentences on what the project does>
- **Tech stack:** <e.g. Next.js, Svelte, FastAPI, ...>
- **Repository:** <GitHub URL>

## Agents

- **Primary agent:** Claude Code
- **Secondary agent (optional):** <second Claude Code agent (separate session or teammate) | none>
- **Review tool:** </code-review skill + second Claude Code agent | Greptile | manual>
- **Model Tiering:** Fable 5 (Brain: judgment/DA/Mission) · Opus 4.8 (Orchestrator: Lead + hard logic) · Sonnet 5 (Worker/Researcher) · Haiku 4.5 (Scout) — doctrine and current prices: `blueprint/meta/decision-trees.md`
- **Default effort:** <xhigh for Mission Chunks | high standard | low for subagents>

## Directory Assignments

> Which agent is responsible for which directories?
> Agents never work on the same files at the same time.

- **Primary agent:** <e.g. src/lib/, src/api/, src/services/, tests/>
- **Secondary agent:** <e.g. src/components/, src/ui/, src/layouts/>
- **Shared (read-only in Phase 2):** <e.g. src/types/, src/contracts/>

## Conventions

- **Branch prefix:** feature/
- **Branch format:** feature/<chunk-no>-<agent>-<description>
- **Commit style:** <conventional commits | freeform>
- **Max Chunks per plan:** 8

## Autonomous Loops (optional)

> This table holds the **project's instances** — which loops are enabled, at
> which level, with which ceilings. The **pattern definitions** (format, abort
> conditions, catalog) live in `blueprint/loops/operations-loops.md`; the level
> semantics in `blueprint/loops/autonomy-levels.md`. Instances here, patterns
> there — one owner each.
> An honest note: an unfilled row enforces nothing — this is a readiness
> checklist the maintainer applies before installing a schedule, not a gate
> that fires on its own. A loop whose row can't be filled in isn't ready.
> Update the "Current level" cell on every promotion/demotion — on conflict,
> the decision log wins over this table.

| Loop | Cadence | Current level (starts L1) | Target level | Change scope | Cost ceiling | Clean runs for promotion (default 5) | State file |
|------|---------|---------------------------|--------------|--------------|--------------|--------------------------------------|------------|
| <e.g. Dependency Patch Sweeper> | <weekly> | L1 | <L2> | <lockfiles + manifest patch versions> | <$ or tokens per run> | <5> | <path> |

## Dependencies via Open-Source (Fallback)

> Default: load dependency source directly via grep/read/web_fetch.
> This list is only for repos the agent cannot reach locally or via web_fetch.

- <github-url-1>
- <github-url-2>
