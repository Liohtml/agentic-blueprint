# Contributing to Agentic Blueprint

Thanks for your interest! This project is a community-driven framework for autonomous AI-assisted engineering workflows. Most of it is **markdown** — you can make a meaningful contribution without writing a single line of code.

**New here?** Pick something from [docs/community/good-first-issues.md](docs/community/good-first-issues.md) — five fully specified starter tasks, no prior context required. The roadmap lives in [docs/BACKLOG.md](docs/BACKLOG.md).

## Your First Contribution in 5 Steps

Most contributions are a change to one markdown file. Here is the entire process:

1. **Fork** the repository (button at the top right on GitHub).
2. **Create a branch** from `main`:
   ```bash
   git checkout -b improve/phase-2-prompt
   ```
3. **Edit one file** — for example a phase doc under `blueprint/phases/`, a template under `blueprint/templates/`, or a doc under `docs/`. Keep the change focused on one thing.
4. **Commit and push** to your fork.
5. **Open a Pull Request.** The PR template asks three short questions; answering them takes two minutes.

That's it. No build step, no environment setup, no CLA.

## What Testing Is Expected (Honestly: Usually None)

| You changed... | What we ask of you |
|---|---|
| Docs, templates, glossary, typos, translations | **Nothing.** Just open the PR. |
| Workflow content (phases, loops, agent roles, quality gates) | Tell us in the PR how you validated it — ideally you used the modified blueprint in a real project, but a well-reasoned argument is fine too. |
| Observer code (`observer/`) | Run `cd observer && npx vitest run` and confirm it's green in the PR checklist. |

The old rule "test every change in an actual project" applies **only to workflow changes**, not to documentation or templates.

## What Maintainers Promise You

- **First response within 7 days** on issues and PRs. Usually faster.
- **Small, focused PRs get reviewed first.** A one-file PR beats a ten-file PR.
- **You'll get a clear yes/no with a reason** — no PRs left to rot silently.
- If we can't merge something, we'll tell you why and, where possible, what would make it mergeable.

## What Gets Merged

- **Better prompt templates** — if a prompt works better in a specific phase, share it
- **New templates** — rubrics, handoffs, learnings, checklists (see good-first-issues)
- **New agent profiles** — if you use a different AI tool, add a profile for it
- **Loop limit adjustments** — backed by experience or data
- **Translations** — much of the blueprint content is currently in German; English translations are very welcome
- **Real-world retros** — anonymized retrospectives from actual projects help everyone calibrate
- **Observer fixes and improvements** — with passing tests

## What Doesn't Get Merged

- Changes that add complexity without clear benefit
- Vendor lock-in (the blueprint is built for Claude Code first, but its principles stay harness-agnostic)
- Marketing language or promotional content
- Large rewrites without a prior issue/discussion — open an issue first so we agree on direction before you invest time

## This Repo Eats Its Own Dog Food

Agentic Blueprint is itself developed following the blueprint: agent teams do the implementation work, a human reviews and merges. **PRs authored by agent teams are explicitly welcome** — under one condition: a human takes responsibility for the PR, has reviewed it, and answers review feedback. Mention in the PR description that agents were involved; we think that's a feature, not something to hide.

## Reporting Bugs & Suggesting Ideas

- **Bug** (usually the Observer): use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Blueprint improvement or new pattern:** use the [idea template](.github/ISSUE_TEMPLATE/idea.md)
- **Question:** open a [GitHub Discussion](../../discussions) — no template needed

## Code of Conduct

Be respectful, constructive, and focused on making the blueprint better for everyone.
