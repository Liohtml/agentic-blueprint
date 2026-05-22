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
