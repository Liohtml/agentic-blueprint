# Agentic Engineering Blueprint — Design Spec

**Version:** 1.0
**Datum:** 2026-05-22
**Status:** Draft
**Scope:** Wiederverwendbares Blueprint-System fuer autonome Agent-Workflows

---

## 1. Zweck

Ein harness-uebergreifendes, modulares Blueprint-Dokument, das in jedes zukuenftige Projekt kopiert werden kann. Es definiert wie Agents (Claude Code + Antigravity) autonom engineeren, in Loops arbeiten, sich koordinieren und Qualitaet sicherstellen.

**Kein konkretes Produkt** — ein Meta-System fuer den Entwicklungsprozess selbst.

---

## 2. Zielgruppe

Der Mensch (Projektleiter/Entwickler), der Agents orchestriert. Plus die Agents selbst, die das Blueprint als Arbeitsanweisung lesen.

---

## 3. Architektur-Entscheidung

**Ansatz: Hybrid — Lean Root + modulare Tiefe**

Eine schlanke Root-Datei (`AGENTIC-BLUEPRINT.md`, max ~200 Zeilen) mit Kernprinzipien und Verweisen. Detaillierte Module werden nur bei Bedarf vom Agent geladen. Folgt dem Kernprinzip: *"Keep context minimal, reference only what you need."*

---

## 4. Kernprinzipien

Sechs Prinzipien die in der Root-Datei stehen und fuer jeden Agent, jede Phase, jedes Projekt gelten:

### 4.1 Mensch denkt, Agent baut
Der Mensch trifft Architektur- und Design-Entscheidungen. Agents sind hochbegabte Juniors mit fotografischem Gedaechtnis, die Anleitung brauchen. Kein Vibe Coding.

### 4.2 Context ist King, weniger ist mehr
Je praeziser und minimaler der Kontext, desto besser das Ergebnis. Nie die ganze Codebase laden. Gezielt referenzieren. Neuen Thread starten bevor das Kontextfenster >70% voll ist.

### 4.3 Code ist die beste Dokumentation
Source Code von Dependencies direkt einbinden (open-source-Ansatz). Menschgeschriebene Docs sind zweitrangig. Der Agent arbeitet gegen den echten Code, nicht gegen Prosa.

### 4.4 Baue klein, merge oft
Features in minimale PRs zerlegen. Ein Plan wird generiert, dann in Chunks aufgeteilt, die der Agent in einem Kontextfenster bewaeltigen kann.

### 4.5 Strukturiere nach jedem Feature
Nach jedem Build-Zyklus: Code Cleanup. Service Layers, Duplikate eliminieren, damit der naechste Agent-Durchlauf sauberen Code vorfindet.

### 4.6 Automated Feedback Loops
Agents arbeiten in Schleifen: Build > Test > Review > Fix > Review > bis Qualitaetsschwelle erreicht. Kein manuelles Hin-und-Her.

---

## 5. Phasen-Modell

Sechs Phasen mit klarem Eingang, Ausgang und Gate:

### Phase 0: Ideation & Scoping
- **Wer:** Mensch (+ Agent als Sparring-Partner)
- **Output:** Problem-Statement, Scope, Erfolgskriterien
- **Gate:** Mensch hat klare Anforderung formuliert

### Phase 1: Planning
- **Wer:** Mensch denkt, Agent generiert Plan
- **Output:** Plan.md mit nummerierten Chunks
- **Gate:** Mensch reviewed Plan, kuerzt auf minimale Chunks
- **Regeln:**
  - Jeder Chunk muss in einem frischen Kontextfenster umsetzbar sein
  - Max 3-5 Dateien pro Chunk
  - Klares Done-Kriterium pro Chunk
  - Mehr als 8 Chunks = Scope reduzieren

### Phase 2: Building
- **Wer:** Agent(s) autonom, pro Chunk ein Thread
- **Input:** Ein Chunk aus dem Plan + gezielter Kontext
- **Output:** Funktionierender Code, lokale Tests passing
- **Gate:** Feature funktioniert lokal
- **Loop:** Build-Test-Loop (max 5 Iterationen)
- **Parallelisierung:** Mehrere Agents koennen verschiedene Chunks gleichzeitig bauen, nie denselben Chunk

### Phase 3: Structure Cleanup
- **Wer:** Agent mit Cleanup-Skill
- **Input:** Neuer Code aus Phase 2
- **Output:** Dedupliziert, Service Layers, saubere Struktur
- **Gate:** Keine duplizierten Mechaniken, Code lesbar, alle Tests gruen
- **Loop:** Cleanup-Verify-Loop (max 3 Iterationen)
- **Regel:** Wird NIE uebersprungen

