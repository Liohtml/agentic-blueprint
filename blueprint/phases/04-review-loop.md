# Phase 4: Review Loop

## Zweck
Automatisierter Review-Zyklus bis der Code Qualitaetsstandards erfuellt.

## Wer
- **Review-Agent:** Greptile, zweiter Claude Code Agent, oder manuell (siehe config.md)
- **Build-Agent:** Fixt basierend auf Feedback
- **Mensch:** Greift ein bei Loop-Abbruch

## WICHTIG
Ein Agent reviewed sich NIE selbst. Review muss immer von einer separaten Instanz kommen.

## Eingang
- Sauber strukturierter Code aus Phase 3
- Feature-Branch bereit fuer PR

## Prozess

1. **PR erstellen** mit PR-Template (siehe templates/PR-TEMPLATE.md)
2. **Review abwarten** — automatisch oder manuell
3. **Feedback lesen und bewerten**
4. **Fixes anwenden und pushen**
5. **Neues Review abwarten**
6. **Wiederholen bis Score 5/5 oder manuelles Approval**

## Agent-Prompt (Build-Agent nach Review)

```
Lies das Review-Feedback auf PR #<NR>.

Fuer jedes Finding:
1. Analysiere ob es berechtigt ist
2. Wenn ja: fixe es und erklaere kurz was du geaendert hast
3. Wenn nein: kommentiere warum du es fuer unberechtigt haeltst

Pushe alle Fixes.
Warte auf neues Review.
Wiederhole bis Score 5/5.

Max 7 Iterationen. Danach: STOPP und eskaliere an Mensch.
```

## Review-Fix-Loop

Siehe: [review-fix-loop.md](../loops/review-fix-loop.md)

Max 7 Iterationen.

## Review-Agent Optionen

### Option A: Greptile (extern)
- Automatisches Review bei jedem Push an den PR
- Confidence-Scores 1-5
- Agent liest Feedback via GitHub API / PR-Kommentare

### Option B: Zweiter Claude Code Agent
- Starten in eigenem Thread/Worktree
- Liest den Diff des PRs
- Schreibt strukturiertes Review mit Findings und Severity
- Vorteil: kein externes Tool, volle Kontrolle

Welche Option genutzt wird steht in `blueprint/config.md`.

## Gate
- [ ] Review-Score 5/5 oder explizites menschliches Approval
- [ ] CI-Pipeline gruen
- [ ] Keine offenen Review-Kommentare unbeantwortet
- [ ] Branch ist up-to-date mit Main

## Output
PR bereit zum Merge

## Weiter zu
[Phase 5: Merge & Validate](05-merge.md)
