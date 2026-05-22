# Phase 5: Merge & Validate

## Zweck
Finaler menschlicher Check, Merge und Validierung dass nichts kaputt gegangen ist.

## Wer
- **Mensch:** Gibt finales Go und merged
- **Agent:** Pre-Merge Checks, Post-Merge Validierung

## Eingang
- PR mit Review-Score 5/5 aus Phase 4

## Prozess

1. **Mensch reviewed PR final** — letzter Blick auf den Diff
2. **Pre-Merge Checks durch Agent:**
   - CI gruen?
   - Branch up-to-date mit Main?
   - Keine Merge-Konflikte?
3. **Mensch merged** — Agent macht das NICHT eigenstaendig
4. **Post-Merge Validierung:**
   - Deployment erfolgreich? (wenn applicable)
   - Keine Regressionen in Monitoring/Logs?
   - Feature funktioniert in Staging/Production?

## Gate
- [ ] PR gemerged
- [ ] Deployment erfolgreich (wenn applicable)
- [ ] Keine Regressionen in Monitoring/Logs
- [ ] Feature funktioniert wie erwartet

## Output
Shipped Feature

## Danach
- [Retro durchfuehren](../meta/retro-template.md) (empfohlen nach jedem groesseren Feature)
- Blueprint anpassen wenn noetig (siehe [how-to-adapt.md](../meta/how-to-adapt.md))
