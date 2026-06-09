# Blueprint Changelog

## v1.1 — 2026-06-09

Agent Teams + Live-Observability.

### Neu
- **Agent Teams Setup** (`blueprint/agents/agent-teams.md`): echte Teammates in tmux-
  Split-Panes statt Subagents/Workflow — Feature-Flag, tmux-Voraussetzung + Ghostty-
  Caveat, Runbook, Modell-Tiering, Kosten-Hinweise, Cleanup.
- **Agent Observer** (`observer/`): lokales Live-Dashboard, das Status, Laufzeit,
  Tokens (in/out/cache), Kosten-Schätzung, Aktivität, Tasks und Nachrichten jedes
  Agents eines laufenden Teams aus Claude Codes eigenen `~/.claude`-Dateien anzeigt.
  Node `http` + SSE Backend, Vite/React/Tailwind/uPlot Frontend. Start: `npm run observe`.
- Gebaut von einem 10-köpfigen Agent-Team („agent-observer") nach strikter Datei-
  Eigentums-Aufteilung und Shared-Contract-First.

## v1.0 — 2026-05-22

Initiale Version des Agentic Engineering Blueprints.

### Enthalten
- 6 Kernprinzipien
- 6 Phasen-Modell (Ideation bis Merge)
- Agent-Rollen: Claude Code + Antigravity (3 Profile)
- Multi-Agent Koordinationsprotokoll
- Context Engineering Regeln und Hierarchie
- 3 Feedback Loops mit Abbruch-Bedingungen
- 4 Qualitaets-Gates
- Templates fuer CLAUDE.md, AGENTS.md, PLAN.md, PR
- Meta-System: Bootstrapping, Entscheidungsbaeume, Retro-Template
- Basiert auf: "Why This Dev Ships 100x Faster" (David Ondrej / Mickey Podcast)
