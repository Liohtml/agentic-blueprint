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