### Phase 4: Review Loop
- **Wer:** Review-Agent (Greptile/Code-Reviewer) + Build-Agent
- **Loop:** PR erstellen > Review > Fix > Re-Review (max 7 Iterationen)
- **Gate:** Review-Score 5/5 oder manuelles Approval
- **Regel:** Agent reviewed sich nie selbst

### Phase 5: Merge & Validate
- **Wer:** Mensch gibt finales Go
- **Output:** Merged PR, deployed Feature
- **Gate:** CI gruen, Mensch bestaetigt, keine Regressionen

### Phasen-Regeln
- Kein Phase-Skipping — Phase 3 wird nie uebersprungen
- Neuer Thread pro Phase — Kontextfenster frisch halten
- Gates sind binaer — erfuellt oder Agent loopt weiter
- Parallelisierung nur in Phase 2

---

## 6. Agent-Rollen

### 6.1 Claude Code — "Der Ingenieur"

Zustaendigkeit: Code-Logik, Architektur, Backend, Tests, DevOps.

| Phase | Macht | Macht NICHT |
|-------|-------|-------------|
| 0 Ideation | Sparring, Machbarkeit pruefen | Entscheidungen treffen |
| 1 Planning | Plan generieren, Chunks vorschlagen | Plan final absegnen |
| 2 Building | Feature implementieren, Tests schreiben | UI/Design-Entscheidungen |
| 3 Cleanup | Service Layers, Deduplizierung | — |
| 4 Review | Fixes auf Review-Feedback | Review selbst erstellen |
| 5 Merge | Pre-Merge Checks, CI | Merge ohne menschliches Go |

### 6.2 Antigravity — Drei Rollenprofile

Das Blueprint legt drei Profile als Templates an. Pro Projekt wird das passende gewaehlt:

**Profil A — UI/Design-Agent:**
- Generiert Frontend-Komponenten, Layouts, visuelle Prototypen
- Arbeitet parallel zu Claude Code an UI-Chunks
- Uebergabe: Claude Code liefert API/Datenstruktur, Antigravity baut UI dagegen

**Profil B — Review/QA-Agent:**
- Uebernimmt Review-Rolle in Phase 4
- Bewertet PRs, gibt strukturiertes Feedback
- Claude Code fixt basierend auf dem Feedback

**Profil C — Orchestrator:**
- Koordiniert mehrere Claude Code Sessions
- Weist Chunks zu, ueberwacht Fortschritt
- Greift ein wenn ein Agent steckenbleibt

### 6.3 Multi-Agent Koordinationsprotokoll

**Kommunikation:** Mensch als Dirigent, weist Chunks zu, empfaengt Status/Blocker.

**Uebergabe-Artefakte:**
- API-Contracts (.ts/.json)
- Shared Types
- Branch-Konventionen: `feature/<chunk-nr>-<agent>-<beschreibung>`

**Kollisions-Vermeidung:**
- Agents arbeiten nie an denselben Dateien gleichzeitig
- Klare Verzeichnis-Grenzen (z.B. `/src/lib` = Claude Code, `/src/components` = Antigravity)
- Shared Contracts werden in Phase 1 definiert und sind read-only waehrend Phase 2

---

## 7. Context Engineering

### 7.1 Context-Budget-Regel
- Maximal 30% des Kontextfensters mit Kontext fuellen
- Ab 70% Nutzung: neuen Thread starten
- Nie die gesamte Codebase als Kontext geben
- Nie mehr als einen Chunk gleichzeitig bearbeiten
- Immer gezielt referenzieren: spezifische Dateien, Ordner, Funktionen

### 7.2 Context-Hierarchie

```
Schicht 1 (IMMER geladen):
  AGENTIC-BLUEPRINT.md (Root, ~200 Zeilen)
  CLAUDE.md / AGENTS.md des Projekts

Schicht 2 (Phase-spezifisch):
  blueprint/phases/<aktuelle-phase>.md
  blueprint/agents/<aktiver-agent>.md

Schicht 3 (Task-spezifisch referenziert):
  Relevanter Source Code (gezielt getaggt)
  Open-Source Dependency Code (ein Ordner/Datei)
  Shared Types / API Contracts

Schicht 4 (NIE proaktiv geladen):
  Gesamte Codebase
  Alle Tests auf einmal
  Externe Docs in Prosa
```

