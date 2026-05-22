# Agentic Engineering Blueprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Erstelle ein vollstaendiges, modulares Blueprint-System das in jedes zukuenftige Projekt kopiert werden kann und definiert wie Claude Code + Antigravity Agents autonom engineeren.

**Architecture:** Hybrid-Ansatz — eine schlanke Root-Datei (AGENTIC-BLUEPRINT.md, ~200 Zeilen) mit Kernprinzipien und Verweisen auf detaillierte Module unter blueprint/. Jedes Modul ist eigenstaendig lesbar und wird nur bei Bedarf vom Agent geladen.

**Tech Stack:** Markdown-Dateien, keine Runtime-Dependencies. Harness-agnostisch mit spezifischen Sektionen fuer Claude Code und Antigravity.

**Spec:** `docs/superpowers/specs/2026-05-22-agentic-blueprint-design.md`

---

## File Map

```
Dateien die erstellt werden (alle neu):

AGENTIC-BLUEPRINT.md              ← Root-Datei, ~200 Zeilen
blueprint/config.md                ← Projekt-Variablen Template
blueprint/phases/00-ideation.md    ← Phase 0 Detail
blueprint/phases/01-planning.md    ← Phase 1 Detail
blueprint/phases/02-building.md    ← Phase 2 Detail
blueprint/phases/03-cleanup.md     ← Phase 3 Detail
blueprint/phases/04-review-loop.md ← Phase 4 Detail
blueprint/phases/05-merge.md       ← Phase 5 Detail
blueprint/agents/claude-code.md    ← Claude Code Rollendefinition
blueprint/agents/antigravity.md    ← Antigravity 3 Profile
blueprint/agents/coordination.md   ← Multi-Agent Protokoll
blueprint/loops/build-test-loop.md        ← Loop-Definition
blueprint/loops/cleanup-verify-loop.md    ← Loop-Definition
blueprint/loops/review-fix-loop.md        ← Loop-Definition
blueprint/templates/CLAUDE.md.template    ← Generierungs-Template
blueprint/templates/AGENTS.md.template    ← Generierungs-Template
blueprint/templates/PLAN.md.template      ← Plan-Vorlage
blueprint/templates/PR-TEMPLATE.md        ← PR-Vorlage
blueprint/meta/how-to-adapt.md     ← Bootstrapping-Anleitung
blueprint/meta/decision-trees.md   ← Entscheidungsbaeume
blueprint/meta/changelog.md        ← Versionshistorie
blueprint/meta/retro-template.md   ← Post-Feature Retro
.gitignore                         ← open-source/ ausschliessen
```

---

## Task 1: Verzeichnisstruktur und .gitignore

**Files:**
- Create: `blueprint/phases/` (Verzeichnis)
- Create: `blueprint/agents/` (Verzeichnis)
- Create: `blueprint/loops/` (Verzeichnis)
- Create: `blueprint/templates/` (Verzeichnis)
- Create: `blueprint/meta/` (Verzeichnis)
- Create: `.gitignore`

- [ ] **Step 1: Alle Verzeichnisse anlegen**

```bash
mkdir -p blueprint/phases blueprint/agents blueprint/loops blueprint/templates blueprint/meta
```

- [ ] **Step 2: .gitignore erstellen**

```gitignore
# Dependency source code (fetched via npx open-source)
open-source/

# OS files
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
```

- [ ] **Step 3: Verzeichnisstruktur verifizieren**

Run: `find blueprint -type d | sort`

Erwartete Ausgabe:
```
blueprint
blueprint/agents
blueprint/loops
blueprint/meta
blueprint/phases
blueprint/templates
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: add directory structure and gitignore for blueprint system"
```

---

## Task 2: AGENTIC-BLUEPRINT.md — Root-Datei

Die zentrale Datei die jeder Agent zuerst liest. Max ~200 Zeilen. Enthaelt die 6 Kernprinzipien, Phasen-Ueberblick, Rollen-Ueberblick und Links zu den Modulen.

**Files:**
- Create: `AGENTIC-BLUEPRINT.md`

- [ ] **Step 1: Root-Datei schreiben**

```markdown
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
```

- [ ] **Step 2: Zeilenanzahl pruefen**

Run: `wc -l AGENTIC-BLUEPRINT.md`

Erwartet: unter 200 Zeilen (Ziel: ~120-150)

- [ ] **Step 3: Commit**

```bash
git add AGENTIC-BLUEPRINT.md
git commit -m "feat: add root blueprint document with core principles and phase overview"
```

---

## Task 3: Projekt-Konfigurationsdatei

**Files:**
- Create: `blueprint/config.md`

- [ ] **Step 1: config.md schreiben**

```markdown
# Projekt-Konfiguration

> Fuell diese Datei aus bevor du das Blueprint nutzt.
> Der Agent liest diese Datei um projektspezifische Entscheidungen zu treffen.

## Projekt

- **Name:** <PROJEKTNAME>
- **Beschreibung:** <1-2 Saetze was das Projekt macht>
- **Tech-Stack:** <z.B. Next.js, Svelte, FastAPI, ...>
- **Repository:** <GitHub URL>

## Agents

- **Primaer-Agent:** Claude Code
- **Sekundaer-Agent:** Antigravity
- **Antigravity-Profil:** <A: UI/Design | B: Review/QA | C: Orchestrator>
- **Review-Tool:** <Greptile | Zweiter Claude Code Agent | Manuell>

## Verzeichnis-Zuweisungen

> Welcher Agent ist fuer welche Verzeichnisse zustaendig?
> Agents arbeiten nie an denselben Dateien gleichzeitig.

- **Claude Code:** <z.B. src/lib/, src/api/, src/services/, tests/>
- **Antigravity:** <z.B. src/components/, src/ui/, src/layouts/>
- **Shared (read-only in Phase 2):** <z.B. src/types/, src/contracts/>

## Konventionen

- **Branch-Prefix:** feature/
- **Branch-Format:** feature/<chunk-nr>-<agent>-<beschreibung>
- **Commit-Style:** <conventional commits | freeform>
- **Max Chunks pro Plan:** 8

## Dependencies via Open-Source

> Welche Repos sollen via npx open-source geladen werden?

- <github-url-1>
- <github-url-2>
```

- [ ] **Step 2: Commit**

```bash
git add blueprint/config.md
git commit -m "feat: add project configuration template"
```

---

## Task 4: Phase-Dokumente (phases/)

