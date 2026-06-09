# Team-Lead Prompt Template — Agent Teams

> Kopiere diesen Prompt in Claude Code, befülle alle `<PLATZHALTER>` und starte dein Team.
> Generalisiert aus dem Bau des **[Agent Observer](../../observer/README.md)**.
> Setup & Runbook: **[blueprint/agents/agent-teams.md](../agents/agent-teams.md)**.

---

Du bist Team-Lead für das folgende Vorhaben. Erstelle das Team, lege den Task-Graphen an
und koordiniere die Teammates bis zur Fertigstellung.

## Mission

**Ziel:** `<KURZE BESCHREIBUNG — z.B. "Baue einen Live-Dashboard für Agent-Teams">`

**Repo:** `<PFAD-ZUM-REPO>` · **Branch:** `<FEATURE-BRANCH>`

**Tech-Constraints:**
- `<TECH-STACK — z.B. "Node 20 + TypeScript, kein Framework außer Vite für Web-UI">`
- `<WEITERE CONSTRAINTS — z.B. "kein Express; nur Node-stdlib http">`

**Definition of Done:**
- [ ] `<ABNAHMEKRITERIUM 1 — z.B. "npm test && npm run typecheck laufen clean">`
- [ ] `<ABNAHMEKRITERIUM 2 — z.B. "Dashboard zeigt Live-Daten eines echten Teams">`

---

## Pflicht-Regeln (nicht verhandelbar)

### 1 · Shared Contract zuerst

Erstelle einen **Blocker-Task T1** (z.B. `types.ts`, API-Interface, Daten-Contract).

- T1 **blockiert alle anderen Tasks** (`addBlocks: ["T2", "T3", …]`).
- Spawne nur den T1-Bearbeiter. Erst wenn T1 `completed` ist, werden die übrigen Tasks
  freigegeben und die restlichen Teammates gespawnt.
- Nach Freigabe ist der Contract **READ-ONLY** — Änderungen erfordern: STOPP aller Agents,
  Mensch entscheidet, Neustart der betroffenen Tasks.

### 2 · Datei-Eigentum (kein Overlap)

Jeder Teammate besitzt exklusiv seine Dateien.
**Kein Teammate berührt Dateien eines anderen Teammates.**

Definiere die Eigentümer-Matrix im Plan, bevor die ersten Agents gespawnt werden:

| Teammate | Eigene Dateien / Verzeichnisse |
|---|---|
| `<AGENT-1>` | `<PFADE — z.B. src/server/, src/parsers/>` |
| `<AGENT-2>` | `<PFADE — z.B. web/src/, web/index.html>` |
| `<AGENT-3>` | `<PFADE — z.B. src/metrics/, src/watcher/>` |

Wenn zwei Tasks dieselbe Datei brauchen → **sequenziell**, nicht parallel.
Details: [coordination.md](../agents/coordination.md).

### 3 · Modell-Tiering (Kostenkontrolle)

| Modell | Wann einsetzen |
|---|---|
| **Opus** | Harte Logik, Parser, Algorithmen, Aggregation mit Korrektheits-Risiko |
| **Sonnet** | Scaffold, UI, CRUD, Tests, Docs, alles Übrige |

```
Agent(team_name: "<TEAM>", name: "<HARD-AGENT>", model: "opus",   …)
Agent(team_name: "<TEAM>", name: "<REST-AGENT>", model: "sonnet", …)
```

Spawne **bedarfsgesteuert**: T1 zuerst allein, erst nach T1-Grün den Rest.
10 idle Panes warten teuer auf einen Contract.

### 4 · Task-Graph mit Abhängigkeiten

Lege **alle Tasks mit `addBlocks` / `addBlockedBy`** an, bevor du die ersten Teammates spawnt.
Teammates ziehen nur freigeschaltete, unblockierte Tasks.

Beispiel-Graph (passe ihn an dein Vorhaben an):

```
T1 [shared-contract]  →  blockiert T2, T3, T4, T5
T3 [server]           →  blockiert T6
T4 [parser]           →  blockiert T7
T6 + T7               →  blockiert T8 [integration]
…
```

### 5 · Build-Test-Loop (max 5 Iterationen)

Jeder Teammate läuft **maximal 5 Build-Test-Iterationen** pro Task.
Bei Ablauf: **STOPP** — Blocker dokumentieren, an Lead eskalieren.
Kein endloses Herumspinnen.

### 6 · Kein Self-Review

Der Autor eines Chunks reviewed **nicht seinen eigenen Code**.
Weise Reviews einem anderen Teammate zu oder behalte sie als Lead.

### 7 · Kein Merge ohne menschliches Go

Kein Teammate merged, pusht forcefully oder schließt PRs eigenständig.
Der Mensch gibt das finale Go nach eigenem Review.

---

## Team-Zusammensetzung

```bash
# Erstelle das Team (Lead bist du)
TeamCreate "<TEAM-NAME>"
```

| # | Teammate | Aufgabe | Modell | Eigene Dateien |
|---|---|---|---|---|
| T1 | `<CONTRACT-AGENT>` | Typen / Shared Interface | sonnet | `<z.B. src/types.ts>` |
| T2 | `<AGENT-A>` | `<AUFGABE>` | sonnet | `<PFADE>` |
| T3 | `<AGENT-B>` | `<AUFGABE>` | opus | `<PFADE>` |
| T4 | `<AGENT-C>` | `<AUFGABE>` | sonnet | `<PFADE>` |

_Spawne den T1-Bearbeiter zuerst. Nach T1-Grün: die übrigen in einer Welle spawnen._

---

## Abschluss & Verifikation

Wenn alle Tasks `completed` sind:

1. **Smoke-Test:** `<BEFEHL — z.B. "npm test && npm run typecheck">`
2. **Integrations-Check:** Starte das Ergebnis manuell: `<BEFEHL — z.B. "npm run observe">`
3. **Visuell verifizieren:** `<WAS PRÜFEN — z.B. "Dashboard zeigt Live-Token-Daten">`
4. **Cleanup:** Sende `{ type: "shutdown_request" }` an jeden Teammate; sie antworten mit
   `shutdown_response` und beenden ihren Prozess/ihr Pane.
5. **Human Go einholen:** Kein Merge ohne Bestätigung durch den Menschen.
6. **Team aufräumen:** `TeamDelete "<TEAM-NAME>"` + `tmux kill-session -t <SESSION>`.

---

## Worked Example — Agent Observer

Dieses Template ist eine Abstraktion davon, wie der **[Agent Observer](../../observer/README.md)**
in diesem Repo gebaut wurde:

- **10 Teammates** (T1–T10) auf einem geteilten Branch (`feature/agent-observer`).
- **T1** (`types.ts`) als Blocker-Contract — alle anderen warteten auf T1-Grün.
- **T5** (Transcript-Parser) und **T7** (Token-Aggregator) auf **Opus** (harte Logik),
  alle übrigen acht auf **Sonnet**.
- Striktes Datei-Eigentum: kein Teammate hat die Dateien eines anderen angefasst.
- Kein Merge ohne menschliches Go nach finalem Review.

Ein laufendes Team live beobachten:

```bash
./scripts/observe.sh --team <TEAM-NAME>
# öffnet das Dashboard auf http://localhost:4317
```
