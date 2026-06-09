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

> Mit Fable 5 als Build-Agent sind one-shot Fixes der Normalfall. Laeuft der Loop
> trotzdem >3 Iterationen, liegt das Problem fast sicher in der Spezifikation oder
> einem Architektur-Konflikt — frueher eskalieren statt weiterloopen.

## Token-Budget (optional, API)

Ergaenzend zum harten Iterations-Limit kann pro Loop-Durchlauf ein **Task Budget**
gesetzt werden: `output_config: {task_budget: {type: "tokens", total: N}}`
(Beta-Header `task-budgets-2026-03-13`, Minimum 20 000). Das Modell sieht einen
laufenden Token-Countdown und priorisiert/beendet selbststaendig. Weiche Grenze —
das Iterations-Limit bleibt der harte Abbruch.

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
