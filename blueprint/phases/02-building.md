# Phase 2: Building

## Zweck
Den Plan implementieren — als einzelne Chunks (Chunk-Mode, Default) oder als
zusammenhaengende Mission auf Fable 5 (Mission-Mode). Pro Chunk/Mission ein frischer Thread.

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

## Mission-Mode (Fable 5)

Seit Fable 5 (06/2026) gibt es zwei Ausfuehrungs-Modi. Mission-Mode nutzt die
Long-Horizon-Autonomie des Modells: statt 8 Mikro-Chunks ein gut spezifizierter
Gesamtauftrag.

| | Chunk-Mode (Default) | Mission-Mode |
|---|---|---|
| Modell | Sonnet / Opus | Fable 5 |
| Einheit | 1 Chunk (3-5 Dateien) | 1 Mission (zusammenhaengender Feature-Teil, auch >5 Dateien) |
| Spezifikation | Done-Kriterium pro Chunk | Vollstaendiger Plan als ein Prompt im ersten Turn |
| Effort | Standard | `high` / `xhigh` |
| Wann | Standard-Arbeit, parallele Teammates | Migrationen, zusammenhaengende Subsysteme, Refactors ueber viele Dateien |

**Mission-Mode-Regeln:**

1. **Volle Spec up front.** Fables Long-Horizon-Qualitaet haengt direkt an der
   Spezifikationsqualitaet — der Phase-1-Plan wird als *ein* Prompt ausgespielt,
   nicht haeppchenweise nachgereicht. Unterspezifizierte Missionen sind teures Raten.
2. **Definition of Done als Checkliste** — jedes Kriterium binaer pruefbar.
3. **Gates bleiben.** Mission-Mode aendert die Ausfuehrungsgroesse, nicht die
   Qualitaetsschranken: Cleanup (Phase 3) und Review (Phase 4) laufen unveraendert.
4. **Optionales Token-Budget** pro Mission (siehe [build-test-loop.md](../loops/build-test-loop.md)).
5. **Kosten-Check:** Fable kostet 2× Opus. Mission-Mode lohnt, wenn der
   Koordinations-Overhead des Chunk-Modes (Thread-Wechsel, Kontext-Reloads,
   Handoffs) den Preisaufschlag uebersteigt — bei Migrationen praktisch immer.

**Agent-Prompt (Mission):**

```
Mission: <FEATURE/MIGRATION — vollstaendige Beschreibung>

Spezifikation: <PLAN-LINK — kompletter Plan, nicht ein Einzel-Chunk>

Definition of Done:
- [ ] <KRITERIUM 1 — binaer pruefbar>
- [ ] <KRITERIUM 2>

Kontext: <Einstiegspunkte — der Agent exploriert selbst weiter>

Regeln:
- Arbeite die Mission vollstaendig ab, bevor du zurueckmeldest
- Schreibe Tests fuer die Kernlogik; fuehre die Suite nach jedem Teilschritt aus
- Installiere keine Packages die juenger als 14 Tage sind
- Keine hartcodierten Secrets
- Bei Blockern die die Spezifikation betreffen: STOPP und eskalieren — nicht raten
```

Modus-Entscheidung: siehe [decision-trees.md](../meta/decision-trees.md).

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