**Files:**
- Create: `blueprint/phases/00-ideation.md`
- Create: `blueprint/phases/01-planning.md`
- Create: `blueprint/phases/02-building.md`
- Create: `blueprint/phases/03-cleanup.md`
- Create: `blueprint/phases/04-review-loop.md`
- Create: `blueprint/phases/05-merge.md`

- [ ] **Step 1: 00-ideation.md schreiben**

```markdown
# Phase 0: Ideation & Scoping

## Zweck
Problem verstehen, Scope definieren, Erfolgskriterien festlegen.

## Wer
- **Mensch:** Treibt die Ideation, trifft alle Entscheidungen
- **Agent:** Sparring-Partner, prueft Machbarkeit, stellt Rueckfragen

## Eingang
- Idee, Feature-Request, Bug-Report oder Geschaeftsanforderung

## Prozess

1. **Problem formulieren:** Was genau soll geloest werden? (Nicht die Loesung, das Problem.)
2. **Scope begrenzen:** Was gehoert NICHT dazu? Explizit auflisten.
3. **Erfolgskriterien definieren:** Woran erkennt man, dass das Feature fertig ist?
4. **Machbarkeits-Check:** Agent pruefen lassen ob der Scope realistisch ist.

## Agent-Prompt fuer Sparring

```
Ich habe folgende Idee: <IDEE>

Hilf mir diese zu schaerfen:
1. Was ist das Kernproblem das geloest wird?
2. Was sollte explizit NICHT im Scope sein?
3. Welche Erfolgskriterien wuerden zeigen dass es funktioniert?
4. Siehst du technische Risiken oder Unklarheiten?

Sei kritisch. Hinterfrage Annahmen.
```

## Gate
- [ ] Problem-Statement ist klar und spezifisch
- [ ] Scope ist explizit begrenzt (was ist NICHT drin)
- [ ] Mindestens 2 messbare Erfolgskriterien definiert
- [ ] Mensch ist zufrieden mit der Schaerfe der Anforderung

## Output
Dokumentiertes Problem-Statement mit Scope und Erfolgskriterien. Kann formlos sein oder in einem Issue/Ticket.

## Weiter zu
[Phase 1: Planning](01-planning.md)
```

- [ ] **Step 2: 01-planning.md schreiben**

```markdown
# Phase 1: Planning

## Zweck
Aus dem Problem-Statement einen konkreten, chunk-basierten Implementierungsplan erstellen.

## Wer
- **Mensch:** Denkt, bewertet, kuerzt
- **Agent:** Generiert Plan, schlaegt Chunks vor

## Eingang
- Problem-Statement mit Scope und Erfolgskriterien aus Phase 0

## Prozess

1. **Plan generieren lassen:** Agent erstellt Plan mit nummerierten Chunks
2. **Chunk-Groesse pruefen:** Jeder Chunk muss in einem frischen Kontextfenster umsetzbar sein
3. **Kuerzen:** Mehr als 8 Chunks? Scope reduzieren oder Features priorisieren
4. **Abhaengigkeiten markieren:** Welche Chunks muessen sequentiell sein, welche koennen parallel laufen?
5. **Shared Contracts definieren:** Types, Interfaces, API-Contracts die in Phase 2 read-only sind

## Agent-Prompt

```
Analysiere die Anforderung: <ANFORDERUNG>

Erstelle einen Plan mit nummerierten Chunks.
Jeder Chunk muss:
- In einem frischen Kontextfenster umsetzbar sein
- Maximal 3-5 Dateien beruehren
- Ein klares "Done"-Kriterium haben
- Angeben welche Dateien erstellt/geaendert werden

Wenn der Plan mehr als 8 Chunks hat: schlage vor wie man den Scope reduziert.

Markiere Abhaengigkeiten zwischen Chunks.
Markiere welche Chunks parallelisierbar sind.
```

## Chunk-Format

```
### Chunk <NR>: <Titel>

**Dateien:** <Liste der betroffenen Dateien>
**Abhaengig von:** <Chunk-NR oder "keine">
**Parallelisierbar:** ja/nein
**Agent:** <Claude Code | Antigravity>
**Done-Kriterium:** <Was muss wahr sein damit dieser Chunk fertig ist>
```

## Gate
- [ ] Plan hat maximal 8 Chunks
- [ ] Jeder Chunk hat max 3-5 Dateien
- [ ] Jeder Chunk hat ein klares Done-Kriterium
- [ ] Abhaengigkeiten sind markiert
- [ ] Shared Contracts sind definiert
- [ ] Mensch hat den Plan reviewed und fuer gut befunden

## Output
Plan.md im Projekt-Root oder in docs/

## Weiter zu
[Phase 2: Building](02-building.md) — pro Chunk ein neuer Thread
```

- [ ] **Step 3: 02-building.md schreiben**

```markdown
# Phase 2: Building

## Zweck
Einen einzelnen Chunk aus dem Plan implementieren. Pro Chunk ein frischer Thread.

## Wer
- **Agent:** Arbeitet autonom
- **Mensch:** Greift nur ein bei Eskalation

## Eingang
- Ein Chunk aus dem Plan mit Done-Kriterium
- Gezielter Kontext (spezifische Dateien, nicht die ganze Codebase)

## Prozess

1. **Neuen Thread starten** — sauberes Kontextfenster
2. **Kontext laden:** Nur die Dateien die der Chunk benoetigt + Shared Contracts
3. **Implementieren:** Code schreiben gemaess Done-Kriterium
4. **Tests schreiben:** Mindestens ein Test pro neuer Funktion
5. **Build-Test-Loop:** Loopen bis alle Tests gruen (max 5 Iterationen)
6. **Gate pruefen:** Alle Checks erfuellt?

## Agent-Prompt

```
Implementiere Chunk <NR> aus dem Plan: <PLAN-LINK>

Referenziere: <GEZIELTER KONTEXT — spezifische Dateien/Ordner>
Done-Kriterium: <KRITERIUM>

