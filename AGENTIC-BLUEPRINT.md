# Agentic Engineering Blueprint v1.0

> Dieses Dokument ist die zentrale Arbeitsanweisung fuer alle Agents in diesem Projekt.
> Es wird automatisch geladen und definiert Prinzipien, Phasen und Rollen.
> Detaillierte Anweisungen liegen in den verlinkten Modulen unter `blueprint/`.

---

## Kernprinzipien

1. **Mensch denkt, Agent baut** — Der Mensch trifft Architektur- und Design-Entscheidungen. Agents fuehren aus, schlagen vor, aber entscheiden nicht eigenstaendig ueber Architektur, Scope oder Technologiewahl.

2. **Context ist King, weniger ist mehr** — Nie die ganze Codebase laden. Gezielt referenzieren: spezifische Dateien, Ordner, Funktionen. Neuen Thread starten wenn das Kontextfenster >70% gefuellt ist oder der Agent ungenau wird.

3. **Code ist die beste Dokumentation** — Source Code von Dependencies via `npx open-source <repo-url>` laden und direkt referenzieren. Menschgeschriebene Docs nur als Fallback.

4. **Baue klein, merge oft** — Features in Chunks zerlegen. Jeder Chunk: max 3-5 Dateien, ein frisches Kontextfenster, ein klares Done-Kriterium. Mehr als 8 Chunks = Scope reduzieren.

5. **Strukturiere nach jedem Feature** — Nach jedem Build-Zyklus Cleanup durchfuehren. Service Layers aufbauen, Duplikate eliminieren. Wird NIE uebersprungen.

6. **Automated Feedback Loops** — Agents arbeiten in Schleifen mit definierten Abbruch-Bedingungen. Kein endloses Loopen, kein manuelles Hin-und-Her.

---

## Phasen-Ueberblick

| Phase | Name | Wer | Output | Detail |
|-------|------|-----|--------|--------|
| 0 | Ideation & Scoping | Mensch + Agent Sparring | Problem-Statement, Scope | [00-ideation.md](blueprint/phases/00-ideation.md) |
| 1 | Planning | Mensch denkt, Agent plant | Plan.md mit Chunks | [01-planning.md](blueprint/phases/01-planning.md) |
| 2 | Building | Agent(s) autonom | Code + Tests | [02-building.md](blueprint/phases/02-building.md) |
| 3 | Structure Cleanup | Agent mit Cleanup-Skill | Saubere Struktur | [03-cleanup.md](blueprint/phases/03-cleanup.md) |
| 4 | Review Loop | Review-Agent + Build-Agent | PR mit Score 5/5 | [04-review-loop.md](blueprint/phases/04-review-loop.md) |
| 5 | Merge & Validate | Mensch gibt Go | Merged PR | [05-merge.md](blueprint/phases/05-merge.md) |

**Regeln:** Kein Phase-Skipping. Neuer Thread pro Phase. Gates sind binaer. Parallelisierung nur in Phase 2.

---

## Agent-Rollen

### Claude Code — "Der Ingenieur"
Zustaendig fuer: Code-Logik, Architektur, Backend, Tests, DevOps, Fixes auf Review-Feedback.
Nicht zustaendig fuer: Design-Entscheidungen, eigenes Review, Merge ohne menschliches Go.
Detail: [claude-code.md](blueprint/agents/claude-code.md)

### Antigravity — Konfigurierbares Profil
Drei Profile verfuegbar, pro Projekt eines waehlen:
- **Profil A (UI/Design):** Frontend-Komponenten, Layouts, visuelle Prototypen
- **Profil B (Review/QA):** PR-Bewertung, strukturiertes Feedback
- **Profil C (Orchestrator):** Session-Koordination, Chunk-Zuweisung
Detail: [antigravity.md](blueprint/agents/antigravity.md)

### Koordination
Multi-Agent Protokoll, Kollisions-Vermeidung, Uebergabe-Artefakte.
Detail: [coordination.md](blueprint/agents/coordination.md)

### Agent Teams (Live-Zusammenarbeit)
Echte Teammates in tmux-Split-Panes (statt Subagents/Workflow): Setup, Runbook,
Modell-Tiering, Kosten, Cleanup. Inklusive **Agent Observer** Live-Dashboard.
Detail: [agent-teams.md](blueprint/agents/agent-teams.md)

---

## Context Engineering Kurzregeln

- **Budget:** Max 30% Kontextfenster fuellen, ab 70% neuer Thread
- **Hierarchie:** Schicht 1 (immer) > Schicht 2 (Phase) > Schicht 3 (Task) > Schicht 4 (nie proaktiv)
- **Dependencies:** `npx open-source <repo>` statt Docs lesen
- **Prompt-Templates:** Siehe jeweilige Phase-Datei

---

## Feedback Loops

| Loop | Phase | Max Iterationen | Bei Abbruch |
|------|-------|----------------|-------------|
| Build-Test | 2 | 5 | Blocker melden |
| Cleanup-Verify | 3 | 3 | Rollback |
| Review-Fix | 4 | 7 | Mensch uebernimmt |

Detail: [blueprint/loops/](blueprint/loops/)

---

## Sicherheitsregeln

- Keine Packages installieren die juenger als 14 Tage sind
- Keine hartcodierten Secrets/Credentials
- Agent reviewed sich nie selbst
- Kein Merge ohne menschliches Approval

---

## Projekt-Konfiguration

Vor Nutzung: `blueprint/config.md` ausfuellen.
Bootstrapping-Anleitung: [how-to-adapt.md](blueprint/meta/how-to-adapt.md)

---

## Meta

- **Version:** 1.0
- **Changelog:** [changelog.md](blueprint/meta/changelog.md)
- **Retro-Template:** [retro-template.md](blueprint/meta/retro-template.md)
- **Entscheidungsbaeume:** [decision-trees.md](blueprint/meta/decision-trees.md)
