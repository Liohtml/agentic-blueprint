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
- **Secondary agent (optional):** <Antigravity | none>
- **Antigravity profile:** <A: UI/Design | C: Orchestrator | not used>
- **Review tool:** </code-review skill + second Claude Code agent | Greptile | manual>
- **Model Tiering:** Fable 5 (Lead/Mission) · Opus (hard logic) · Sonnet (standard) · Haiku (explore) — for current prices see `blueprint/meta/decision-trees.md`
- **Default effort:** <xhigh for Mission Chunks | high standard | low for subagents>

## Directory Assignments

> Which agent is responsible for which directories?
> Agents never work on the same files at the same time.

- **Claude Code:** <e.g. src/lib/, src/api/, src/services/, tests/>
- **Antigravity:** <e.g. src/components/, src/ui/, src/layouts/>
- **Shared (read-only in Phase 2):** <e.g. src/types/, src/contracts/>

## Conventions

- **Branch prefix:** feature/
- **Branch format:** feature/<chunk-no>-<agent>-<description>
- **Commit style:** <conventional commits | freeform>
- **Max Chunks per plan:** 8

## Dependencies via Open-Source (Fallback)

> Default: load dependency source directly via grep/read/web_fetch.
> This list is only for repos the agent cannot reach locally or via web_fetch.

- <github-url-1>
- <github-url-2>
