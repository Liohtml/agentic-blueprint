# Docker Sandbox — Run Agents in an Isolated Environment

> How to put a coding agent inside a Docker container so it can build your
> project but cannot touch anything else on your machine. Template files live
> in [`sandbox/`](../sandbox/README.md). Born from real testing feedback:
> "I want to let the agent run, but not on my actual system."

## Why a sandbox

An autonomous agent runs shell commands. That is the whole point — it installs
packages, runs tests, edits files. But on your host machine, "can run shell
commands" means it could in principle also read your SSH keys, your other
projects, your browser profile, or delete files outside the project. Usually it
won't. "Usually" is not a security model.

A Docker container draws a hard line: inside the container, the agent sees
**only what you explicitly put there** — typically one mounted project folder
and nothing else. Host files, credentials, and other projects simply do not
exist from the container's point of view.

This is also the precondition for running agents with fewer permission prompts.
`claude --dangerously-skip-permissions` turns off Claude Code's confirmation
prompts entirely — the agent executes every command without asking. On your
host system that is reckless: one bad command, prompt injection from a web
page, or a hallucinated `rm -rf` and the damage is real. **Inside a container
it becomes a defensible trade-off**, because the blast radius is the container
plus the one mounted folder (which is in git — see the honest-limits section
below). Anthropic's own [devcontainer docs](https://code.claude.com/docs/en/devcontainer)
take the same position: skip-permissions is for isolated environments, and even
there it remains a risk you consciously accept, not a free lunch.

## Two paths

Both paths use the same template: [`sandbox/Dockerfile`](../sandbox/Dockerfile)
and [`sandbox/devcontainer.json`](../sandbox/devcontainer.json). They follow the
core ideas of Anthropic's
[reference devcontainer](https://github.com/anthropics/claude-code/tree/main/.devcontainer):
a Node base image, Claude Code installed globally via npm, a non-root user.
The reference setup additionally ships a firewall script that restricts
outbound network traffic to an allowlist (npm registry, GitHub, Anthropic API) —
we left that out of the minimal template, but it is the right next step if you
want network isolation too.

### Path A — VS Code Dev Container (recommended for beginners)

1. **Install Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)
   and start it. *You should see* the Docker whale icon in your menu bar /
   system tray, and `docker --version` prints a version in your terminal.
2. **Install the "Dev Containers" extension** in VS Code (publisher:
   Microsoft). *You should see* it listed under Extensions with a green
   "installed" state.
3. **Copy the template into your project:** create a folder `.devcontainer/`
   in your project root and copy `sandbox/Dockerfile` and
   `sandbox/devcontainer.json` into it. *You should see*
   `your-project/.devcontainer/Dockerfile` and
   `your-project/.devcontainer/devcontainer.json`.
4. **Reopen in container:** open the Command Palette (`Cmd/Ctrl+Shift+P`) →
   "Dev Containers: Reopen in Container". The first build takes a few minutes.
   *You should see* a progress notification, and afterwards the VS Code window
   reconnects with **"Dev Container: Agent Sandbox"** in the bottom-left corner.
5. **Start the agent inside the container:** open a VS Code terminal (it now
   runs *inside* the container — `whoami` prints `node`, not your username)
   and run `claude`. *You should see* the normal Claude Code startup screen.
   On first run, either `claude` walks you through login, or the
   `ANTHROPIC_API_KEY` passed through by `devcontainer.json` is used directly.

From here you work exactly as before — except every command the agent runs is
confined to the container.

### Path B — Plain Docker (CLI)

No VS Code required. Build the image once — from a clone of this repo (the
`sandbox/` folder is not part of the copied `blueprint/`):

```bash
docker build -t agent-sandbox sandbox/
```

Then run it with your project mounted:

```bash
cd /path/to/your-project
docker run -it --rm \
  -v "$PWD":/workspace \
  -w /workspace \
  -e ANTHROPIC_API_KEY \
  agent-sandbox
```

- `-v "$PWD":/workspace` mounts the current project folder into the container.
  **This is the only host path the agent can read or write.**
- `-e ANTHROPIC_API_KEY` passes the key from your shell environment. If you
  prefer not to put the key into the container, omit it and run `claude login`
  inside the container instead (credentials then live only in the container
  and vanish with `--rm`). Because of `--rm`, that means logging in again on
  every run. To keep the login across runs, add a persistent named volume for
  Claude's config: `-v claude-config:/home/node/.claude`.

You land in a bash shell as user `node` in `/workspace`. Start the agent with
`claude`, or — consciously, see above — with
`claude --dangerously-skip-permissions` for a fully autonomous run.

## What the sandbox does NOT protect

Be honest with yourself about the boundaries:

- **The mounted project folder is writable.** That's the point — the agent has
  to be able to edit your code. But it also means the agent can delete or
  mangle everything in that folder. Therefore: **commit (or push) before every
  autonomous run.** Git is your undo button; the container is not.
- **The network is open by default.** The agent can `curl` anything, install
  any package, and — under prompt injection — exfiltrate whatever it can read.
  Options: `docker run --network none` for fully offline runs, or an
  allowlist firewall like Anthropic's reference `init-firewall.sh`.
- **Secrets you pass in are visible inside.** `ANTHROPIC_API_KEY` (and anything
  else you mount or export into the container) can be read by every process in
  the container, including agent-executed commands. Pass in only what the run
  needs; never mount `~/.ssh`, `~/.aws`, or your whole home directory.
- **Containers are isolation, not a security guarantee.** Container escapes
  are rare but exist. For untrusted code, a VM is the stronger boundary. For
  the everyday case — "my own project, an agent I mostly trust, protection
  against accidents and most injection damage" — a container is the right tool.

## Where this fits in the Blueprint

The sandbox is most valuable wherever the Blueprint lets agents run with high
autonomy:

- **Phase 2 (Building), autonomous runs:** long Chunk implementations or
  [Mission Mode](../blueprint/phases/02-building.md) runs where you don't want
  to approve every command. Container + clean git state + (optionally)
  skip-permissions is the setup that makes those runs both fast and safe.
- **Agent Teams:** the [Agent Teams setup](../blueprint/agents/agent-teams.md)
  works inside the container unchanged — `tmux` is included in the image
  precisely for this. Inside the container:

  ```bash
  export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
  tmux new -s teamwork && claude
  ```

  Each Teammate gets its own tmux pane as usual, and the whole team shares the
  container's isolation boundary.
- **Not needed for Phases 0–1:** Ideation and Planning produce text, not shell
  commands. Run those wherever is convenient; reach for the sandbox when the
  agent starts executing.

Rule of thumb: the more autonomy you grant (skip-permissions, Mission Mode,
overnight runs, multi-agent teams), the more the sandbox shifts from
"nice to have" to "non-negotiable".
