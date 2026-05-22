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
