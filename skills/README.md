# Skills

Portable [Agent Skills](https://agentskills.io) — the open-standard packaging
of this blueprint's methods, so an agent can pull one capability into any
project without adopting the whole framework. The `SKILL.md` format is
recognized by tools that adopt the Agent Skills standard; because the skills
here use only the portable fields (`name`, `description`, markdown body,
bundled files), tool-specific frontmatter is simply ignored where a tool
doesn't support it — so they travel across compatible tools. Check your tool's
docs for whether and how it loads Agent Skills.

## Available skills

| Skill | What it does |
|-------|--------------|
| [`setup-autonomous-loop`](setup-autonomous-loop/) | Set up a gated autonomous agent loop — level (L1 report / L2 propose / L3 push), change scope, rate limits, abort condition, cost circuit breaker. The portable form of the blueprint's [autonomy-levels](../blueprint/loops/autonomy-levels.md) + [operations-loops](../blueprint/loops/operations-loops.md). |

## Install

Each skill is a self-contained folder (`SKILL.md` + optional `reference/`,
`templates/`). Copy the folder into your tool's skills directory:

- **Claude Code** — project scope: `.claude/skills/<skill>/`; personal scope:
  `~/.claude/skills/<skill>/`. Invoke with `/<skill-name>` or let the model
  trigger it from the description.
- **Other Agent-Skills tools** — drop the folder into the tool's skills
  location (see that tool's docs). Tool-specific frontmatter fields these
  skills don't use are simply ignored.

```bash
# example: Claude Code, project scope
mkdir -p .claude/skills
cp -r skills/setup-autonomous-loop .claude/skills/
```

## Contributing a skill

Keep the core portable (no tool-specific frontmatter in the required path),
put depth in `reference/` for progressive disclosure, and keep `SKILL.md`
focused on the procedure. This directory dogfoods the blueprint: a new skill
goes through research → devil's-advocate review → test before it ships.
