# Cloud Execution Profile — Managed Agents + Outcomes

> Alternativer Ausfuehrungspfad fuer Phase 2–4: statt lokaler tmux-Teammates laeuft
> der Build als **Managed-Agent-Session** auf Anthropics Infrastruktur — mit einer
> **Outcome-Rubrik**, gegen die ein unabhaengiger Grader jede Iteration bewertet.
> Status: Anthropic-Beta (`managed-agents-2026-04-01`). Lokale Agent Teams
> ([agent-teams.md](agent-teams.md)) bleiben der Default fuer interaktive Arbeit.

## Warum das zum Blueprint passt

Unser Review-Fix-Loop ist konzeptionell identisch mit Anthropics Outcome-Mechanismus:
iterate → grade → revise, mit `max_iterations` als hartem Limit. Der Unterschied:
beim Outcome laeuft der Loop serverseitig, und der Grader hat ein **eigenes
Kontextfenster** — strukturell erzwungenes "kein Self-Review".

| Blueprint-Konzept | Managed-Agents-Pendant |
|---|---|
| Phase-1-Plan + Definition of Done | `user.define_outcome` mit Rubrik (`description` + `rubric`) |
| Review-Fix-Loop (max 7) | Grader-Loop (`max_iterations`, Default 3, max 20) |
| Loop-Abbruch → Eskalation | `result: max_iterations_reached` / `failed` → Session idle, Mensch uebernimmt |
| Kein Self-Review | Grader = separates Kontextfenster, per Design |
| Kein Merge ohne Human-Go | Session schreibt auf Feature-Branch; PR/Merge bleibt beim Menschen |
| Datei-Eigentum / Isolation | Container pro Session, Repo via `github_repository`-Resource gemountet |
| Agent Observer | Session-Events (`span.model_request_end.model_usage`) + Console-UI |

## Wann Cloud, wann lokal?

```
Build ansteht (Phase 2)
    |
    v
Brauchst du Interaktion waehrend des Runs (Sparring, Kurskorrektur)?
    ├── JA → Lokal: Agent Teams / Claude Code (Mission- oder Chunk-Mode)
    └── NEIN: Ist die Definition of Done als gradebare Rubrik formulierbar?
            ├── JA → Cloud Execution Profile (Outcome-Session, fire-and-forget)
            └── NEIN → Zurueck zu Phase 1 — ohne pruefbare DoD kein autonomer Run
```

Typische Cloud-Faelle: Overnight-Runs, Migrationen mit klarer Rubrik, wiederkehrende
Wartungsauftraege (Dependency-Bumps, Lint-Kampagnen), CI-getriggerte Fixes.

## Setup (einmalig) — Agent + Environment als YAML im Repo

Agents sind persistente, versionierte Objekte: **einmal erstellen, ID speichern,
pro Run nur eine Session starten.** Nie `agents.create()` im Hot Path.

```yaml
# blueprint-builder.agent.yaml
name: Blueprint Builder
model: claude-fable-5
system: |
  Du bist Build-Agent nach dem Agentic Blueprint. Befolge AGENTIC-BLUEPRINT.md
  im gemounteten Repo: Tests fuer Kernlogik, keine Packages juenger als 14 Tage,
  keine hartcodierten Secrets, kein Merge — du arbeitest auf dem Feature-Branch.
tools:
  - type: agent_toolset_20260401
```

```sh
AGENT_ID=$(ant beta:agents create < blueprint-builder.agent.yaml --transform id -r)
ENV_ID=$(ant beta:environments create --name blueprint-env \
  --config '{type: cloud, networking: {type: unrestricted}}' --transform id -r)
# IDs in config/.env persistieren — Updates via: ant beta:agents update --version N
```

## Pro Run: Session + Outcome

Der Phase-1-Plan **ist** die Rubrik — die Definition-of-Done-Checkliste wird 1:1
zu gradebaren Kriterien („CSV hat numerische `price`-Spalte", nicht „Daten sehen
gut aus").

```python
session = client.beta.sessions.create(
    agent=AGENT_ID,
    environment_id=ENV_ID,
    title="Feature X — Mission",
    resources=[{
        "type": "github_repository",
        "url": "https://github.com/<org>/<repo>",
        "authorization_token": os.environ["GITHUB_TOKEN"],
        "checkout": {"type": "branch", "name": "feature/x"},
    }],
)

# Outcome STATT user.message — der Agent startet mit Empfang der Rubrik
client.beta.sessions.events.send(
    session_id=session.id,
    events=[{
        "type": "user.define_outcome",
        "description": "<Mission aus dem Phase-1-Plan>",
        "rubric": {"type": "text", "content": PLAN_DOD_ALS_MARKDOWN},
        "max_iterations": 5,   # Blueprint-Konvention: 5 (analog Build-Test-Loop)
    }],
)
```

Stream oeffnen **bevor** das Outcome gesendet wird; Abbruch-Gate: `session.status_idle`
mit `stop_reason.type != "requires_action"` oder `session.status_terminated` —
nicht auf das blanke `idle` brechen.

## Blueprint-Regeln im Cloud-Profil (nicht verhandelbar)

1. **Rubrik = Phase-1-Output.** Keine Session ohne reviewten Plan. Vage Rubriken
   erzeugen teure, verrauschte Grader-Loops.
2. **`max_iterations` = Loop-Limit** der entsprechenden Phase (Build: 5, Review: 7).
3. **`max_iterations_reached` / `failed` = Eskalation an den Menschen** — wie jeder
   Loop-Abbruch. Kein zweites Outcome „einfach nochmal probieren".
4. **Kein Merge ohne Human-Go.** Der Agent pusht den Branch; PR-Erstellung und Merge
   bleiben beim Menschen (oder laufen durch Phase 4/5 lokal).
5. **Kosten beobachten:** `span.model_request_end.model_usage` liefert dieselben
   Token-Felder wie die Observer-Pipeline; Fable-5-Raten siehe
   [pricing.ts](../../observer/src/collector/pricing.ts).

## Referenzen

- Anthropic Docs: Managed Agents Overview / Define Outcomes / Sessions
  (`platform.claude.com/docs/en/managed-agents/`)
- Verwandt im Blueprint: [agent-teams.md](agent-teams.md) (lokales Pendant),
  [02-building.md](../phases/02-building.md) (Mission-Mode),
  [review-fix-loop.md](../loops/review-fix-loop.md) (Loop-Semantik)
