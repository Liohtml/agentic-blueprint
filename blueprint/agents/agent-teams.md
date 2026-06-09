# Agent Teams (Claude Code) — Setup & Runbook

> Echte Teammates statt Subagents/Workflow: mehrere vollwertige Claude-Code-Sessions,
> die als Team zusammenarbeiten — jeder in einem eigenen tmux-Split-Pane, mit
> gemeinsamer Task-Liste und Inter-Agent-Nachrichten. Dieses Dokument beschreibt
> unser real verwendetes Setup (verifiziert beim Bau des **[Agent Observer](../../observer/README.md)**).

## Was ist das (und was nicht)

| Mechanismus | Isolation | Kommunikation | Wann |
|---|---|---|---|
| **Subagent** (Agent-Tool, einmalig) | eigener Kontext, kein Pane | Rückgabe-Text an Lead | kurze, abgeschlossene Recherche/Edit |
| **Workflow** (Skript) | deterministisch orchestriert | Funktions-Rückgaben | viele gleichartige Schritte, Fan-out |
| **Agent Team** (dieses Dok) | **eigene Session pro Teammate** | **SendMessage + geteilte Task-Liste** | langlebige, arbeitsteilige Builds |

Ein Agent Team ist eine `1:1`-Entsprechung von **Team = Task-Liste**. Der Lead erstellt
das Team, legt Tasks mit Abhängigkeiten an, spawnt Teammates und koordiniert per Nachricht.

## Fresh Clone — Schnellstart

Auf einem frischen Rechner reichen drei Schritte:

```bash
./scripts/bootstrap.sh                   # Abhängigkeiten + Umgebungs-Check
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
tmux new -s teamwork && claude
```

Dann fülle das **[Team-Prompt-Template](../templates/team-prompt.md)** aus und paste es in
Claude — es enthält alle Pflicht-Regeln (Contract-first, Datei-Eigentum, Modell-Tiering,
Task-Graph, Build-Test-Loop, kein Self-Review, kein Merge ohne Human-Go) als vorgefertigte
Abschnitte mit `<PLATZHALTERN>`.

Ein laufendes Team beobachten (zweites Pane):

```bash
./scripts/observe.sh --team <TEAM-NAME>
```

---

## Voraussetzungen

1. **Feature-Flag aktivieren** (sonst keine Team-Tools):
   ```bash
   export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
   ```
   Am besten dauerhaft in `~/.zshrc`.

2. **tmux** für die Split-Pane-Darstellung (jeder Teammate = ein Pane):
   ```bash
   brew install tmux   # macOS
   tmux -V             # ≥ 3.x; getestet mit 3.6b
   ```

