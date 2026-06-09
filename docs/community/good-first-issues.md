# Good First Issues — Ready-to-Post Drafts

Five fully specified starter tasks for new contributors. Each one is written so that **no prior context about this repo is required** — title, context, exact files, steps, expected result, and how to verify.

**For maintainers:** copy each section below into a new GitHub Issue and add the labels `good first issue` + `help wanted`.

**For contributors:** pick one, comment on the issue so we know you're on it, then follow the 5-step guide in [CONTRIBUTING.md](../../CONTRIBUTING.md). The repo is English-first — please write all new content in English.

---

## Issue 1 — Create `RUBRIC.md.template` for outcome-graded loops

**Suggested labels:** `good first issue`, `help wanted`, `templates`

### Context

The blueprint supports running builds as autonomous "outcome" sessions: an agent iterates against a rubric, and an independent grader scores each iteration (see `blueprint/agents/managed-agents.md`). The rule there is "the Phase-1 plan **is** the rubric" — but there is no copy-paste template that shows what a good, gradeable rubric actually looks like, so users have to invent the format themselves.

### Files

- **Create:** `blueprint/templates/RUBRIC.md.template`
- **Read for context:** `blueprint/agents/managed-agents.md`, `blueprint/templates/PLAN.md.template`, `blueprint/loops/review-fix-loop.md`

### What to do

Write a template (in English) that turns a Definition of Done into a gradeable rubric. It should contain:

1. A header block with placeholders: mission name, source plan, `max_iterations` (blueprint convention: 5 for build, 7 for review).
2. A criteria table with columns: **#**, **Criterion**, **How the grader checks it**, **Pass condition (binary)**.
3. 2-3 filled-in example rows demonstrating the key rule from `managed-agents.md`: criteria must be objectively checkable ("the CSV has a numeric `price` column"), never vague ("the data looks good").
4. A short "Anti-patterns" footer: vague wording, criteria that require running the human's judgment, more than ~10 criteria.

Use `<PLACEHOLDERS>` in angle brackets, matching the style of `blueprint/templates/team-prompt.md`.

### Definition of done / how to verify

- The file exists at `blueprint/templates/RUBRIC.md.template` and is self-explanatory without reading this issue.
- Someone with a finished Phase-1 plan could produce a working rubric in under 10 minutes by filling in the placeholders.
- No verification tooling needed — this is a markdown-only change (see CONTRIBUTING: docs/templates need no project testing).

**Estimated effort:** 1-2 hours.

---

## Issue 2 — Create `HANDOFF.md.template` for phase and agent handoffs

**Suggested labels:** `good first issue`, `help wanted`, `templates`

### Context

The blueprint mandates a fresh context window ("new thread") at every phase change, and the coordination protocol (`blueprint/agents/coordination.md`, handoff-artifacts section) lists what one agent must hand to the next: contracts, shared types, status, blockers. But there is no template for that handoff document — every team improvises it, and information gets lost between phases.

### Files

- **Create:** `blueprint/templates/HANDOFF.md.template`
- **Read for context:** `blueprint/agents/coordination.md`, `AGENTIC-BLUEPRINT.md` (phase table and "new thread per phase" rule)

### What to do

Write a one-page template (in English) that an agent fills in at the end of a phase, and the next agent (or the same agent in a fresh thread) reads first. Sections:

1. **From / To** — phase number + agent role on each side (e.g. "Phase 2, build agent → Phase 3, cleanup agent").
2. **State** — what is done, what is explicitly not done, branch name.
3. **Contracts & files** — which files are the shared contract (read-only), which files the receiving agent owns.
4. **Open blockers / escalations** — anything the human still needs to decide.
5. **Verify before you start** — 1-3 commands or checks the receiving agent runs to confirm the handoff state is real (e.g. tests green, build passes).

Keep it under ~60 lines — handoffs that are too long don't get read.

### Definition of done / how to verify

- File exists at `blueprint/templates/HANDOFF.md.template`, uses `<PLACEHOLDERS>`, fits on one screen-ish page.
- A reader who has only seen `AGENTIC-BLUEPRINT.md` can fill it in without further explanation.
- Markdown-only change — no testing required.

**Estimated effort:** 1-2 hours.

---

## Issue 3 — Extend and cross-link the glossary (`docs/glossary.md`)

**Suggested labels:** `good first issue`, `help wanted`, `docs`

### Context

The repo has a glossary at `docs/glossary.md` covering 18 core terms, but several concepts that appear throughout the blueprint are still missing, and the blueprint documents themselves never link into the glossary — so readers who hit an unknown term in a phase doc have no path to its definition.

### Files

