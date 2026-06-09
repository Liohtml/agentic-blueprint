#!/usr/bin/env bash
# bootstrap.sh — one-shot setup for agentic-blueprint
# Idempotent: safe to re-run at any time.
set -euo pipefail

# Derive repo root from script location (never hardcode a user path)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ---------------------------------------------------------------------------
# Color helpers — only use tput when writing to a real TTY
# ---------------------------------------------------------------------------
if [ -t 1 ]; then
  GREEN=$(tput setaf 2)
  RED=$(tput setaf 1)
  YELLOW=$(tput setaf 3)
  BOLD=$(tput bold)
  RESET=$(tput sgr0)
else
  GREEN="" RED="" YELLOW="" BOLD="" RESET=""
fi

pass() { printf "%s  ✔ PASS%s %s\n" "$GREEN" "$RESET" "$1"; }
fail() { printf "%s  ✘ FAIL%s %s\n" "$RED"   "$RESET" "$1"; }
warn() { printf "%s  ⚠ WARN%s %s\n" "$YELLOW" "$RESET" "$1"; }
info() { printf "       %s\n" "$1"; }
header() { printf "\n%s%s%s\n" "$BOLD" "$1" "$RESET"; }

# ---------------------------------------------------------------------------
printf "\n%s%s=== agentic-blueprint bootstrap ===%s\n" "$BOLD" "$GREEN" "$RESET"

# ---------------------------------------------------------------------------
# 1. Preflight checks
# ---------------------------------------------------------------------------
header "Preflight checks"

HARD_FAIL=0

# node >= 20
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    pass "node $NODE_VER (>= 20 required)"
  else
    fail "node $NODE_VER — need >= 20"
    info "Fix: nvm install 20  OR  https://nodejs.org"
    HARD_FAIL=1
  fi
else
  fail "node not found"
  info "Fix: https://nodejs.org  OR  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/HEAD/install.sh | bash"
  HARD_FAIL=1
fi

# npm (comes with node, check anyway)
if command -v npm >/dev/null 2>&1; then
  pass "npm $(npm -v)"
else
  fail "npm not found (reinstall node from https://nodejs.org)"
  HARD_FAIL=1
fi

# git
if command -v git >/dev/null 2>&1; then
  pass "git $(git --version | awk '{print $3}')"
else
  fail "git not found"
  info "Fix: https://git-scm.com  OR  brew install git"
  HARD_FAIL=1
fi

# tmux
if command -v tmux >/dev/null 2>&1; then
  pass "tmux $(tmux -V | awk '{print $2}')"
else
  fail "tmux not found"
  info "Fix (macOS): brew install tmux"
  info "Fix (Linux): sudo apt install tmux  OR  sudo yum install tmux"
  HARD_FAIL=1
fi

# claude CLI (soft fail — warn + install hint)
if command -v claude >/dev/null 2>&1; then
  pass "claude CLI found"
else
  warn "claude CLI not found (needed to run agent teams)"
  info "Install: npm install -g @anthropic-ai/claude-code"
fi

# gh (optional)
if command -v gh >/dev/null 2>&1; then
  pass "gh (GitHub CLI) found"
else
  warn "gh not found (optional)"
  info "Install (macOS): brew install gh   https://cli.github.com"
fi

# Bail out early on hard failures
if [ "$HARD_FAIL" -ne 0 ]; then
  printf "\n%s%sBootstrap aborted — fix the errors above and re-run.%s\n\n" "$RED" "$BOLD" "$RESET"
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS flag check
# ---------------------------------------------------------------------------
header "Agent-teams environment flag"

if [ "${CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS:-}" = "1" ]; then
  pass "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"
else
  warn "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS is not set to '1'"
  info "To enable for this shell session:"
  info "  export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"
  info "To persist across sessions, add to ~/.zshrc (or ~/.bashrc):"
  info "  echo 'export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1' >> ~/.zshrc"
fi

# ---------------------------------------------------------------------------
# 3. Install observer dependencies + build dashboard
# ---------------------------------------------------------------------------
header "Observer dependencies"

cd "$REPO_ROOT/observer"
printf "  → npm install\n"
npm install
printf "  → npm run build\n"
npm run build
cd "$REPO_ROOT"

printf "\n"
pass "Observer dashboard built and ready"

# ---------------------------------------------------------------------------
# 4. NEXT STEPS
# ---------------------------------------------------------------------------
printf "\n%s%s✔ Bootstrap complete! NEXT STEPS:%s\n" "$GREEN" "$BOLD" "$RESET"
cat <<'NEXTSTEPS'

  1. Enable the agent-teams flag (if not already set):
       export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

  2. Start a tmux session:
       tmux new -s agent-teams

  3. In the first pane, launch Claude Code:
       claude

  4. Paste the team prompt to kick off your agent team:
       # copy the contents of blueprint/templates/team-prompt.md into Claude

  5. Open a second pane (Ctrl+B, ") and start the live dashboard:
       ./scripts/observe.sh --team <name>

  6. Open your browser at http://localhost:4317 to watch the team live.

  For full details: README.md and docs/

NEXTSTEPS