Regeln:
- Schreibe Tests fuer die Kernlogik
- Installiere keine Packages die juenger als 14 Tage sind
- Keine hartcodierten Secrets
- Wenn du nach 5 Versuchen nicht weiterkommst: STOPP und melde den Blocker
```

## Build-Test-Loop

Siehe: [build-test-loop.md](../loops/build-test-loop.md)

Max 5 Iterationen. Bei Abbruch: Blocker dokumentieren und an Mensch eskalieren.

## Parallelisierung

Mehrere Agents koennen verschiedene Chunks gleichzeitig bauen wenn:
- Die Chunks als "parallelisierbar" markiert sind
- Sie verschiedene Dateien beruehren
- Shared Contracts sind read-only (in Phase 1 definiert)
- Jeder Agent arbeitet auf eigenem Branch: `feature/<chunk-nr>-<agent>-<beschreibung>`

## Gate
- [ ] Done-Kriterium des Chunks erfuellt
- [ ] Alle neuen Funktionen haben mindestens einen Test
- [ ] Alle Tests gruen
- [ ] Keine hartcodierten Secrets/Credentials
- [ ] Keine Packages juenger als 14 Tage installiert
- [ ] Feature funktioniert lokal

## Output
Funktionierender Code mit Tests auf Feature-Branch

## Weiter zu
[Phase 3: Structure Cleanup](03-cleanup.md)
```

- [ ] **Step 4: 03-cleanup.md schreiben**

```markdown
# Phase 3: Structure Cleanup

## Zweck
Code nach dem Build aufraumen. Duplikate eliminieren, Service Layers aufbauen, Struktur fuer den naechsten Agent-Durchlauf optimieren.

## Wer
- **Agent:** Fuehrt Cleanup autonom durch
- **Mensch:** Greift nur ein bei Eskalation

## WICHTIG
Diese Phase wird NIE uebersprungen. Auch wenn der Code "gut aussieht".

## Eingang
- Code aus Phase 2 auf Feature-Branch

## Prozess

1. **Neuen Thread starten** — sauberes Kontextfenster
2. **Analyse:** Agent scannt den geaenderten Code nach Duplikaten und fehlender Struktur
3. **Refactoring:** Wiederverwendbare Logik in Service-Layer extrahieren
4. **Cleanup-Verify-Loop:** Nach jedem Refactoring pruefen ob alle Tests noch gruen sind
5. **Gate pruefen**

## Agent-Prompt

```
Analysiere den Code der in diesem Feature-Branch geaendert wurde.

Finde:
- Duplizierte Logik ueber mehrere Dateien hinweg
- Fehlende Service-Layer-Abstraktionen
- Code der in zukuenftigen Sessions schwer zu verstehen waere
- Funktionen die an mehreren Stellen aehnlich implementiert sind

Refactore in wiederverwendbare Module.
Aendere KEINE Funktionalitaet — nur Struktur.

Nach jedem Refactoring-Schritt: pruefe ob alle Tests noch gruen sind.
Wenn ein Test bricht: Rollback des letzten Schritts.
Max 3 Iterationen.
```

## Cleanup-Verify-Loop

Siehe: [cleanup-verify-loop.md](../loops/cleanup-verify-loop.md)

Max 3 Iterationen. Bei Abbruch: Rollback, Original bleibt.

## Gate
- [ ] Keine duplizierten Logik-Bloecke ueber Dateien hinweg
- [ ] Wiederverwendbare Logik in Service-Layer extrahiert
- [ ] Alle bestehenden Tests laufen noch gruen
- [ ] Diff beruehrt maximal die Dateien aus dem Chunk-Plan
- [ ] Keine Funktionalitaetsaenderung — nur Struktur

## Output
Sauber strukturierter Code, bereit fuer Review

## Weiter zu
[Phase 4: Review Loop](04-review-loop.md)
```

- [ ] **Step 5: 04-review-loop.md schreiben**

```markdown
# Phase 4: Review Loop

## Zweck
Automatisierter Review-Zyklus bis der Code Qualitaetsstandards erfuellt.

## Wer
- **Review-Agent:** Greptile, zweiter Claude Code Agent, oder manuell (siehe config.md)
- **Build-Agent:** Fixt basierend auf Feedback
- **Mensch:** Greift ein bei Loop-Abbruch

## WICHTIG
Ein Agent reviewed sich NIE selbst. Review muss immer von einer separaten Instanz kommen.

## Eingang
- Sauber strukturierter Code aus Phase 3
- Feature-Branch bereit fuer PR

## Prozess

1. **PR erstellen** mit PR-Template (siehe templates/PR-TEMPLATE.md)
2. **Review abwarten** — automatisch oder manuell
3. **Feedback lesen und bewerten**
4. **Fixes anwenden und pushen**
5. **Neues Review abwarten**
6. **Wiederholen bis Score 5/5 oder manuelles Approval**

## Agent-Prompt (Build-Agent nach Review)

```
Lies das Review-Feedback auf PR #<NR>.

Fuer jedes Finding:
1. Analysiere ob es berechtigt ist
2. Wenn ja: fixe es und erklaere kurz was du geaendert hast
3. Wenn nein: kommentiere warum du es fuer unberechtigt haeltst

Pushe alle Fixes.
Warte auf neues Review.
Wiederhole bis Score 5/5.

Max 7 Iterationen. Danach: STOPP und eskaliere an Mensch.
```

## Review-Fix-Loop

Siehe: [review-fix-loop.md](../loops/review-fix-loop.md)

Max 7 Iterationen.

## Review-Agent Optionen

### Option A: Greptile (extern)
- Automatisches Review bei jedem Push an den PR
- Confidence-Scores 1-5
- Agent liest Feedback via GitHub API / PR-Kommentare

### Option B: Zweiter Claude Code Agent
- Starten in eigenem Thread/Worktree
- Liest den Diff des PRs
- Schreibt strukturiertes Review mit Findings und Severity
- Vorteil: kein externes Tool, volle Kontrolle

Welche Option genutzt wird steht in `blueprint/config.md`.

## Gate
- [ ] Review-Score 5/5 oder explizites menschliches Approval
- [ ] CI-Pipeline gruen
- [ ] Keine offenen Review-Kommentare unbeantwortet
- [ ] Branch ist up-to-date mit Main

## Output
PR bereit zum Merge

## Weiter zu
[Phase 5: Merge & Validate](05-merge.md)
```

- [ ] **Step 6: 05-merge.md schreiben**

