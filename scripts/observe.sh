#!/usr/bin/env bash
# observe.sh — thin wrapper to run the observer dashboard from the repo root.
# Usage: ./scripts/observe.sh --team <name> [--port <N>]
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT/observer"
exec npm run observe -- "$@"
