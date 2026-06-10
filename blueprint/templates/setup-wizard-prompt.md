# Setup Wizard Prompt

This is the fastest way to get the blueprint into your project — the agent does
the entire setup for you. Open [Claude Code](https://claude.com/claude-code) in
your project folder (a brand-new empty folder works too), then copy everything
inside the box below and paste it as one message.

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

**What you should see after pasting:** the agent describes your folder (tech
stack or "empty"), downloads the two blueprint items, then interviews you one
question at a time. Setup ends with a plain-language summary and a Phase 0
prompt you can copy to start your first feature.