```markdown
# Phase 5: Merge & Validate

## Zweck
Finaler menschlicher Check, Merge und Validierung dass nichts kaputt gegangen ist.

## Wer
- **Mensch:** Gibt finales Go und merged
- **Agent:** Pre-Merge Checks, Post-Merge Validierung

## Eingang
- PR mit Review-Score 5/5 aus Phase 4

## Prozess

1. **Mensch reviewed PR final** — letzter Blick auf den Diff
2. **Pre-Merge Checks durch Agent:**
   - CI gruen?
   - Branch up-to-date mit Main?
   - Keine Merge-Konflikte?
3. **Mensch merged** — Agent macht das NICHT eigenstaendig
4. **Post-Merge Validierung:**
   - Deployment erfolgreich? (wenn applicable)
   - Keine Regressionen in Monitoring/Logs?
   - Feature funktioniert in Staging/Production?

## Gate
- [ ] PR gemerged
- [ ] Deployment erfolgreich (wenn applicable)
- [ ] Keine Regressionen in Monitoring/Logs
- [ ] Feature funktioniert wie erwartet

## Output
Shipped Feature

## Danach
- [Retro durchfuehren](../meta/retro-template.md) (empfohlen nach jedem groesseren Feature)
- Blueprint anpassen wenn noetig (siehe [how-to-adapt.md](../meta/how-to-adapt.md))
```

- [ ] **Step 7: Commit**

```bash
git add blueprint/phases/
git commit -m "feat: add all 6 phase documents with prompts, gates, and process flows"
```

---

## Task 5: Agent-Rollendokumente (agents/)

**Files:**
- Create: `blueprint/agents/claude-code.md`
- Create: `blueprint/agents/antigravity.md`
- Create: `blueprint/agents/coordination.md`

- [ ] **Step 1: claude-code.md schreiben**

```markdown
# Agent-Rolle: Claude Code — "Der Ingenieur"

## Identitaet
Du bist der primaere Engineering-Agent. Du schreibst Code, Tests, und fixst Review-Feedback.

## Zustaendigkeiten

| Phase | Du machst | Du machst NICHT |
|-------|-----------|-----------------|
| 0 Ideation | Machbarkeit pruefen, Sparring | Entscheidungen treffen |
| 1 Planning | Plan generieren, Chunks vorschlagen | Plan final absegnen |
| 2 Building | Feature implementieren, Tests schreiben | UI/Design-Entscheidungen |
| 3 Cleanup | Service Layers, Deduplizierung | — |
| 4 Review | Fixes auf Review-Feedback | Review selbst erstellen |
| 5 Merge | Pre-Merge Checks | Merge ohne menschliches Go |

## Arbeitsregeln

1. **Ein Chunk pro Thread.** Starte fuer jeden Chunk einen frischen Thread.
2. **Gezielter Kontext.** Lade nur die Dateien die du brauchst, nie die ganze Codebase.
3. **Kontextfenster ueberwachen.** Ab 70% Fuellstand: neuer Thread.
4. **Tests schreiben.** Jede neue Funktion hat mindestens einen Test.
5. **Keine alten Packages.** Installiere nichts das juenger als 14 Tage ist.
6. **Keine Secrets.** Keine hartcodierten Credentials, API-Keys, Tokens.
7. **Loops respektieren.** Halte dich an die definierten Max-Iterationen.
8. **Eskalieren statt endlos loopen.** Nach Max-Iterationen: STOPP, Blocker dokumentieren.
9. **Nicht selbst reviewen.** Dein Code wird von einem separaten Agent oder Mensch reviewed.
10. **Nicht eigenstaendig mergen.** Merge braucht immer menschliches Approval.

## Verzeichnis-Zustaendigkeit

Siehe `blueprint/config.md` fuer projektspezifische Zuweisungen.
Arbeite NUR in deinen zugewiesenen Verzeichnissen.
Shared-Verzeichnisse sind in Phase 2 read-only.

## Dependency-Referenzierung

Wenn du eine Library/Framework nutzen musst:
1. Pruefe ob der Code unter `open-source/repos/` verfuegbar ist
2. Wenn ja: referenziere die tatsaechliche Implementation
3. Wenn nein: schlage vor `npx open-source <repo-url>` auszufuehren
4. Nutze IMMER den tatsaechlichen Source Code, nicht dein Training
```

- [ ] **Step 2: antigravity.md schreiben**

```markdown
# Agent-Rolle: Antigravity — Konfigurierbares Profil

## Identitaet
Du bist der sekundaere Agent. Deine genaue Rolle haengt vom gewaehlten Profil ab.
Pruefe `blueprint/config.md` fuer das aktive Profil.

---

## Profil A: UI/Design-Agent

### Zustaendigkeiten
- Frontend-Komponenten generieren
- Layouts und visuelle Prototypen erstellen
- UI gegen die von Claude Code gelieferten API-Contracts bauen

### Arbeitsweise
- Du arbeitest parallel zu Claude Code an UI-Chunks
- Du liest die Shared Contracts (Types, API-Interfaces) aber aenderst sie nicht
- Du arbeitest nur in deinen zugewiesenen Verzeichnissen (siehe config.md)
- Branch-Format: `feature/<chunk-nr>-antigravity-<beschreibung>`

### Uebergabe-Protokoll
1. Claude Code definiert API-Contract und Shared Types in Phase 1
2. Du baust UI-Komponenten gegen diese Contracts
3. Bei Unklarheiten: Frage an den Mensch eskalieren, nicht selbst aendern

---

## Profil B: Review/QA-Agent

### Zustaendigkeiten
- PRs bewerten und strukturiertes Feedback geben
- Code-Qualitaet, Sicherheit, Performance pruefen
- Confidence-Score vergeben (1-5)

### Review-Format
```
## Review fuer PR #<NR>

### Confidence-Score: <1-5>/5

### Findings

#### Finding 1: <Titel>
- **Severity:** <critical | major | minor | suggestion>
- **Datei:** <Pfad:Zeile>
- **Problem:** <Was ist falsch>
- **Vorschlag:** <Wie es gefixt werden sollte>

### Zusammenfassung
<1-2 Saetze Gesamtbewertung>
```

### Arbeitsweise
- Du bekommst einen PR-Diff zur Analyse
- Du schreibst dein Review als Kommentar
- Du wartest bis der Build-Agent Fixes gepusht hat
- Du reviewst erneut bis Score 5/5

---

## Profil C: Orchestrator

### Zustaendigkeiten
- Mehrere Claude Code Sessions koordinieren
- Chunks zuweisen und Fortschritt ueberwachen
- Bei Blockern eingreifen oder an Mensch eskalieren

### Arbeitsweise
- Du liest den Plan und weist Chunks an verfuegbare Agents zu
- Du ueberwachst ob Agents in Loops feststecken
- Du stellst sicher dass keine Kollisionen (gleiche Dateien) auftreten
- Du eskalierst an den Mensch wenn ein Agent nach Max-Iterationen nicht weiterkommt

### Status-Format
```
## Agent-Status

