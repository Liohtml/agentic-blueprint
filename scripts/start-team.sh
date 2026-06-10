#!/usr/bin/env bash
# start-team.sh — start a Claude Code agent team in tmux with ONE command.
#
# Replaces the four manual steps (install checks, flag export, tmux session,
# claude launch) documented in blueprint/agents/agent-teams.md.
#
# Usage:
#   ./scripts/start-team.sh                    # checks → flag → tmux → claude
#   ./scripts/start-team.sh --observer <team>  # plus a second pane with the dashboard
#   ./scripts/start-team.sh --check            # run the install checks only
#   ./scripts/start-team.sh -h | --help
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SESSION_NAME="agent-team"

# ---------------------------------------------------------------------------
# Output helpers — every message gets a clear prefix
# ---------------------------------------------------------------------------
ok()   { printf "✓ %s\n" "$1"; }
err()  { printf "✗ %s\n" "$1" >&2; }
note() { printf "→ %s\n" "$1"; }
hint() { printf "    %s\n" "$1" >&2; }

usage() {
  cat <<'USAGE'
start-team.sh — start a Claude Code agent team in tmux with one command.

What it does:
  1. Checks that git, node (>= 20), the claude CLI and tmux (>= 3) are
     installed. If something is missing it tells you how to install it.
  2. Enables the agent-teams flag (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1).
  3. Starts a tmux session named "agent-team" and launches claude inside it.
     If you are already inside tmux, claude starts right where you are.

Usage:
  ./scripts/start-team.sh                    Start the team session
  ./scripts/start-team.sh --observer <team>  Also open a second pane running the
                                             Agent Observer dashboard for <team>
  ./scripts/start-team.sh --check            Run the install checks, start nothing
  ./scripts/start-team.sh -h | --help        Show this help
USAGE
}

# ---------------------------------------------------------------------------
# Preflight checks — checked in order, stop at the first problem
# ---------------------------------------------------------------------------
check_git() {
  if command -v git >/dev/null 2>&1; then
    ok "git $(git --version | awk '{print $3}')"
  else
    err "git is not installed. You need git to work with this repository."
    hint "Install on macOS:         brew install git"
    hint "Install on Debian/Ubuntu: sudo apt install git"
    exit 1
  fi
}

check_node() {
  local node_ver node_major
  if ! command -v node >/dev/null 2>&1; then
    err "node is not installed. Claude Code needs Node.js 20 or newer."
    hint "Install on macOS:         brew install node"
    hint "Install on Debian/Ubuntu: sudo apt install nodejs npm"
    hint "If apt gives you a version below 20, install from https://nodejs.org instead."
    exit 1
  fi
  node_ver="$(node -v)"
  node_ver="${node_ver#v}"
  node_major="${node_ver%%.*}"
  if [ "$node_major" -lt 20 ]; then
    err "node $node_ver is too old. Claude Code needs Node.js 20 or newer."
    hint "Upgrade on macOS:         brew upgrade node"
    hint "Upgrade on Debian/Ubuntu: install Node 20+ from https://nodejs.org"
    hint "(or with nvm:             nvm install 20)"
    exit 1
  fi
  ok "node $node_ver (>= 20 required)"
}

check_claude() {
  if command -v claude >/dev/null 2>&1; then
    ok "claude CLI found"
  else
    err "the claude CLI is not installed. It is the program that runs the agents."
    hint "Install (needs node/npm, any OS): npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
}

check_tmux() {
  local tmux_ver tmux_major
  if ! command -v tmux >/dev/null 2>&1; then
    err "tmux is not installed. tmux shows each teammate in its own pane."
    hint "Install on macOS:         brew install tmux"
    hint "Install on Debian/Ubuntu: sudo apt install tmux"
    exit 1
  fi
  tmux_ver="$(tmux -V | awk '{print $2}')" # e.g. "3.6b" or "next-3.5"
  tmux_major="$(printf '%s' "$tmux_ver" | sed 's/^[^0-9]*//; s/[^0-9].*$//')"
  if [ -z "$tmux_major" ] || [ "$tmux_major" -lt 3 ]; then
    err "tmux $tmux_ver is too old. Version 3 or newer is required."
    hint "Upgrade on macOS:         brew upgrade tmux"
    hint "Upgrade on Debian/Ubuntu: sudo apt install --only-upgrade tmux"
    exit 1
  fi
  ok "tmux $tmux_ver (>= 3 required)"
}

