# Backlog — Continuous Improvement Loop

> Arbeitsdokument des Orchestrator-Loops. Jeder Zyklus: 1-3 Items aus „Offen" ziehen →
> Research + Devil's-Advocate-Review → umsetzen → testen → pushen → hier aktualisieren.
> Strategische Richtungsfragen werden dem Maintainer vorgelegt, nicht geraten.

## Offen (priorisiert)

- [ ] **Onboarding-Pfad für Nicht-Techniker** — vom „Ich habe noch nie ein Terminal benutzt"
  zum ersten Erfolgserlebnis. Erwartet aus Zyklus 1 (Research + DA laufen).
- [ ] **README professionalisieren** — klare Zielgruppen-Pfade (Einsteiger / Experte),
  ehrliche Anforderungen, Social Proof. Erwartet aus Zyklus 1.
- [ ] **Contributor-Funnel** — CONTRIBUTING.md, good-first-issues, Issue-/PR-Templates,
  Maintainer-Erwartungen. Erwartet aus Zyklus 1.
- [ ] **Observer: Effort-/Task-Budget-Anzeige** — erst Transcript-Datenformen nach
  DATA-NOTES-Prozess verifizieren, dann Parser/UI erweitern (aus Fable-5-Evaluation, Welle 3).
- [ ] **CLAUDE.md.template / AGENTS.md.template gegen v1.3 prüfen** — Mission-Mode,
  4-Stufen-Tiering und neue Kontext-Regeln müssen sich in den generierten Dateien spiegeln.
- [ ] **Worked Example end-to-end** — ein kleines, echtes Beispielprojekt das den kompletten
  6-Phasen-Durchlauf zeigt (nicht nur den Observer als Referenz).

## In Arbeit (Zyklus 1 — 2026-06-09)

- [ ] Research-Agent: Agentic-Coding-Innovationen, Onboarding-Patterns, Contributor-Strategien
- [ ] Devil's Advocate: Kritik aus Sicht Nicht-Techniker / Senior Engineer / Contributor

## Erledigt

- [x] **2026-06-09 (Zyklus 0):** Fable-5-Evaluation + Roadmap-Wellen 1-3 — 4-Stufen-Tiering,
  Mission-Mode, Task Budgets, Cloud Execution Profile, Observer-Pricing-Fix, Kontext-Regeln
  modernisiert. Siehe `docs/2026-06-09-fable-5-evaluation.md` und PR #7.

## Entscheidungs-Log (Maintainer-Feedback)

| Datum | Frage | Entscheidung |
|---|---|---|
| 2026-06-09 | Kontinuierlicher Verbesserungs-Loop mit Engineering-Team + Devil's Advocate, Orchestrator-Modell | ✅ Maintainer-Vision, Loop gestartet (30-Min-Zyklen) |

## Loop-Regeln (Kurzfassung)

1. Kein Item ohne Devil's-Advocate-Review umsetzen.
2. Strikte Datei-Eigentümerschaft pro Implementierungs-Agent.
3. Observer-Tests müssen grün sein vor jedem Push (`cd observer && npx vitest run`).
4. Kleine, saubere Commits. Kein Merge, kein Force-Push — Merge bleibt beim Maintainer.
5. Scope-/Brand-/Strukturfragen → Maintainer fragen.