| Agent | Chunk | Status | Iterationen | Blocker |
|-------|-------|--------|-------------|---------|
| Claude Code #1 | Chunk 3 | building | 2/5 | — |
| Claude Code #2 | Chunk 4 | blocked | 5/5 | Test X schlaegt fehl |
```
```

- [ ] **Step 3: coordination.md schreiben**

```markdown
# Multi-Agent Koordinationsprotokoll

## Grundregel
Der Mensch ist der Dirigent. Agents arbeiten autonom innerhalb ihrer Chunks, aber der Mensch weist Arbeit zu und trifft Entscheidungen bei Konflikten.

## Kollisions-Vermeidung

### Verzeichnis-Grenzen
Jeder Agent hat zugewiesene Verzeichnisse (definiert in config.md).
Ein Agent arbeitet NIE in den Verzeichnissen eines anderen Agents.

### Shared Contracts
- Shared Types und API-Interfaces werden in Phase 1 definiert
- Waehrend Phase 2 sind sie READ-ONLY
- Aenderungen an Shared Contracts erfordern: STOPP aller Agents, Mensch entscheidet, Neustart der betroffenen Chunks

### Branch-Konventionen
- Format: `feature/<chunk-nr>-<agent>-<beschreibung>`
- Beispiele:
  - `feature/01-claude-code-api-endpoints`
  - `feature/02-antigravity-dashboard-ui`
  - `feature/03-claude-code-auth-logic`

### File-Locking (implizit)
Kein technisches Locking, aber:
- Der Plan definiert welcher Agent welche Dateien beruehrt
- Wenn zwei Chunks dieselbe Datei brauchen: sie sind NICHT parallelisierbar
- Der Plan muss das in Phase 1 explizit markieren

## Uebergabe-Artefakte

Wenn ein Agent Output produziert den ein anderer Agent braucht:

1. **API-Contracts:** JSON-Schema oder TypeScript-Interface
2. **Shared Types:** TypeScript Types/Interfaces in shared Verzeichnis
3. **Status-Updates:** Agent meldet "Chunk X fertig" an den Mensch
4. **Blocker:** Agent meldet "Chunk X blockiert wegen Y" an den Mensch

## Eskalations-Kette

```
Agent hat Blocker
    |
    v
Agent dokumentiert Blocker (was, warum, was versucht)
    |
    v
Agent STOPPT
    |
    v
Mensch entscheidet:
    ├── Scope reduzieren
    ├── Ansatz aendern
    ├── Manuell fixen
    └── Anderen Agent beauftragen
```

## Reihenfolge bei Konflikten

1. Shared Contract muss geaendert werden? → Alle Agents stoppen, Mensch entscheidet
2. Zwei Agents brauchen dieselbe Datei? → Chunks sind sequentiell, nicht parallel
3. Agent kommt nicht weiter? → Eskalation, nicht endlos loopen
4. Widerspruch zwischen Agents? → Mensch entscheidet, nicht der "staerkere" Agent
```

- [ ] **Step 4: Commit**

```bash
git add blueprint/agents/
git commit -m "feat: add agent role definitions for Claude Code, Antigravity, and coordination"
```

---

## Task 6: Loop-Dokumente (loops/)

**Files:**
- Create: `blueprint/loops/build-test-loop.md`
- Create: `blueprint/loops/cleanup-verify-loop.md`
- Create: `blueprint/loops/review-fix-loop.md`

- [ ] **Step 1: build-test-loop.md schreiben**

```markdown
# Build-Test-Loop

## Phase
Phase 2: Building

## Trigger
Code fuer einen Chunk wurde geschrieben.

## Ablauf

```
Iteration = 0

LOOP:
  1. Code ausfuehren / builden
  2. Tests ausfuehren
  3. Alle Tests gruen?
     - JA → EXIT LOOP (Erfolg)
     - NEIN → Iteration += 1
  4. Iteration > 5?
     - JA → EXIT LOOP (Abbruch)
     - NEIN → Fehler analysieren, Fix anwenden → GOTO LOOP
```

## Max Iterationen
5

## Bei Erfolg
Weiter zu Phase 3 (Structure Cleanup)

## Bei Abbruch
1. Dokumentiere:
   - Welche Tests fehlschlagen
   - Welche Fehler auftreten
   - Was bereits versucht wurde (alle 5 Ansaetze)
2. Erstelle einen Kommentar/Issue mit diesem Kontext
3. STOPP — kein weiteres Herumprobieren
4. Warte auf Mensch-Entscheidung

## Haeufige Ursachen fuer Abbruch
- Falscher Ansatz gewaehlt (Architektur-Problem, nicht Code-Problem)
- Fehlende Dependency oder API-Verstaendnis
- Chunk zu gross / beruehrt zu viele Dateien
- Kontext nicht praezise genug
```

- [ ] **Step 2: cleanup-verify-loop.md schreiben**

```markdown
# Cleanup-Verify-Loop

## Phase
Phase 3: Structure Cleanup

## Trigger
Refactoring wurde auf den Code angewendet.

## Ablauf

```
Iteration = 0

LOOP:
  1. Refactoring-Schritt anwenden
  2. Alle Tests ausfuehren
  3. Alle Tests gruen UND Funktionalitaet unveraendert?
     - JA → Weitere Duplikate/Strukturprobleme?
       - JA → Iteration += 1, naechster Refactoring-Schritt → GOTO LOOP
       - NEIN → EXIT LOOP (Erfolg)
     - NEIN → Rollback des letzten Schritts, Iteration += 1
  4. Iteration > 3?
     - JA → EXIT LOOP (Abbruch)
     - NEIN → GOTO LOOP
```

## Max Iterationen
3

## Bei Erfolg
Weiter zu Phase 4 (Review Loop)

## Bei Abbruch
1. Rollback ALLER Refactoring-Schritte die Tests gebrochen haben
2. Original-Code aus Phase 2 bleibt bestehen
3. Dokumentiere welche Refactorings fehlgeschlagen sind und warum
4. Weiter zu Phase 4 mit dem Original-Code (Cleanup ist nice-to-have, nicht blocker)

## Wichtig
- KEINE Funktionalitaetsaenderungen — nur Struktur
- Jeder Refactoring-Schritt wird einzeln verifiziert
- Bei Rollback: sauber zurueck, nicht "fixen" auf dem Fix
```

- [ ] **Step 3: review-fix-loop.md schreiben**