3. **Innerhalb von tmux starten.** Prüfe `echo $TMUX` — leer = du bist NICHT in tmux,
   dann gibt es keine Split-Panes (Teammates laufen dann „in-process" ohne sichtbares Pane).

### In-Process vs. Split-Pane
- **Split-Pane** (empfohlen): in tmux gestartet → jeder Teammate bekommt ein eigenes,
  sichtbares Pane. Du siehst alle Agents gleichzeitig arbeiten. Genau dafür ist der
  **Agent Observer** gedacht — er liest die lokalen Dateien und zeigt Status/Tokens/Kosten
  aller Panes auf einen Blick.
- **In-Process**: ohne tmux. Funktioniert, aber ohne separate Panes; Beobachtung nur über
  Nachrichten/Task-Liste (oder eben den Observer, der dateibasiert arbeitet).

### ⚠️ Ghostty-Caveat
Ghostty (und einige andere GPU-Terminals) rendern tmux-Splits teils fehlerhaft oder
fangen Tastenkürzel ab. Wenn Panes flackern oder Splits nicht erscheinen: in einem
nativen Terminal (Terminal.app, iTerm2) tmux starten und Claude darin laufen lassen.
Innerhalb von tmux ist `$TERM_PROGRAM=tmux` und `$TERM=tmux-256color` — das ist korrekt.

## Runbook

```bash
# 1. Terminal → tmux-Session starten
tmux new -s teamwork

# 2. Flag setzen (falls nicht in der Shell-Config)
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# 3. Claude Code im Projekt starten
cd ~/mein-projekt
claude

# 4. Team-Prompt geben (Lead-Rolle). Der Lead:
#    - TeamCreate "<team>"            → ~/.claude/teams/<team>/config.json + Task-Liste
#    - TaskCreate / TaskUpdate        → Tasks + Abhängigkeiten (blocks / blockedBy)
#    - Agent(team_name, name, model)  → Teammates spawnen (je ein Pane)
#    - SendMessage                    → Koordination; TaskUpdate → Fortschritt
```

Empfohlenes Vorgehen für den Lead (deckt sich mit unseren [Phasen](../phases/01-planning.md)):
1. **Shared Contract zuerst.** Ein „Blocker"-Task (z. B. Typen/Interfaces) blockiert alle
   anderen. Erst spawnen/freigeben, wenn er grün ist. Danach ist der Contract **read-only**.
2. **Datei-Eigentum statt Branches.** Ein gemeinsamer Branch, geteiltes Filesystem;
   Isolation entsteht durch strikt getrennte Datei-Eigentümer (siehe
   [Koordinationsprotokoll](./coordination.md)). Kein Teammate berührt fremde Dateien.
3. **Abhängigkeiten im Task-Graph** abbilden (`addBlocks` / `addBlockedBy`), damit
   Teammates nur freigeschaltete, unblockierte Tasks ziehen.

## Modell-Tiering (Kostenkontrolle)

Teammates werden beim Spawnen pro Rolle getiert — teures Modell nur für die kniffligen
Teile, Standard-Modell für den Rest. Seit Fable 5 (06/2026) sind es vier Stufen:

| Modell | Preis (in/out pro MTok) | Wann einsetzen |
|---|---|---|
| **Fable 5** (`fable`) | $10 / $50 | Lead/Koordinator, Mission-Chunks, architektur-kritische Migrationen, finales Review. 2× Opus-Preis — gezielt, nicht flächig. |
| **Opus** (`opus`) | $5 / $25 | Harte Logik: Parser, Algorithmen, Aggregation mit Korrektheits-Risiko |
| **Sonnet** (`sonnet`) | $3 / $15 | Standard: Scaffold, UI, CRUD, Tests, Docs |
| **Haiku** (`haiku`) | $1 / $5 | Explore-/Recherche-Subagents, mechanische Massen-Edits |

```
Agent(team_name: "<team>", name: "lead",   model: "fable",  ...)   # Mission-Koordination
Agent(team_name: "<team>", name: "parser", model: "opus",   ...)   # harte Logik
Agent(team_name: "<team>", name: "ui",     model: "sonnet", ...)   # Standard
Agent(team_name: "<team>", name: "scout",  model: "haiku",  ...)   # Explore/Recherche
```

Faustregel: **Fable** nur für den Lead und Tasks, deren Scheitern den ganzen Run kostet;
**Opus** für Parser/Aggregation/Algorithmik mit Korrektheits-Risiko, **Sonnet** für
Scaffold, UI, CRUD, Tests, **Haiku** für read-only Vorarbeit. (Beim Observer: T5
Transcript-Parser und T7 Aggregator auf Opus, alle übrigen acht auf Sonnet — heute
würde der Lead auf Fable laufen.)

## Kosten-Hinweise

- Ein Team mit N Teammates = N parallele Sessions → **N-facher Token-Verbrauch**.
  10 Agents über mehrere Build-Test-Loops summieren sich schnell.
- **Cache** dominiert die Kosten: Teammates lesen viel Kontext (großer
  `cache_read`-Anteil). Kurze, präzise Task-Beschreibungen + ein zentrales
  Notiz-/Contract-Dokument (statt jedem Agent alles einzeln zu erklären) senken den Verbrauch.
- Spawne **bedarfsgesteuert**: Blocker-Task zuerst allein, erst danach den Rest — so
  warten nicht 9 teure Panes idle auf den Contract.
- Der **[Agent Observer](../../observer/README.md)** schätzt Live-Kosten pro Agent aus den
  `usage`-Feldern der Transcripts (Preis-Tabelle ist editierbar und **nicht autoritativ** —
  Preise selbst prüfen).

## Wo liegen die Daten (Beobachtung & Debugging)

| Was | Pfad |
|---|---|
| Team-Config + Mitglieder | `~/.claude/teams/<team>/config.json` |
| Inboxes (Nachrichten) | `~/.claude/teams/<team>/inboxes/<name>.json` |
| Task-Liste | `~/.claude/tasks/<team>/<n>.json` |
| Transcripts (Tokens/Tools) | `~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl` |

Genau diese Dateien wertet der **Agent Observer** aus — kein externes Monitoring nötig.

## Cleanup

```text
1. Arbeit fertig & verifiziert → menschliches Go zum Mergen einholen.
2. Teammates herunterfahren: SendMessage { type: "shutdown_request" } an jeden Teammate
   (sie bestätigen mit shutdown_response; das beendet ihren Prozess/ihr Pane).
3. Team-Aufräumen: Team löschen (TeamDelete) bzw. ~/.claude/teams/<team>/ entfernen,
   wenn nicht mehr gebraucht. Task-Liste unter ~/.claude/tasks/<team>/ analog.
4. tmux-Session schließen: `tmux kill-session -t teamwork`.
```

> Merge-Disziplin: **kein Merge ohne menschliches Go.** Der Mensch bleibt Dirigent
> (siehe [coordination.md](./coordination.md)).
