# Entscheidungsbaeume

## Welches Modell fuer welchen Task? (seit Fable 5, 06/2026)

```
Task erhalten
    |
    v
Long-Horizon Mission (Migration, mehrstuendiger autonomer Run,
Architektur-Entscheidungen, Team-Lead-Rolle)?
    ├── JA → Fable 5 (effort high/xhigh, vollstaendige Spec im ersten Turn)
    |
    └── NEIN: Harte Logik mit Korrektheits-Risiko (Parser, Algorithmik, Aggregation)?
            ├── JA → Opus 4.8
            |
            └── NEIN: Read-only Recherche / Explore / mechanischer Massen-Edit?
                    ├── JA → Haiku 4.5
                    └── NEIN → Sonnet 4.6 (Standard)
```

Kosten-Anker (in/out pro MTok): Fable $10/$50 · Opus $5/$25 · Sonnet $3/$15 · Haiku $1/$5.
Fable kostet 2× Opus — der Mehrwert liegt in Long-Horizon-Autonomie, nicht in jedem Einzeltask.

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
Neue Phase beginnt?
    ├── JA → Neuer Thread
    |
    └── NEIN: Agent wird ungenau / halluziniert / wiederholt sich?
            ├── JA → Neuer Thread
            |
            └── NEIN: Themenwechsel (neuer Chunk / neue Mission)?
                    ├── JA → Neuer Thread
                    └── NEIN → Weiter im aktuellen Thread

(Harte Prozent-Schwellen sind seit 1M-Kontext + serverseitiger Compaction obsolet —
Qualitaetssignale des Agents sind der bessere Trigger.)
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

## Chunk-Mode oder Mission-Mode? (Phase 2)

```
Plan reviewed (Phase 1 abgeschlossen)
    |
    v
Zusammenhaengender Long-Horizon-Auftrag
(Migration, Subsystem, Refactor ueber viele Dateien)?
    ├── NEIN → Chunk-Mode (Default): 3-5 Dateien pro Chunk, Sonnet/Opus-Teammates
    |
    └── JA: Spezifikation vollstaendig (Definition of Done binaer pruefbar)?
            ├── NEIN → Zurueck zu Phase 1 — Spec schaerfen
            |          (Mission ohne Spec = teures Raten)
            |
            └── JA: Zerfaellt die Arbeit in unabhaengige parallele Teile?
                    ├── JA → Hybrid: Fable-Lead koordiniert das Team,
                    |        Missions/Chunks als Tasks an getierte Teammates
                    └── NEIN → Mission-Mode: Fable 5, effort high/xhigh,
                               ein Prompt, frischer Thread
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
Claude Code verfuegbar?
    ├── JA → /code-review Skill als erste Stufe (jeder PR)
    |        + Zweiter Agent mit frischem Kontext fuer kritische PRs
    |        (Autor reviewed nie selbst — andere Session/anderes Pane)
    |
    └── NEIN: Externes Review-Tool (z.B. Greptile) verfuegbar?
            ├── JA → Externes Tool nutzen
            └── NEIN → Manuelles Review durch Mensch
```