### 7.3 Source-Code-als-Dokumentation

Statt Docs lesen, den tatsaechlichen Code der Dependency laden:

```bash
npx open-source <github-repo-url>
```

Einsatz wenn:
- Neue Library/Framework integrieren
- Agent macht falsche Annahmen ueber eine API
- Offizielle Docs sind veraltet oder unvollstaendig

Prompt-Pattern:
```
Referenziere die Codebase unter open-source/repos/github.com/<org>/<repo>/
fuer die korrekte Verwendung von <Feature>.
Nutze die tatsaechliche Implementation, nicht dein Training.
```

### 7.4 Prompt-Templates

**Planning Prompt:**
```
Analysiere die Anforderung: <ANFORDERUNG>
Erstelle einen Plan mit nummerierten Chunks.
Jeder Chunk muss:
- In einem frischen Kontextfenster umsetzbar sein
- Maximal 3-5 Dateien beruehren
- Ein klares "Done"-Kriterium haben
Wenn der Plan mehr als 8 Chunks hat: schlage vor wie man den Scope reduziert.
```

**Building Prompt:**
```
Implementiere Chunk <NR> aus dem Plan: <PLAN-LINK>
Referenziere: <GEZIELTER KONTEXT>
Done-Kriterium: <KRITERIUM>
Schreibe Tests fuer die Kernlogik.
Installiere keine Packages die juenger als 14 Tage sind.
```

**Cleanup Prompt:**
```
Analysiere den Code der in diesem Feature-Branch geaendert wurde.
Finde: duplizierte Logik, fehlende Service-Layer-Abstraktion,
Code der in zukuenftigen Sessions schwer zu verstehen waere.
Refactore in wiederverwendbare Module.
Aendere KEINE Funktionalitaet — nur Struktur.
```

**Review-Loop Prompt:**
```
Lies das Review-Feedback auf PR #<NR>.
Fuer jedes Finding: analysiere ob es berechtigt ist.
Wenn ja: fixe es und pushe.
Wenn nein: kommentiere warum.
Warte auf neues Review. Wiederhole bis Score 5/5.
```

---

## 8. Automated Feedback Loops

### 8.1 Loop-Definitionen

**Build-Test-Loop (Phase 2):**
- Trigger: Code geschrieben
- Zyklus: Build > Test > Passing? > wenn nein: Fix > Build > ...
- Max Iterationen: 5
- Abbruch-Aktion: Agent stoppt, meldet Blocker an Mensch

**Cleanup-Verify-Loop (Phase 3):**
- Trigger: Cleanup-Refactoring angewendet
- Zyklus: Refactor > Tests gruen? > Funktionalitaet unveraendert? > wenn nein: Rollback-Teilschritt > ...
- Max Iterationen: 3
- Abbruch-Aktion: Rollback des Refactorings, Original bleibt

**Review-Fix-Loop (Phase 4):**
- Trigger: PR erstellt
- Zyklus: Review > Score lesen > wenn <5: Fix > Push > Review > ...
- Max Iterationen: 7
- Abbruch-Aktion: Mensch uebernimmt manuelles Review

### 8.2 Eskalations-Protokoll

Bei Abbruch eines Loops:
1. Agent dokumentiert: Was wurde versucht, was schlaegt fehl
2. Agent erstellt Issue/Kommentar mit Kontext
3. Agent STOPPT — kein weiteres Herumprobieren
4. Mensch entscheidet: Scope reduzieren, Ansatz aendern, oder manuell fixen

### 8.3 Qualitaets-Gates

**Gate nach Phase 2 (Building > Cleanup):**
- Alle neuen Funktionen haben mindestens einen Test
- Keine hartcodierten Secrets/Credentials
- Feature funktioniert lokal
- Keine Packages installiert die juenger als 14 Tage sind

**Gate nach Phase 3 (Cleanup > Review):**
- Keine duplizierten Logik-Bloecke ueber Dateien hinweg
- Wiederverwendbare Logik in Service-Layer extrahiert
- Alle bestehenden Tests laufen noch gruen
- Diff beruehrt maximal die Dateien aus dem Chunk-Plan

**Gate nach Phase 4 (Review > Merge):**
- Review-Score 5/5 oder explizites menschliches Approval
- CI-Pipeline gruen
- Keine offenen Review-Kommentare unbeantwortet
- Branch ist up-to-date mit Main

**Gate nach Phase 5 (Merge > Done):**
- PR gemerged
- Deployment erfolgreich (wenn applicable)
- Keine Regressionen in Monitoring/Logs

