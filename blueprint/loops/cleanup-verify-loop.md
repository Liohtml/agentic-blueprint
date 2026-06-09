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

## Token-Budget (optional, API)

Ergaenzend zum harten Iterations-Limit kann pro Loop-Durchlauf ein **Task Budget**
gesetzt werden: `output_config: {task_budget: {type: "tokens", total: N}}`
(Beta-Header `task-budgets-2026-03-13`, Minimum 20 000). Das Modell sieht einen
laufenden Token-Countdown und priorisiert/beendet selbststaendig. Weiche Grenze —
das Iterations-Limit bleibt der harte Abbruch.

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
