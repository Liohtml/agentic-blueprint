# Agentic Engineering Blueprint v1.3

> Dieses Dokument ist die zentrale Arbeitsanweisung fuer alle Agents in diesem Projekt.
> Es wird automatisch geladen und definiert Prinzipien, Phasen und Rollen.
> Detaillierte Anweisungen liegen in den verlinkten Modulen unter `blueprint/`.

---

## Kernprinzipien

1. **Mensch denkt, Agent baut** — Der Mensch trifft Architektur- und Design-Entscheidungen. Agents fuehren aus, schlagen vor, aber entscheiden nicht eigenstaendig ueber Architektur, Scope oder Technologiewahl.

2. **Context ist King, weniger ist mehr** — Nie die ganze Codebase laden. Gezielt referenzieren: spezifische Dateien, Ordner, Funktionen. Neuen Thread starten bei Phasenwechsel oder wenn der Agent ungenau wird. Harte Prozent-Schwellen sind seit 1M-Kontext + serverseitiger Compaction obsolet — Kuratierung bleibt trotzdem Pflicht: praeziser Kontext schlaegt grossen Kontext.

3. **Code ist die beste Dokumentation** — Source Code von Dependencies direkt referenzieren: zuerst ueber die nativen Agent-Tools (grep/read in `node_modules`, web_fetch der Repo-Quellen), `npx open-source <repo-url>` als Fallback. Menschgeschriebene Docs nur wenn der Code nicht reicht.

4. **Baue klein, merge oft** — Features in Chunks zerlegen. Jeder Chunk: max 3-5 Dateien, ein frisches Kontextfenster, ein klares Done-Kriterium. Mehr als 8 Chunks = Scope reduzieren. Ausnahme: **Mission-Chunks** auf Fable 5 — ein gut spezifizierter Long-Horizon-Auftrag (volle Spec im ersten Turn, binaere Definition of Done, Effort high/xhigh) ersetzt mehrere Mikro-Chunks. Siehe [02-building.md](blueprint/phases/02-building.md).

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
- **Profil B (Review/QA, Legacy):** ersetzt durch `/code-review` Skill + zweiten Claude-Agent; nur fuer Setups ohne Claude Code
- **Profil C (Orchestrator):** Session-Koordination, Chunk-Zuweisung
Detail: [antigravity.md](blueprint/agents/antigravity.md)

### Koordination
Multi-Agent Protokoll, Kollisions-Vermeidung, Uebergabe-Artefakte.
Detail: [coordination.md](blueprint/agents/coordination.md)

### Agent Teams (Live-Zusammenarbeit)
Echte Teammates in tmux-Split-Panes (statt Subagents/Workflow): Setup, Runbook,
Modell-Tiering, Kosten, Cleanup. Inklusive **Agent Observer** Live-Dashboard.
Detail: [agent-teams.md](blueprint/agents/agent-teams.md)

### Cloud Execution Profile (optional)
Phase 2–4 als Managed-Agent-Session auf Anthropic-Infrastruktur: der Phase-1-Plan
wird zur Outcome-Rubrik, ein unabhaengiger Grader bewertet jede Iteration
(strukturell erzwungenes "kein Self-Review"). Fuer Overnight-Runs und Migrationen
mit klarer Definition of Done.
Detail: [managed-agents.md](blueprint/agents/managed-agents.md)

### Modell-Tiering (seit Fable 5, 06/2026)
Vier Stufen: **Fable 5** (Lead, Mission-Chunks, kritische Migrationen) > **Opus**
(harte Logik) > **Sonnet** (Standard) > **Haiku** (Explore, Massen-Edits).
Effort als zweite Dimension: `xhigh` fuer Mission-Chunks, `high` Standard, `low`
fuer Subagents. Entscheidungsbaum: [decision-trees.md](blueprint/meta/decision-trees.md)

---

## Context Engineering Kurzregeln

- **Kuratierung:** So wenig wie moeglich, so viel wie noetig. Neuer Thread bei Phasenwechsel oder Ungenauigkeit — nicht bei einer Prozent-Schwelle
- **Hierarchie:** Schicht 1 (immer) > Schicht 2 (Phase) > Schicht 3 (Task) > Schicht 4 (nie proaktiv)
- **Dependencies:** Source direkt via grep/read/web_fetch; `npx open-source <repo>` als Fallback
- **Prompt-Templates:** Siehe jeweilige Phase-Datei

---

## Feedback Loops

| Loop | Phase | Max Iterationen | Bei Abbruch |
|------|-------|----------------|-------------|
| Build-Test | 2 | 5 | Blocker melden |
| Cleanup-Verify | 3 | 3 | Rollback |
| Review-Fix | 4 | 7 | Mensch uebernimmt |

Optional ergaenzend: **Task Budgets** (`output_config.task_budget`, Beta) als weiche
Token-Grenze pro Loop-Durchlauf — das Modell sieht den Countdown und moderiert sich
selbst. Das Iterations-Limit bleibt die harte Grenze.

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

- **Version:** 1.3
- **Changelog:** [changelog.md](blueprint/meta/changelog.md)
- **Retro-Template:** [retro-template.md](blueprint/meta/retro-template.md)
- **Entscheidungsbaeume:** [decision-trees.md](blueprint/meta/decision-trees.md)