### 8.4 Review-Agent Optionen

**Option A — Greptile (extern):**
- Automatisches Review bei jedem Push
- Confidence-Scores (1-5)
- Agent liest Feedback via GitHub API

**Option B — Zweiter Claude Code Agent:**
- Separater Agent mit Code-Reviewer-Skill
- Laeuft in eigenem Thread/Worktree
- Liest den Diff, schreibt Review-Kommentare
- Vorteil: kein externes Tool noetig, volle Kontrolle

---

## 9. Meta-Ebene

### 9.1 Projekt-Bootstrapping

Neues Projekt in 3 Schritten:

**Schritt 1:** Blueprint-Ordner ins neue Projekt kopieren, AGENTIC-BLUEPRINT.md ins Root.

**Schritt 2:** `blueprint/config.md` ausfuellen:
- Projektname
- Tech-Stack
- Agents und deren Rollen
- Antigravity-Profil (A/B/C)
- Review-Tool (Greptile / Zweiter Agent / Manuell)
- Verzeichnis-Zuweisungen pro Agent
- Shared-Contract-Verzeichnis
- Branch-Prefix

**Schritt 3:** Agent liest config.md + Templates, generiert projektspezifische CLAUDE.md und AGENTS.md. Mensch reviewed und committed.

### 9.2 Templates

Das Blueprint enthaelt fertige Templates fuer:
- `CLAUDE.md.template` — Projekt-Kontext, Prinzipien-Verweis, Phase-Anweisungen, Sicherheitsregeln
- `AGENTS.md.template` — Agent-Rolle, Zustaendigkeits-Matrix, Uebergabe-Protokoll, Eskalations-Regeln
- `PLAN.md.template` — Feature-Beschreibung, nummerierte Chunks mit Done-Kriterien
- `PR-TEMPLATE.md` — Chunk-Referenz, Tests, Review-Checkliste, Gate-Status

### 9.3 Blueprint-Evolution

Nach jedem abgeschlossenen Feature:

**Retro-Fragen:**
- Wo hat der Agent geloopt ohne Fortschritt?
- Welche Prompts funktionierten auf Anhieb?
- Wo war der Kontext zu viel oder zu wenig?
- War die Chunk-Groesse richtig?

**Anpassungen:**
- Prompt-Templates verfeinern
- Loop-Limits anpassen
- Gate-Checklisten erweitern/reduzieren
- Agent-Rollen schaerfen

**Versionierung:**
- Versionsnummer im Root-File (v1.0, v1.1, ...)
- Aenderungen in `blueprint/meta/changelog.md` dokumentiert
- Alte Versionen ueber Git-History abrufbar

---

## 10. Dateistruktur

```
projekt-root/
|
|-- AGENTIC-BLUEPRINT.md
|-- CLAUDE.md                     (generiert)
|-- AGENTS.md                     (generiert)
|
|-- blueprint/
|   |-- config.md
|   |
|   |-- phases/
|   |   |-- 00-ideation.md
|   |   |-- 01-planning.md
|   |   |-- 02-building.md
|   |   |-- 03-cleanup.md
|   |   |-- 04-review-loop.md
|   |   |-- 05-merge.md
|   |
|   |-- agents/
|   |   |-- claude-code.md
|   |   |-- antigravity.md
|   |   |-- coordination.md
|   |
|   |-- templates/
|   |   |-- CLAUDE.md.template
|   |   |-- AGENTS.md.template
|   |   |-- PLAN.md.template
|   |   |-- PR-TEMPLATE.md
|   |
|   |-- loops/
|   |   |-- build-test-loop.md
|   |   |-- cleanup-verify-loop.md
|   |   |-- review-fix-loop.md
|   |
|   |-- meta/
|       |-- how-to-adapt.md
|       |-- decision-trees.md
|       |-- changelog.md
|       |-- retro-template.md
|
|-- open-source/                  (gitignored)
    |-- repos/
        |-- github.com/...
```

---

## 11. Quellen

- Video-Transkript: "Why This Dev Ships 100x Faster Than 99% of Engineers" (David Ondrej Podcast mit Mickey)
- GitHub: `pawel-cell/micky-podcast-agentic-engineering` — Skills: agentic-engineering-workflow, source-code-context, code-structure-cleanup, grep-loop-review-workflow
- GitHub: `michaelshimeles/skills` — Allgemeine Skills-Sammlung

---

## Changelog

| Version | Datum | Aenderung |
|---------|-------|-----------|
| 1.0 | 2026-05-22 | Initiales Design |
