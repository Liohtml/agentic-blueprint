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