```markdown
# Review-Fix-Loop

## Phase
Phase 4: Review Loop

## Trigger
PR wurde erstellt und Review-Feedback liegt vor.

## Ablauf

```
Iteration = 0

LOOP:
  1. Review-Feedback lesen
  2. Fuer jedes Finding:
     a. Berechtigt? → Fix anwenden
     b. Unberechtigt? → Kommentar schreiben warum
  3. Fixes pushen
  4. Neues Review abwarten
  5. Score >= 5/5 oder manuelles Approval?
     - JA → EXIT LOOP (Erfolg)
     - NEIN → Iteration += 1
  6. Iteration > 7?
     - JA → EXIT LOOP (Abbruch)
     - NEIN → GOTO LOOP
```

## Max Iterationen
7

## Bei Erfolg
Weiter zu Phase 5 (Merge & Validate)

## Bei Abbruch
1. Dokumentiere:
   - Aktuelle Review-Findings die nicht geloest werden konnten
   - Was bei jedem Versuch geaendert wurde
   - Vermutete Ursache warum der Score nicht steigt
2. Eskaliere an Mensch
3. STOPP — Mensch uebernimmt manuelles Review und entscheidet

## Haeufige Ursachen fuer Abbruch
- PR zu gross (>500 Zeilen Diff) — schwer fuer Reviewer
- Architektur-Feedback das groessere Umbauten erfordert
- Sich widersprechende Findings zwischen Iterationen
- Review-Agent hat andere Konventionen als das Projekt
```

- [ ] **Step 4: Commit**

```bash
git add blueprint/loops/
git commit -m "feat: add feedback loop definitions with iteration limits and abort protocols"
```

---

## Task 7: Templates (templates/)

**Files:**
- Create: `blueprint/templates/CLAUDE.md.template`
- Create: `blueprint/templates/AGENTS.md.template`
- Create: `blueprint/templates/PLAN.md.template`
- Create: `blueprint/templates/PR-TEMPLATE.md`

- [ ] **Step 1: CLAUDE.md.template schreiben**

```markdown
# {{PROJEKTNAME}}

## Projekt
{{BESCHREIBUNG}}

## Tech-Stack
{{TECH_STACK}}

## Blueprint
Dieses Projekt nutzt das Agentic Engineering Blueprint.
Lies zuerst: [AGENTIC-BLUEPRINT.md](AGENTIC-BLUEPRINT.md)

## Aktuelle Phase
> Aktualisiere diesen Block wenn du die Phase wechselst.

Aktive Phase: **Phase {{PHASE_NR}}: {{PHASE_NAME}}**
Aktiver Chunk: **Chunk {{CHUNK_NR}}**
Plan: [Plan.md]({{PLAN_PFAD}})

## Context-Regeln
- Lade NUR die Dateien die der aktuelle Chunk benoetigt
- Max 30% des Kontextfensters mit Kontext fuellen
- Ab 70% Fuellstand: neuer Thread
- Dependencies referenzieren unter `open-source/repos/` wenn verfuegbar

## Sicherheit
- Keine Packages installieren die juenger als 14 Tage sind
- Keine hartcodierten Secrets/Credentials
- Kein Merge ohne menschliches Approval

## Dependency Source Code
{{#DEPENDENCIES}}
- `open-source/repos/github.com/{{ORG}}/{{REPO}}/` — {{ZWECK}}
{{/DEPENDENCIES}}
```

- [ ] **Step 2: AGENTS.md.template schreiben**

```markdown
# Agent-Konfiguration: {{AGENT_NAME}}

## Rolle
{{ROLLE}} — siehe [{{AGENT_DATEI}}](blueprint/agents/{{AGENT_DATEI}})

## Zugewiesene Verzeichnisse
{{#VERZEICHNISSE}}
- `{{PFAD}}/`
{{/VERZEICHNISSE}}

## Shared Verzeichnisse (read-only in Phase 2)
{{#SHARED}}
- `{{PFAD}}/`
{{/SHARED}}

## Aktive Phase
> Wird pro Phase aktualisiert.

Phase: **{{PHASE_NR}}**
Lies: [{{PHASE_DATEI}}](blueprint/phases/{{PHASE_DATEI}})

## Arbeitsregeln
1. Arbeite NUR in deinen zugewiesenen Verzeichnissen
2. Shared Verzeichnisse sind in Phase 2 read-only
3. Ein Chunk pro Thread, frisches Kontextfenster
4. Halte dich an die Loop-Limits
5. Eskaliere statt endlos zu loopen
6. Reviewe dich nie selbst
7. Merge nie ohne menschliches Go

## Branch-Format
`feature/{{CHUNK_NR}}-{{AGENT_KUERZEL}}-{{BESCHREIBUNG}}`
```

- [ ] **Step 3: PLAN.md.template schreiben**

```markdown
# Feature-Plan: {{FEATURE_NAME}}

**Erstellt:** {{DATUM}}
**Status:** {{draft | approved | in_progress | completed}}
**Anforderung:** {{LINK_ZU_PHASE_0_OUTPUT}}

---

## Scope
{{SCOPE_BESCHREIBUNG}}

## Erfolgskriterien
{{#KRITERIEN}}
- {{KRITERIUM}}
{{/KRITERIEN}}

## Shared Contracts
> Types und Interfaces die vor dem Building definiert werden und waehrend Phase 2 read-only sind.

{{CONTRACTS_LISTE}}

---

## Chunks

### Chunk 1: {{TITEL}}
**Dateien:** {{DATEILISTE}}
**Agent:** {{AGENT}}
**Abhaengig von:** {{ABHAENGIGKEIT}}
**Parallelisierbar:** {{JA_NEIN}}
**Done-Kriterium:** {{KRITERIUM}}

### Chunk 2: {{TITEL}}
**Dateien:** {{DATEILISTE}}
**Agent:** {{AGENT}}
**Abhaengig von:** {{ABHAENGIGKEIT}}
**Parallelisierbar:** {{JA_NEIN}}
**Done-Kriterium:** {{KRITERIUM}}

<!-- Weitere Chunks nach Bedarf. Max 8. -->

---

## Abhaengigkeits-Graph

```
Chunk 1 ──► Chunk 3
Chunk 2 ──► Chunk 3  (parallel mit Chunk 1)
Chunk 3 ──► Chunk 4
```
```

- [ ] **Step 4: PR-TEMPLATE.md schreiben**

