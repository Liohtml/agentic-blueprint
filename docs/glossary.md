# Glossary

Short definitions of the terms used throughout the Agentic Blueprint. Alphabetical.

| Term | Definition |
|------|------------|
| **Agent Team** | Multiple Claude Code agents working in parallel on one feature, each in its own tmux pane, coordinated by a lead agent under strict file ownership. Experimental Claude Code feature. See [`blueprint/agents/agent-teams.md`](../blueprint/agents/agent-teams.md). |
| **Chunk** | The smallest unit of planned work: max 3–5 files, one fresh context window, one binary done-criterion. A feature with more than 8 chunks means the scope is too big. |
| **Conductor** | You — the human. You make architecture, scope, and technology decisions; agents execute. ("Human thinks, Agent builds.") |
| **Context Engineering** | Deliberately keeping an agent's context minimal and precise: reference specific files instead of loading the whole codebase, start a fresh thread per phase. |
| **Devil's Advocate** | A review step in which an agent (or human) deliberately attacks a plan or claim — looking for contradictions, missing paths, and overpromises — before work proceeds. |
| **Effort** | The second cost dimension besides model choice: how much reasoning effort an agent spends (low → xhigh). Mission chunks run high/xhigh; subagents typically low. |
| **File Ownership** | The coordination rule that every file has exactly one owning agent at a time. Agents never edit the same files concurrently; shared files are read-only during building. |
| **Gate (Quality Gate)** | A binary pass/fail check between phases. No phase-skipping: work only proceeds when the gate passes — and merging always requires the human's explicit Go. |
| **Handoff** | The structured transfer of work between agents or phases — e.g. the Phase 1 plan handed to the build agent, or a build agent's output handed to the review agent. Each handoff starts with a fresh context. |
| **Loop (Feedback Loop)** | An automated iterate-until-done cycle with a hard iteration limit: Build-Test (max 5), Cleanup-Verify (max 3), Review-Fix (max 7). When the limit is reached, the agent stops and escalates to you. |
| **Mission Mode** | An alternative to chunk-by-chunk building for Fable 5: one long-horizon assignment with the full spec up front, a binary definition of done, and high/xhigh effort. Quality gates stay unchanged. See [`blueprint/phases/02-building.md`](../blueprint/phases/02-building.md). |
| **Model Tiering** | Matching model to task cost/difficulty: Fable 5 for the lead and mission-critical work, Opus for hard logic, Sonnet as the standard worker, Haiku for scouting/exploration. |
| **Observer** | The live dashboard for running agent teams: streams per-agent token counts, costs, tool activity, and task progress at `http://localhost:4317`. See [`observer/README.md`](../observer/README.md). |
| **Phase** | One of the six workflow stages: 0 Ideation, 1 Planning, 2 Building, 3 Cleanup, 4 Review, 5 Merge. Each has its own doc under [`blueprint/phases/`](../blueprint/phases/), its own gate, and its own thread. |
| **Rubric** | A gradeable set of outcome criteria. In the cloud execution profile, the Phase 1 plan becomes a rubric that a grader scores against — enforcing "no self-review" structurally. |
| **Self-Review (forbidden)** | The rule that the agent who built something never reviews its own work. Review is done by a separate review agent (or human). |
| **Shared Contract** | Types/interfaces agreed on during planning and frozen before building starts (e.g. `src/types/`), so parallel agents can build against them without conflicts. |
| **Subagent** | A short-lived helper agent spawned for a narrow task (e.g. scouting the codebase), usually on a cheap model tier with low effort. |
| **Task Graph** | The dependency structure of an agent team's tasks, expressed with `blocks` / `blockedBy`, so teammates work in the right order without stepping on each other. |
