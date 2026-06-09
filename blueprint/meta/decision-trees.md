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
