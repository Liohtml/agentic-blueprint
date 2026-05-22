# Phase 0: Ideation & Scoping

## Zweck
Problem verstehen, Scope definieren, Erfolgskriterien festlegen.

## Wer
- **Mensch:** Treibt die Ideation, trifft alle Entscheidungen
- **Agent:** Sparring-Partner, prueft Machbarkeit, stellt Rueckfragen

## Eingang
- Idee, Feature-Request, Bug-Report oder Geschaeftsanforderung

## Prozess

1. **Problem formulieren:** Was genau soll geloest werden? (Nicht die Loesung, das Problem.)
2. **Scope begrenzen:** Was gehoert NICHT dazu? Explizit auflisten.
3. **Erfolgskriterien definieren:** Woran erkennt man, dass das Feature fertig ist?
4. **Machbarkeits-Check:** Agent pruefen lassen ob der Scope realistisch ist.

## Agent-Prompt fuer Sparring

```
Ich habe folgende Idee: <IDEE>

Hilf mir diese zu schaerfen:
1. Was ist das Kernproblem das geloest wird?
2. Was sollte explizit NICHT im Scope sein?
3. Welche Erfolgskriterien wuerden zeigen dass es funktioniert?
4. Siehst du technische Risiken oder Unklarheiten?

Sei kritisch. Hinterfrage Annahmen.
```

## Gate
- [ ] Problem-Statement ist klar und spezifisch
- [ ] Scope ist explizit begrenzt (was ist NICHT drin)
- [ ] Mindestens 2 messbare Erfolgskriterien definiert
- [ ] Mensch ist zufrieden mit der Schaerfe der Anforderung

## Output
Dokumentiertes Problem-Statement mit Scope und Erfolgskriterien. Kann formlos sein oder in einem Issue/Ticket.

## Weiter zu
[Phase 1: Planning](01-planning.md)
