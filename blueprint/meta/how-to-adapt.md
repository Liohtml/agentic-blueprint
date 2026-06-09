# Setting Up the Blueprint for a New Project

## Step 1: Copy the Blueprint

Copy the entire `blueprint/` folder and `AGENTIC-BLUEPRINT.md` into your new project root.

```bash
cp -r /path/to/blueprint-repo/blueprint/ ./blueprint/
cp /path/to/blueprint-repo/AGENTIC-BLUEPRINT.md ./
```

## Step 2: Fill Out config.md

Open `blueprint/config.md` and fill out all fields:

1. **Project name and description** — what are you building?
2. **Tech stack** — which languages, frameworks, databases?
3. **Agents** — which agents do you use? Which Antigravity profile?
4. **Review tool** — `/code-review` skill + second agent (default), Greptile, or manual?
5. **Directory assignments** — which agent works where?
6. **Dependencies (fallback)** — which repos are not directly reachable via grep/read/web_fetch
   and should be loaded via open-source?

## Step 3: Generate CLAUDE.md and AGENTS.md

Give the agent the following prompt:

```
Read blueprint/config.md and blueprint/templates/CLAUDE.md.template.
Generate a project-specific CLAUDE.md based on the configuration.
Replace all {{PLACEHOLDERS}} with the values from config.md.

Do the same for AGENTS.md with blueprint/templates/AGENTS.md.template.
```

Review the generated files and commit them.

## Step 4: Load Dependencies (optional, fallback)

The default is direct source access (grep/read in `node_modules`, web_fetch).
Only for repos that are not reachable this way and were listed in config.md:

```bash
npx open-source <github-url>
```

Make sure `open-source/` is in `.gitignore`.

## Step 5: Get Going

Start with Phase 0 (Ideation) according to the Blueprint.

## Adaptations

### Changing loop limits
Edit the files under `blueprint/loops/`. Adjust `Max Iterations`.

### Adding a new phase
1. Create `blueprint/phases/XX-name.md` following the pattern of the existing phases
2. Add the phase to the table in `AGENTIC-BLUEPRINT.md`
3. Update `blueprint/meta/changelog.md`

### Adding a new agent
1. Create `blueprint/agents/new-agent.md` following the pattern of the existing agents
2. Add the agent to `AGENTIC-BLUEPRINT.md`
3. Define directory responsibilities in `blueprint/config.md`
4. Update the coordination protocol in `blueprint/agents/coordination.md`

### Refining prompt templates
The prompt templates live in the respective phase files. Adapt them based on experience — especially after retros.
