# Clone-and-Go Smoke Test

Verified on: 2026-06-09  
Branch: `feature/clone-and-go`  
Commits tested: `eb21e9a` (bootstrap scripts) + `05a7328` (docs)

## Steps & Results

### 1. Clean-room clone

```bash
git clone /Users/lionel/agentic-blueprint /tmp/cag-verify
cd /tmp/cag-verify && git checkout feature/clone-and-go
```

**Result:** ✅ Cloned cleanly. Branch `feature/clone-and-go` checked out, both target commits present.

---

### 2. Bootstrap

```bash
cd /tmp/cag-verify && bash scripts/bootstrap.sh
```

**Result:** ✅ All steps passed.

Preflight checks:
- ✔ node 24.14.0 (>= 20 required)
- ✔ npm 11.9.0
- ✔ git 2.39.5
- ✔ tmux 3.6b
- ✔ claude CLI found
- ✔ gh (GitHub CLI) found
- ✔ CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 env flag present

Observer deps + build:
- ✔ `npm install` — 195 packages installed
- ✔ `npm run build` — Vite build produced `web/dist/index.html`, `web/dist/assets/index-*.css`, `web/dist/assets/index-*.js`
- ✔ Observer dashboard built and ready

---

### 3. TypeScript typecheck

```bash
cd /tmp/cag-verify/observer && npm run typecheck
```

**Result:** ✅ `tsc --noEmit` exited 0 with no errors or warnings.

---

### 4. Headless server on non-default port

```bash
cd /tmp/cag-verify/observer && npm run observe -- --team repo-bootstrap --port 4318 --no-open &
curl http://localhost:4318/api/teams
kill <pid>
```

**Result:** ✅ Server started on port 4318. `/api/teams` returned valid JSON including the `repo-bootstrap` team entry:

```json
[
  {"name":"konzept-review", ...},
  {"name":"repo-bootstrap", "description":"Make the agentic-blueprint repo clone-and-go...", ...}
]
```

---

### 5. Cleanup

```bash
rm -rf /tmp/cag-verify
```

**Result:** ✅ Clone removed cleanly.

---

## Summary

| Step                         | Status |
|------------------------------|--------|
| Clone + branch checkout      | ✅ PASS |
| Preflight checks (all 6)     | ✅ PASS |
| Observer npm install         | ✅ PASS |
| Observer npm run build       | ✅ PASS |
| TypeScript typecheck         | ✅ PASS |
| Headless server + /api/teams | ✅ PASS |
| Cleanup                      | ✅ PASS |

**Overall: CLEAN-ROOM FLOW GREEN** — a fresh clone on a new device can run `bash scripts/bootstrap.sh` and immediately start the agent-teams flow with the Observer watching.
