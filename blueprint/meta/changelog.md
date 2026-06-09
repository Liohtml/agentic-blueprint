# Blueprint Changelog

## v1.2 — 2026-06-09

Fable-5-Neubewertung (Welle 1 der Roadmap).

### Neu
- **Fable-5-Evaluation** (`docs/2026-06-09-fable-5-evaluation.md`): vollstaendige
  Neubewertung aller Blueprint-Bestandteile gegen das Fable-5-Release (behalten /
  lockern / herabstufen / integrieren) plus 3-Wellen-Roadmap.
- **4-Stufen-Modell-Tiering** (Fable 5 / Opus / Sonnet / Haiku) in
  `agent-teams.md`, `team-prompt.md` und neuem Entscheidungsbaum in
  `decision-trees.md`. Fable 5 fuer Lead + Mission-Chunks, Haiku fuer Explore.

### Korrigiert
- **Observer-Pricing** (`observer/src/collector/pricing.ts`): Opus 4.8 auf $5/$25
  korrigiert (stand faelschlich auf $15/$75), Haiku 4.5 auf $1/$5, Fable 5
  ($10/$50) ergaenzt.

### Geplant (Welle 2/3, siehe Evaluation)
- Mission-Mode in Phase 2, Task Budgets in Loop-Specs, Kontext-Regeln entschaerfen,
  Prompt-Sprache-Audit, Outcome-graded Loops (Managed Agents), Memory fuer Retros.

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