```markdown
## Was wurde gebaut

**Chunk:** #{{CHUNK_NR}} — {{CHUNK_TITEL}}
**Plan:** {{PLAN_LINK}}
**Agent:** {{AGENT_NAME}}

## Aenderungen

{{ZUSAMMENFASSUNG_DER_AENDERUNGEN}}

## Tests

- {{TEST_1}}
- {{TEST_2}}

## Gate-Checkliste

- [ ] Done-Kriterium des Chunks erfuellt
- [ ] Alle neuen Funktionen haben mindestens einen Test
- [ ] Alle Tests gruen
- [ ] Keine hartcodierten Secrets/Credentials
- [ ] Keine Packages juenger als 14 Tage
- [ ] Keine duplizierten Logik-Bloecke (Phase 3 durchlaufen)
- [ ] Code-Struktur clean (Phase 3 durchlaufen)

## Review-Status

| Iteration | Score | Offene Findings |
|-----------|-------|-----------------|
| 1 | —/5 | — |
```

- [ ] **Step 5: Commit**

```bash
git add blueprint/templates/
git commit -m "feat: add CLAUDE.md, AGENTS.md, PLAN.md, and PR templates"
```

---

## Task 8: Meta-Dokumente (meta/)

**Files:**
- Create: `blueprint/meta/how-to-adapt.md`
- Create: `blueprint/meta/decision-trees.md`
- Create: `blueprint/meta/changelog.md`
- Create: `blueprint/meta/retro-template.md`

- [ ] **Step 1: how-to-adapt.md schreiben**

```markdown
# Blueprint fuer ein neues Projekt einrichten

## Schritt 1: Blueprint kopieren

Kopiere den gesamten `blueprint/` Ordner und `AGENTIC-BLUEPRINT.md` in dein neues Projekt-Root.

```bash
cp -r /pfad/zum/blueprint-repo/blueprint/ ./blueprint/
cp /pfad/zum/blueprint-repo/AGENTIC-BLUEPRINT.md ./
```

## Schritt 2: config.md ausfuellen

Oeffne `blueprint/config.md` und fuell alle Felder aus:

1. **Projektname und Beschreibung** — was baust du?
2. **Tech-Stack** — welche Sprachen, Frameworks, Datenbanken?
3. **Agents** — welche Agents nutzt du? Welches Antigravity-Profil?
4. **Review-Tool** — Greptile, zweiter Agent, oder manuell?
5. **Verzeichnis-Zuweisungen** — welcher Agent arbeitet wo?
6. **Dependencies** — welche Repos sollen via open-source geladen werden?

## Schritt 3: CLAUDE.md und AGENTS.md generieren

Gib dem Agent folgendes Prompt:

```
Lies blueprint/config.md und blueprint/templates/CLAUDE.md.template.
Generiere eine projektspezifische CLAUDE.md basierend auf der Konfiguration.
Ersetze alle {{PLATZHALTER}} mit den Werten aus config.md.

Mach dasselbe fuer AGENTS.md mit blueprint/templates/AGENTS.md.template.
```

Review die generierten Dateien und committe sie.

## Schritt 4: Dependencies laden (optional)

Fuer jede Dependency die in config.md gelistet ist:

```bash
npx open-source <github-url>
```

Stelle sicher dass `open-source/` in `.gitignore` steht.

## Schritt 5: Los gehts

Starte mit Phase 0 (Ideation) gemaess dem Blueprint.

## Anpassungen

### Loop-Limits aendern
Editiere die Dateien unter `blueprint/loops/`. Passe `Max Iterationen` an.

### Neue Phase hinzufuegen
1. Erstelle `blueprint/phases/XX-name.md` nach dem Muster der existierenden Phasen
2. Fuege die Phase in die Tabelle in `AGENTIC-BLUEPRINT.md` ein
3. Aktualisiere `blueprint/meta/changelog.md`

### Neuen Agent hinzufuegen
1. Erstelle `blueprint/agents/neuer-agent.md` nach dem Muster der existierenden Agents
2. Fuege den Agent in `AGENTIC-BLUEPRINT.md` ein
3. Definiere Verzeichnis-Zustaendigkeiten in `blueprint/config.md`
4. Aktualisiere das Koordinationsprotokoll in `blueprint/agents/coordination.md`

### Prompt-Templates verfeinern
Die Prompt-Templates stehen in den jeweiligen Phase-Dateien. Passe sie nach Erfahrung an — besonders nach Retros.
```

- [ ] **Step 2: decision-trees.md schreiben**

```markdown
# Entscheidungsbaeume

## Wann welchen Agent einsetzen?

```
Aufgabe erhalten
    |
    v
Ist es eine UI/Design-Aufgabe?
    |
    ├── JA: Ist Antigravity auf Profil A (UI/Design)?
    |       ├── JA → Antigravity
    |       └── NEIN → Claude Code (oder Antigravity-Profil wechseln)
    |
    └── NEIN: Ist es Code/Logik/Backend/Tests?
            └── JA → Claude Code
```

## Wann einen neuen Thread starten?

```
Aktueller Thread
    |
    v
Kontextfenster > 70% gefuellt?
    ├── JA → Neuer Thread
    |
    └── NEIN: Agent wird ungenau / halluziniert?
            ├── JA → Neuer Thread
            |
            └── NEIN: Neue Phase beginnt?
                    ├── JA → Neuer Thread
                    └── NEIN → Weiter im aktuellen Thread
```

## Wann eskalieren?

```
Agent arbeitet an einem Problem
    |
    v
Loop-Limit erreicht?
    ├── JA → STOPP, Eskalation an Mensch
    |
    └── NEIN: Agent dreht sich im Kreis (gleicher Fehler wiederholt)?
            ├── JA → STOPP, Eskalation an Mensch
            |
            └── NEIN: Agent will Shared Contracts aendern?
                    ├── JA → STOPP, Eskalation an Mensch
                    └── NEIN → Agent arbeitet weiter
```

## Wann Chunks parallelisieren?

```
Plan reviewed
    |
    v
Chunk A und Chunk B beruehren verschiedene Dateien?
    ├── JA: Beide haben keine Abhaengigkeit zueinander?
    |       ├── JA → Parallel ausfuehren
    |       └── NEIN → Sequentiell (abhaengiger Chunk wartet)
    |
    └── NEIN → Sequentiell (gleiche Dateien = Kollisionsgefahr)
```

## Welches Review-Tool waehlen?

```
Projekt-Setup
    |
    v
