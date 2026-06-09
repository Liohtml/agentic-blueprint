# Post-Feature Retro

> Fuehre diese Retro nach jedem groesseren Feature oder Sprint durch.
> Ziel: Blueprint kontinuierlich verbessern.

**Feature:** <Name>
**Datum:** <YYYY-MM-DD>
**Beteiligte Agents:** <Claude Code, Antigravity, ...>
**Dauer:** <Wie lange hat das Feature gedauert>

---

## Was lief gut?

- <Was hat auf Anhieb funktioniert?>
- <Welche Prompts waren effektiv?>
- <Wo war die Chunk-Groesse genau richtig?>

## Was lief schlecht?

- <Wo hat der Agent geloopt ohne Fortschritt?>
- <Wo war der Kontext zu viel oder zu wenig?>
- <Welche Phase hat unerwartet lange gedauert?>
- <Gab es Kollisionen zwischen Agents?>

## Ueberraschungen

- <Was war unerwartet — positiv oder negativ?>
- <Welche Annahmen waren falsch?>

## Zahlen

| Metrik | Wert |
|--------|------|
| Chunks geplant | |
| Chunks ausgefuehrt | |
| Build-Test-Loop Durchschnitt (Iterationen) | |
| Cleanup-Verify-Loop Durchschnitt | |
| Review-Fix-Loop Durchschnitt | |
| Eskalationen an Mensch | |
| Finale Review-Scores | |
| Kosten gesamt (USD, aus dem Observer) | |
| Modell-Mix (Anteil Fable/Opus/Sonnet/Haiku) | |

## Blueprint-Anpassungen

> Was sollte am Blueprint geaendert werden basierend auf dieser Erfahrung?

- [ ] Prompt-Templates anpassen: <welche, warum>
- [ ] Loop-Limits anpassen: <welcher Loop, neues Limit, warum>
- [ ] Gate-Checklisten anpassen: <welches Gate, was hinzufuegen/entfernen>
- [ ] Agent-Rollen schaerfen: <welcher Agent, was aendern>
- [ ] Neue Phase/Loop noetig? <beschreiben>

## Learnings persistieren

> Learnings, die kuenftige Runs beeinflussen sollen, gehoeren nicht nur in dieses Doc —
> sie muessen dort landen, wo Agents sie automatisch lesen.

- [ ] `CLAUDE.md` / `AGENTS.md` aktualisiert (projektspezifische Regeln)
- [ ] Blueprint-Aenderung als PR vorgeschlagen (framework-weite Regeln)
- [ ] Agent-Memory aktualisiert (Memory-Tool bzw. Memory Store), damit Agents
      die Learnings in der naechsten Session selbst vorfinden

## Fazit

<1-2 Saetze: Was ist die wichtigste Erkenntnis?>
