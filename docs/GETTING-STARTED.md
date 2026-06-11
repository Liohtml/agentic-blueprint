# Getting Started — Your First Win

This guide walks you through one deliberately small, end-to-end task: **planning a mini feature with Phase 0 (Ideation) and Phase 1 (Planning)**. No code gets written, nothing can break, and you'll see the blueprint's core idea — *you think, the agent structures* — in action in under 15 minutes.

Pick your track:

- 🟢 [Track A — "I'm not technical"](#-track-a--im-not-technical) — no terminal, no git, no installation
- 🔵 [Track B — "I'm a developer"](#-track-b--im-a-developer) — full setup, including optional Agent Teams + Observer

Unfamiliar terms (Phase, Gate, Chunk, ...) are defined in the [Glossary](glossary.md).

---

## Existing project or starting from scratch?

If you use **Claude Code**, you don't set the blueprint up yourself — you paste **one prompt** and the agent does the whole setup: the [setup wizard prompt](../blueprint/templates/setup-wizard-prompt.md). It handles both situations:

[Claude Code](https://claude.com/claude-code) is Anthropic's AI coding agent — a program that reads and edits the files in a folder for you; install it from that link if you don't have it yet. To "open it in your project's folder": in a terminal, type `cd path/to/your/project` and then `claude` — or, if you use the VS Code extension, open the folder in VS Code and open the Claude panel.

**"I have an existing project."**

1. Open Claude Code in your project's folder. *(What you should see: Claude Code running, your project files visible to it.)*
2. Paste the full [setup wizard prompt](../blueprint/templates/setup-wizard-prompt.md). *(What you should see: the agent names your tech stack — e.g. "This looks like a Next.js app" — then downloads `AGENTIC-BLUEPRINT.md` and the `blueprint/` folder into your project.)*
3. Answer its questions, one at a time. Every question comes with a suggested default — if you're unsure, take the suggestion. *(What you should see: `blueprint/config.md` filling up with your answers, then a generated `CLAUDE.md` and `AGENTS.md`. If you already had a `CLAUDE.md`, the agent proposes a merge instead of replacing it.)*

**"I'm starting from scratch (empty folder)."**

1. Create a new, empty folder and open Claude Code in it. *(What you should see: Claude Code running in an empty directory — that's fine.)*
2. Paste the full [setup wizard prompt](../blueprint/templates/setup-wizard-prompt.md). *(What you should see: the agent says the folder is empty and explicitly does **not** create any project structure yet — scaffolding comes after Phase 0 and Phase 1, once you know what you're building. It still downloads the blueprint files.)*
3. Answer its questions; for an empty project, things like directory assignments stay minimal or are marked "decided later". *(What you should see: a filled `blueprint/config.md` plus generated `CLAUDE.md` and `AGENTS.md` — and nothing else added to your folder.)*

In both cases, setup ends with a plain-language summary and a ready-to-copy **Phase 0 prompt** for your first feature. From there, continue below — Track A at Step 3, Track B at Step 2.

---

## 🟢 Track A — "I'm not technical"

**What you need:**

- A web browser
- Access to an AI agent that can read files: **Claude Code** (desktop app or web) or a regular chat at [claude.ai](https://claude.ai)

That's all. The blueprint is just folders and text files — there is nothing to install or run.

> **Using Claude Code?** Then skip Steps 1–2: paste the [setup wizard prompt](../blueprint/templates/setup-wizard-prompt.md) instead — see [Existing project or starting from scratch?](#existing-project-or-starting-from-scratch) above. The agent downloads the files and configures everything for you. Then come back here at Step 3.

### Step 1 — Download the blueprint (2 min)

1. Open the repository page on GitHub.
2. Click the green **Code** button, then **Download ZIP**.
   (If you're signed in to GitHub, **"Use this template"** also works and gives you your own copy — but it's not required.)
3. Unzip the downloaded file. You now have a folder called something like `agentic-blueprint-main`.

*(What you should see: a folder of readable markdown files — you can open any of them with a normal text editor.)*

### Step 2 — Give the agent the rules (2 min)

**If you use claude.ai chat:** start a new chat and upload these two files from the folder:

- `AGENTIC-BLUEPRINT.md` (the root rulebook)
- `blueprint/phases/00-ideation.md` (the Phase 0 instructions)

You'll upload `blueprint/phases/01-planning.md` later, when you reach Phase 1.

*(What you should see: both files attached to the chat, and the agent able to quote from them when you ask.)*

### Step 3 — Pick a tiny idea (1 min)

For your first run, choose something small and concrete. Good examples:

- "A feedback form for my website"
- "A page that lists my favorite recipes"
- "A weekly email digest of my notes"

Don't overthink it — the point is to experience the workflow, not to build a product.

### Step 4 — Run Phase 0: Ideation (≈5 min)

Paste this prompt (fill in your idea):

> "Read `AGENTIC-BLUEPRINT.md`. I want to build **[your idea in one sentence]**. Start with Phase 0 and act as my sparring partner. Ask me one question at a time."

**What to expect:** the agent will *not* start building. It will ask you questions — what problem this solves, who it's for, what's explicitly out of scope. Answer in plain language; short answers are fine.

Phase 0 is done when the agent presents a short **problem statement and scope** and asks for your confirmation. That confirmation is your first **gate**: nothing proceeds without your explicit "yes".

### Step 5 — Run Phase 1: Planning (≈5 min)

(claude.ai users: upload `blueprint/phases/01-planning.md` now.)

Paste:

> "Phase 0 is approved. Move to Phase 1 and draft a plan. Break the work into small chunks I can review and approve one by one."

**What to expect:** a plan document with numbered chunks — each one a small, clearly described piece of work with its own "done" criterion. Read it. Ask the agent to change anything that doesn't match what you meant. When it looks right, say so.

### 🎉 That's your first win

You just did what most people never do with AI: instead of one vague prompt and a pile of unreviewable output, you produced a **scoped problem statement** and a **chunked, reviewable plan** — with you in control at every gate.

**Where to go next:**

- Continue with Phase 2 (Building) on the same idea: "Phase 1 is approved. Start Phase 2 with chunk 1." (For this you'll want an agent that can actually edit files, i.e. Claude Code.)
- Want to see a full run? The [worked example](examples/worked-example.md) shows all six phases on one small feature — including a failed test iteration and a rejected review finding.
- Read the [Glossary](glossary.md) to put names on what you just experienced.
- When you're ready for a terminal, switch to Track B below.

---

## 🔵 Track B — "I'm a developer"

**What you need (blueprint only):**

- [Claude Code CLI](https://claude.com/claude-code) installed and authenticated
- git
- A project to work in (an empty repo is fine)

### Step 1 — Run the setup wizard (≈5 min)

Start Claude Code in your project folder — an existing repo or a fresh empty directory, both work (see [Existing project or starting from scratch?](#existing-project-or-starting-from-scratch) for what differs) — and paste the full [setup wizard prompt](../blueprint/templates/setup-wizard-prompt.md).

The agent detects your tech stack, fetches `AGENTIC-BLUEPRINT.md` + `blueprint/` from the repo, interviews you to fill out `blueprint/config.md`, and generates `CLAUDE.md` + `AGENTS.md` — merging instead of overwriting if those files already exist.

*(What you should see when it's done: `AGENTIC-BLUEPRINT.md`, `blueprint/`, a filled `blueprint/config.md`, and generated `CLAUDE.md` + `AGENTS.md` in your project — plus a Phase 0 prompt ready to copy.)*

<details>
<summary>Manual setup (alternative, if you'd rather copy files yourself)</summary>

```bash
git clone https://github.com/Liohtml/agentic-blueprint.git
cd your-project
cp ../agentic-blueprint/AGENTIC-BLUEPRINT.md ./
cp -r ../agentic-blueprint/blueprint/ ./blueprint/
```

Then start Claude Code in your project and let the agent do the form-filling:

> "Read `blueprint/config.md`. Interview me one question at a time and fill it out for this project."

And generate your project-specific agent file:

> "Read `blueprint/config.md` and `blueprint/templates/CLAUDE.md.template`. Generate a project-specific `CLAUDE.md`."

</details>

### Step 2 — Sandbox your agents (recommended)

See [docs/docker-sandbox.md](docker-sandbox.md) to run agents safely in a container — recommended before giving agents autonomy.

### Step 2.5 — Optimize your terminal (optional, 5 min)

If you spend a lot of time in the terminal, a nice prompt and shell aliases speed up daily work.

[Terminal Setup](../../terminal-setup/README.md) covers:
- **Fast prompt** (Starship): shows git status, Node version, etc. at a glance
- **Fonts**: Nerd Fonts render glyphs correctly (git icons, symbols, etc.)
- **Shell aliases**: `clady` shortcut for `claude code --dangerously-skip-permissions`
- **Editor integration**: guides for Vim, Helix, Emacs, Micro

This is entirely optional — Claude Code works just as well in plain bash. But if you like a polished terminal experience, give it a try. ([Quick start in 5 minutes.](../../terminal-setup/QUICKSTART.md))

### Step 3 — First win: plan a mini feature (≈8 min)

Pick a small real feature from your backlog (or invent one). Then:

> "Read `AGENTIC-BLUEPRINT.md`. I want to build **[feature]**. Start with Phase 0."

Work through Phase 0 (ideation — the agent interviews you, you approve scope) and Phase 1 (planning — the agent produces a chunked plan, you approve it). Two phases, two gates, one reviewable plan. That's the first win; everything after Phase 1 is the same pattern with more autonomy.

From here you can let the agent run Phase 2 (Building) chunk by chunk — each chunk caps at 3–5 files, the build-test loop caps at 5 iterations, and nothing merges without your Go.

### Step 4 (optional) — Agent Teams + Observer

If you want multiple Claude Code agents working in parallel with a live dashboard, you need additional tooling:

**Extra requirements:** tmux ≥ 3.x · Node.js ≥ 20 · the experimental agent-teams flag

```bash
cd agentic-blueprint
./scripts/bootstrap.sh                              # installs Observer deps, verifies tmux/node/git

export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1       # experimental Claude Code feature
# make it permanent: add the line above to ~/.bashrc, ~/.zshrc, or your shell's profile

tmux new -s agent-teams                             # one split-pane per teammate
claude                                              # then paste your filled-in team prompt
```

Fill in [`blueprint/templates/team-prompt.md`](../blueprint/templates/team-prompt.md) as your team prompt, and watch the team live in a second pane (`Ctrl-b "`):

```bash
./scripts/observe.sh --team <name>                  # dashboard at http://localhost:4317
```

Full runbook: [`blueprint/agents/agent-teams.md`](../blueprint/agents/agent-teams.md) · Observer details: [`observer/README.md`](../observer/README.md)

---

## Troubleshooting

- **The agent starts coding immediately instead of asking questions.** Re-paste the prompt and add: "Do not write any code. Phase 0 is ideation only." Phase discipline is the whole point — insist on it.
- **The agent's plan has huge chunks.** Say: "Each chunk must touch at most 3–5 files and have a binary done-criterion. Re-chunk the plan."
- **claude.ai can't see referenced files.** In a plain chat, the agent only knows files you uploaded. Upload the specific file it needs (e.g. the next phase doc), or switch to Claude Code, which reads the folder directly.
- **`observe.sh` or agent teams don't start.** Check that `bootstrap.sh` ran without errors and that `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set in the shell where you run `claude`.