- **Edit:** `docs/glossary.md`
- **Read for context:** `AGENTIC-BLUEPRINT.md`, `blueprint/loops/` (the three loop specs), `blueprint/agents/managed-agents.md`, `blueprint/meta/retro-template.md`

### What to do

1. Add the missing terms, alphabetized into the existing list, matching the existing entry style (bold term, 1-3 plain-language sentences, link to the defining file): *Build-Test Loop, Cleanup-Verify Loop, Review-Fix Loop, Definition of Done, Escalation, Outcome, Retro, Teammate, Task Budget, Mission Chunk* (as a pointer to Mission Mode if you prefer).
2. Spot-check the existing 18 definitions against the current blueprint and fix anything that drifted.
3. Optional stretch: add a "see the [Glossary](../docs/glossary.md)" pointer to the intro of `AGENTIC-BLUEPRINT.md` — one line, nothing more.

Definitions must be understandable by someone who has never used the blueprint — define from scratch in your own words.

### Definition of done / how to verify

- All listed terms exist in `docs/glossary.md`, alphabetized, each with a definition and (where useful) a link.
- Spot check: a colleague (or an LLM with no repo context) can read any definition and correctly explain the concept back.
- Markdown-only change — no testing required.

**Estimated effort:** 1-2 hours.

---

## Issue 4 — Document team-sizing heuristics in `agent-teams.md`

**Suggested labels:** `good first issue`, `help wanted`, `docs`

### Context

`blueprint/agents/agent-teams.md` explains how to spawn an agent team and how to tier models for cost control, but it never answers the first question everyone asks: **how many teammates, and how many tasks each?** The worked example (the Agent Observer) used 10 teammates, which reads like a recommendation — it isn't; it's the upper end.

### Files

- **Edit:** `blueprint/agents/agent-teams.md` (add one new section; don't restructure the rest)
- **Read for context:** the "Kosten-Hinweise" (cost notes) section in the same file, `blueprint/templates/team-prompt.md` (team composition table)

### What to do

Add a new section **"Team Sizing"** between the model-tiering and cost-notes sections. It should state these heuristics and the reasoning behind each:

1. **Default to 3-5 teammates.** Coordination overhead grows with every pane; beyond 5, the lead spends more tokens coordinating than the team saves by parallelizing.
2. **Plan 5-6 tasks per teammate.** Fewer means the teammate idles after one task; many more means the task graph was cut too fine.
3. **One teammate is often enough.** If the feature is fewer than ~8 chunks and has no parallelizable file ownership split, use a single session (or a Fable 5 mission chunk) instead of a team.
4. **Scale by ownership boundaries, not by ambition.** The number of cleanly separable file-ownership areas is the hard ceiling for useful team size.
5. Add one sentence putting the 10-teammate Observer example in context: it was a deliberately large stress test, not the default.

### Definition of done / how to verify

- The new section exists, is < 40 lines, and the rest of the file is unchanged.
- All internal links in the file still work (click them on your fork's GitHub view).
- Markdown-only change — no testing required.

**Estimated effort:** 1-2 hours.

---

## Issue 5 — Create `LEARNINGS.md.template` as a project-memory pattern

**Suggested labels:** `good first issue`, `help wanted`, `templates`

### Context

The retro template (`blueprint/meta/retro-template.md`, section "Learnings persistieren") makes an important point: learnings must live where agents automatically read them, not in a retro doc nobody loads. But there is no template for that persistent memory file — projects have nowhere standard to accumulate "we tried X, it failed because Y, do Z instead."

### Files

- **Create:** `blueprint/templates/LEARNINGS.md.template`
- **Read for context:** `blueprint/meta/retro-template.md`, `blueprint/templates/CLAUDE.md.template` (style reference for generated agent files)

### What to do

Write a template (in English) for a `LEARNINGS.md` that lives in a user's project root next to `CLAUDE.md` and gets appended after every retro. Include:

1. A header comment explaining the rule: agents read this file at session start; keep entries short; prune entries that became obsolete (cap the file at ~50 entries / ~200 lines).
2. An entry format with placeholders: date, phase/loop where it happened, **Learning** (one sentence), **Rule going forward** (one imperative sentence an agent can follow).
3. Two filled-in example entries, e.g. one about a loop that hit its iteration limit and one about context curation.
4. A short note on the relationship to `CLAUDE.md`: stable, universal rules graduate from `LEARNINGS.md` into `CLAUDE.md`; `LEARNINGS.md` is the staging area.

### Definition of done / how to verify

- File exists at `blueprint/templates/LEARNINGS.md.template` with header rule, entry format, and 2 example entries.
- Cross-check: the format is consistent with the checklist items under "Learnings persistieren" in `blueprint/meta/retro-template.md`.
- Markdown-only change — no testing required.

**Estimated effort:** 1-2 hours.