# ---------------------------------------------------------------------------
# Agent-teams feature flag
# ---------------------------------------------------------------------------
enable_flag() {
  local profile
  export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
  ok "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 (set for this run)"
  case "${SHELL:-}" in
    */zsh)  profile="~/.zshrc" ;;
    */bash) profile="~/.bashrc" ;;
    *)      profile="your shell profile (e.g. ~/.profile)" ;;
  esac
  note "To make the flag permanent, add this line to $profile:"
  printf "    export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\n"
}

# ---------------------------------------------------------------------------
# tmux crash course — the 3 things a first-time user needs
# ---------------------------------------------------------------------------
crash_course() {
  note "tmux crash course — the 3 things you need:"
  printf '    new pane:     press Ctrl-b, release, then press "\n'
  printf '    switch pane:  press Ctrl-b, release, then press an arrow key\n'
  printf '    get out:      type exit in every pane (or Ctrl-b then d to detach)\n'
}

# ---------------------------------------------------------------------------
# Launch
# ---------------------------------------------------------------------------
launch() {
  local observer_team="$1"
  local observe_cmd=""

  if [ -n "$observer_team" ]; then
    observe_cmd="$(printf '%q --team %q' "$REPO_ROOT/scripts/observe.sh" "$observer_team")"
    # Keep the pane open if the observer exits (e.g. with an error), so the
    # user can read what went wrong instead of the pane vanishing.
    observe_cmd="$observe_cmd; echo; echo 'observer exited — press Enter to close'; read -r"
  fi

  # Case 1: already inside tmux — no new session needed, start claude here.
  if [ -n "${TMUX:-}" ]; then
    ok "You are already inside tmux — starting claude in this pane."
    if [ -n "$observe_cmd" ]; then
      note "Opening a second pane with the observer dashboard (team: $observer_team)."
      tmux split-window -h -c "$PWD" "$observe_cmd"
      tmux select-pane -l
    fi
    exec claude
  fi

  # Case 2: not inside tmux — create (or re-attach to) the session.
  if tmux has-session -t "=$SESSION_NAME" 2>/dev/null; then
    note "A tmux session named '$SESSION_NAME' already exists — attaching to it."
    # Make sure the flag is set for panes opened from now on, even though the
    # session was created outside this script.
    tmux set-environment -t "=$SESSION_NAME" CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 1
    note "session already existed — the flag only reaches NEW panes; if team tools are missing in an old pane, restart claude there."
    crash_course
    exec tmux attach-session -t "=$SESSION_NAME"
  fi

  note "Starting tmux session '$SESSION_NAME' and launching claude inside it."
  crash_course
  # Start in the caller's working directory — the team works in YOUR project,
  # not in the blueprint repo the script happens to live in.
  tmux new-session -d -s "$SESSION_NAME" -c "$PWD"
  # Make the flag available to any pane opened later in this session ...
  tmux set-environment -t "=$SESSION_NAME" CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 1
  # ... and explicitly in the first pane, where claude starts right away.
  tmux send-keys -t "=$SESSION_NAME" \
    "export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 && claude" C-m
  if [ -n "$observe_cmd" ]; then
    note "Opening a second pane with the observer dashboard (team: $observer_team)."
    tmux split-window -h -t "=$SESSION_NAME" -c "$PWD" "$observe_cmd"
    tmux select-pane -l -t "=$SESSION_NAME"
  fi
  exec tmux attach-session -t "=$SESSION_NAME"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
  local check_only=0
  local observer_team=""

  while [ $# -gt 0 ]; do
    case "$1" in
      -h|--help)
        usage
        exit 0
        ;;
      --check)
        check_only=1
        shift
        ;;
      --observer)
        if [ $# -lt 2 ] || [ -z "$2" ]; then
          err "--observer needs a team name, e.g.: ./scripts/start-team.sh --observer my-team"
          exit 1
        fi
        observer_team="$2"
        shift 2
        ;;
      *)
        err "Unknown option: $1"
        usage >&2
        exit 1
        ;;
    esac
  done

  note "Checking your setup (git, node, claude, tmux) ..."
  check_git
  check_node
  check_claude
  check_tmux

  if [ "$check_only" -eq 1 ]; then
    ok "All checks passed. Run ./scripts/start-team.sh to launch your team."
    exit 0
  fi

  enable_flag
  launch "$observer_team"
}

main "$@"