Externes Review-Tool verfuegbar (Greptile)?
    ├── JA: Budget/Zugang vorhanden?
    |       ├── JA → Greptile nutzen
    |       └── NEIN → Zweiter Claude Code Agent
    |
    └── NEIN: Mehrere Agent-Sessions moeglich?
            ├── JA → Zweiter Claude Code Agent
            └── NEIN → Manuelles Review durch Mensch
```
```

- [ ] **Step 3: changelog.md schreiben**

```markdown
# Blueprint Changelog

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
```

- [ ] **Step 4: retro-template.md schreiben**

```markdown
# Post-Feature Retro

> Fuehre diese Retro nach jedem groesseren Feature oder Sprint durch.
> Ziel: Blueprint kontinuierlich verbessern.

**Feature:** <Name>
**Datum:** <YYYY-MM-DD>
**Beteiligte Agents:** <Claude Code, Antigravity, ...>
**Dauer:** <Wie lange hat das Feature gedauert>

---

## Was lief gut?

- <Was hat auf Anhieb funktioniert?>
- <Welche Prompts waren effektiv?>
- <Wo war die Chunk-Groesse genau richtig?>

## Was lief schlecht?

- <Wo hat der Agent geloopt ohne Fortschritt?>
- <Wo war der Kontext zu viel oder zu wenig?>
- <Welche Phase hat unerwartet lange gedauert?>
- <Gab es Kollisionen zwischen Agents?>

## Ueberraschungen

- <Was war unerwartet — positiv oder negativ?>
- <Welche Annahmen waren falsch?>

## Zahlen

| Metrik | Wert |
|--------|------|
| Chunks geplant | |
| Chunks ausgefuehrt | |
| Build-Test-Loop Durchschnitt (Iterationen) | |
| Cleanup-Verify-Loop Durchschnitt | |
| Review-Fix-Loop Durchschnitt | |
| Eskalationen an Mensch | |
| Finale Review-Scores | |

## Blueprint-Anpassungen

> Was sollte am Blueprint geaendert werden basierend auf dieser Erfahrung?

- [ ] Prompt-Templates anpassen: <welche, warum>
- [ ] Loop-Limits anpassen: <welcher Loop, neues Limit, warum>
- [ ] Gate-Checklisten anpassen: <welches Gate, was hinzufuegen/entfernen>
- [ ] Agent-Rollen schaerfen: <welcher Agent, was aendern>
- [ ] Neue Phase/Loop noetig? <beschreiben>

## Fazit

<1-2 Saetze: Was ist die wichtigste Erkenntnis?>
```

- [ ] **Step 5: Commit**

```bash
git add blueprint/meta/
git commit -m "feat: add meta documents — bootstrapping guide, decision trees, changelog, retro template"
```

---

## Task 9: Finaler Review und Root-Commit

**Files:**
- Verify: Alle erstellten Dateien
- Verify: Links in AGENTIC-BLUEPRINT.md

- [ ] **Step 1: Dateistruktur verifizieren**

Run: `find . -name "*.md" -not -path "./open-source/*" -not -path "./node_modules/*" | sort`

Erwartete Ausgabe:
```
./AGENTIC-BLUEPRINT.md
./GitHubRepos.md
./Transcript.md
./blueprint/agents/antigravity.md
./blueprint/agents/claude-code.md
./blueprint/agents/coordination.md
./blueprint/config.md
./blueprint/loops/build-test-loop.md
./blueprint/loops/cleanup-verify-loop.md
./blueprint/loops/review-fix-loop.md
./blueprint/meta/changelog.md
./blueprint/meta/decision-trees.md
./blueprint/meta/how-to-adapt.md
./blueprint/meta/retro-template.md
./blueprint/phases/00-ideation.md
./blueprint/phases/01-planning.md
./blueprint/phases/02-building.md
./blueprint/phases/03-cleanup.md
./blueprint/phases/04-review-loop.md
./blueprint/phases/05-merge.md
./blueprint/templates/AGENTS.md.template
./blueprint/templates/CLAUDE.md.template
./blueprint/templates/PLAN.md.template
./blueprint/templates/PR-TEMPLATE.md
./docs/superpowers/plans/2026-05-22-agentic-blueprint.md
./docs/superpowers/specs/2026-05-22-agentic-blueprint-design.md
```

- [ ] **Step 2: Links in AGENTIC-BLUEPRINT.md pruefen**

Alle relativen Links in der Root-Datei muessen auf existierende Dateien zeigen. Pruefe manuell oder per Script:

```bash
grep -oP '\[.*?\]\(\K[^)]+' AGENTIC-BLUEPRINT.md | while read link; do
  if [ ! -f "$link" ] && [ ! -d "$link" ]; then
    echo "BROKEN: $link"
  fi
done
```

Erwartete Ausgabe: keine BROKEN links.

- [ ] **Step 3: Finaler Commit**

```bash
git add -A
git commit -m "feat: complete agentic engineering blueprint v1.0

Includes:
- Root document with 6 core principles
- 6-phase development model with gates
- Agent roles (Claude Code + Antigravity 3 profiles)
- Multi-agent coordination protocol
- Context engineering rules and hierarchy
- 3 feedback loops with abort conditions
- Templates for CLAUDE.md, AGENTS.md, PLAN.md, PR
- Meta system: bootstrapping, decision trees, retro template"
```

---

## Spec Coverage Check

| Spec Section | Covered by Task |
|-------------|-----------------|
| 1. Zweck | Task 2 (Root-Datei) |
| 2. Zielgruppe | Task 2 (Root-Datei) |
| 3. Architektur | Task 1 (Struktur) + Task 2 (Root) |
| 4. Kernprinzipien | Task 2 (Root-Datei, 6 Prinzipien) |
| 5. Phasen-Modell | Task 4 (alle 6 Phasen) |
| 6. Agent-Rollen | Task 5 (claude-code, antigravity, coordination) |
| 7. Context Engineering | Task 2 (Kurzregeln) + Task 4 (Prompts in Phasen) |
| 8. Feedback Loops | Task 6 (3 Loop-Dokumente) |
| 8.3 Qualitaets-Gates | Task 4 (Gates in jeder Phase) |
| 8.4 Review-Agent Optionen | Task 4 (04-review-loop.md) + Task 5 (antigravity Profil B) |
| 9. Meta-Ebene | Task 3 (config) + Task 7 (Templates) + Task 8 (Meta-Docs) |
| 10. Dateistruktur | Task 1 + Task 9 (Verifikation) |
| 11. Quellen | Task 2 (Root-Datei verweist auf Spec) |
