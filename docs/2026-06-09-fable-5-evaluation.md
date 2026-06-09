# Fable 5 — Neubewertung des Agentic Blueprint (2026-06-09)

> Anlass: Anthropic hat am 09.06.2026 **Claude Fable 5** released — das erste öffentlich
> verfügbare Mythos-Klasse-Modell. Dieses Dokument bewertet, was das für unser Blueprint
> bedeutet: was bleibt, was wir lockern, was wir streichen, was wir integrieren.

---

## TL;DR

Fable 5 macht **kein einziges Strukturelement des Blueprints obsolet** — aber es verschiebt
die Default-Parameter. Die Phasen, Gates und Loops bleiben unser Differenzierer (sie lösen
das Vertrauens-Problem, nicht das Fähigkeits-Problem). Was sich ändert: das Modell-Tiering
bekommt eine Stufe nach oben (Fable) und eine nach unten (Haiku), die Chunk- und
Kontext-Regeln werden für Fable-Runs gelockert („Mission-Mode"), und drei API-Features
(Effort, Task Budgets, Outcomes) sind native Pendants zu Dingen, die wir bisher per
Prompt-Disziplin erzwingen.

---

## 1 · Faktenlage Fable 5

| Eigenschaft | Wert |
|---|---|
| Model-ID | `claude-fable-5` (Claude Code Agent-Tool: `model: "fable"`) |
| Preis | **$10 / $50 pro MTok** (exakt 2× Opus 4.8); Cache-Read 0.1× |
| Kontext / Output | 1M Kontext, 128K Output (Streaming nötig) |
| SWE-Bench-Pro | **80.3%** (GPT-5.5: 58.6%, Gemini 3.1 Pro: 54.2%) |
| Long-Horizon | Codebase-weite Migration in einer 50-Mio-Zeilen-Ruby-Codebase an einem Tag (manuell: >2 Monate Team-Arbeit) |
| API-Surface | Wie Opus 4.7/4.8: nur adaptive Thinking; `temperature`/`top_p`/`top_k` entfernt; Prefills → 400. **Neu:** explizites `thinking: {type: "disabled"}` → 400 (Param weglassen) |
| Effort | `low`–`max`; `xhigh` ist Sweet-Spot für Coding/Agentic |
| Safety | Cyber-/Bio-/Distillation-Anfragen werden automatisch an Opus 4.8 umgeleitet (mit Hinweis) |

Aktuelle Modellpalette und Preise (pro MTok, in/out):

| Modell | ID | Preis | Rolle im Tiering |
|---|---|---|---|
| Fable 5 | `claude-fable-5` | $10 / $50 | Lead, Mission-Chunks, kritische Migrationen |
| Opus 4.8 | `claude-opus-4-8` | $5 / $25 | Harte Logik, Parser, Algorithmik |
| Sonnet 4.6 | `claude-sonnet-4-6` | $3 / $15 | Standard: Scaffold, UI, CRUD, Tests |
| Haiku 4.5 | `claude-haiku-4-5` | $1 / $5 | Explore-Subagents, mechanische Massen-Edits |

---

## 2 · Bewertung der Blueprint-Bestandteile

| Bestandteil | Urteil | Begründung |
|---|---|---|
| **6-Phasen-Modell + binäre Gates** | ✅ Behalten | Die Gates lösen das *Vertrauens*-Problem (kein Merge ohne Human-Go), nicht das Fähigkeits-Problem. Je autonomer das Modell, desto wertvoller die Checkpoints. |
| **Feedback-Loops mit Iterations-Limits** | ✅ Behalten, ergänzen | Limits bleiben. Neu: **Task Budgets** (`output_config.task_budget`, beta) sind das API-native Pendant — das Modell sieht einen Token-Countdown und moderiert sich selbst. Loop-Limit = harte Grenze, Task Budget = weiche Grenze. |
| **Agent Teams (tmux + Observer)** | ✅ Behalten, aufwerten | Unser stärkstes Asset. Der **Lead gehört auf Fable 5** — Long-Horizon-Koordination ist exakt Fables Paradedisziplin. Teammates bleiben getiert. |
| **Modell-Tiering (Opus/Sonnet)** | 🔧 Erweitern | 2 Stufen → **4 Stufen** (Fable/Opus/Sonnet/Haiku) plus **Effort als zweite Dimension** (gleicher Agent, anderer Aufwand pro Task). Fable nur gezielt: 2× Opus-Preis. |
| **Chunk-Regel (max 3-5 Dateien)** | 🔧 Lockern | Bleibt Default für Sonnet-Teammates. Für Fable-Runs neu: **Mission-Chunks** — eine vollständige Spezifikation im ersten Turn, klare Definition of Done, Effort `high`/`xhigh`. Mikro-Chunking eines 80%-SWE-Bench-Pro-Modells ist Koordinations-Overhead ohne Qualitätsgewinn. |
| **Kontext-Regeln (max 30% füllen, ab 70% neuer Thread)** | 🔧 Lockern | Bei 1M Kontext + serverseitiger Compaction sind die Prozentzahlen überholt. Als *Hygiene-Prinzip* behalten („nicht alles laden"), die harten Schwellen streichen. |
| **`npx open-source` für Dependencies** | ⬇️ Herabstufen | Von Pflicht zu Fallback. `web_fetch`/`grep` direkt im 1M-Kontext + Tool Search decken den Use-Case nativ ab. |
| **Antigravity als Sekundär-Agent** | ⬇️ Herabstufen | Profil B (Review) ist durch einen zweiten Claude-Agent / `/code-review` vollständig ersetzbar. Profil A (UI) und C (Orchestrator) als optionale Profile behalten, aber nicht mehr als Kern-Rolle führen. |
| **Review-Loop (max 7 Iterationen)** | ✅ Behalten, Erwartung anpassen | Fable 5 fixt deutlich öfter one-shot. Limit bleibt als Sicherheitsnetz; bei >3 Iterationen mit Fable ist das Problem fast sicher die Spezifikation, nicht das Modell. |
| **Observer (`observer/`)** | ✅ Behalten, Daten fixen | Pricing-Tabelle war falsch (Opus 4.8 mit $15/$75 statt $5/$25) und kannte Fable 5 nicht — in dieser Welle korrigiert. |
| **Prompt-Sprache (`CRITICAL`, `MUST`)** | ⬇️ Audit nötig | Fable/Opus 4.8 folgen Instruktionen literal — aggressive Trigger-Sprache führt zu Overtriggering. Templates auf normale Imperative umstellen. |

---

## 3 · Was wir neu integrieren (Reihenfolge = Priorität)

1. **4-Stufen-Modell-Tiering + Effort-Dimension** *(in dieser Welle umgesetzt)*
   Fable für Lead + Mission-Chunks, Opus für harte Logik, Sonnet Standard, Haiku für
   Explore/Massen-Edits. Effort pro Task statt pauschal: `xhigh` für Mission-Chunks,
   `high` Standard, `low` für Subagents.

2. **Mission-Mode in Phase 2** *(Welle 2)*
   Für Fable-Runs: volle Task-Spec im ersten Turn (Fables Long-Horizon-Stärke hängt
   direkt an der Spezifikationsqualität — exakt unser Phase-0/1-Output), großzügiges
   `max_tokens`, optional Task Budget. Die Phase-1-Plan-Templates liefern bereits alles,
   was eine Mission braucht — sie müssen nur als *ein* Prompt statt 8 Chunks ausgespielt
   werden.

3. **Task Budgets als Loop-Ergänzung** *(Welle 2)*
   `output_config: {task_budget: {type: "tokens", total: N}}` (beta-Header
   `task-budgets-2026-03-13`, min. 20K) in die Loop-Spezifikationen aufnehmen:
   weiche Token-Grenze pro Loop-Durchlauf, hartes Iterations-Limit bleibt.

4. **Outcome-graded Loops via Managed Agents** *(Welle 3, strategisch)*
   Unser Review-Fix-Loop ist konzeptionell identisch mit `user.define_outcome` +
   Grader-Rubrik (iterate → grade → revise, max_iterations). Ein „Cloud Execution
   Profile" des Blueprints, das Phase 2–4 als Managed-Agent-Session mit Outcome-Rubrik
   fährt, wäre die konsequente Weiterentwicklung — die Phase-1-Pläne *sind* die Rubriken.

5. **Memory Stores für Retro-Learnings** *(Welle 3)*
   Das Retro-Template produziert Learnings, die heute im Markdown versanden.
   Memory Stores (`memstore_*`) bzw. das Memory-Tool persistieren sie modell-lesbar
   über Sessions hinweg — Fable 5 ist explizit stark darin, eigene Notizen zu nutzen.

---

## 4 · Taktische Roadmap

| Welle | Status | Inhalt |
|---|---|---|
| **1 — Quick Wins** | ✅ umgesetzt (dieser Branch) | Observer-Pricing fixen (+ Fable 5), Tiering-Tabellen in `agent-teams.md` + `team-prompt.md`, Modell-Entscheidungsbaum, Changelog v1.2, dieses Dokument |
| **2 — Mission-Mode** | ✅ umgesetzt (dieser Branch, v1.3) | Mission-Mode in `02-building.md` + Modus-Wahl in Phase 1 + Entscheidungsbaum, Kontext-Regeln in `AGENTIC-BLUEPRINT.md` entschärft, Task Budgets in allen drei Loop-Specs, `npx open-source` zu Fallback degradiert, Review-Baum auf `/code-review` + zweiten Agent modernisiert, Retro um Kosten-Metriken + Learnings-Persistenz erweitert. Prompt-Sprache-Audit: keine aggressive Trigger-Sprache gefunden — keine Änderung nötig. |
| **3 — Strategisch** | teilweise umgesetzt | ✅ Cloud Execution Profile (`blueprint/agents/managed-agents.md`) — Outcome-Rubriken als serverseitiges Pendant zum Review-Fix-Loop. ✅ Memory-Persistenz als Retro-Pflichtschritt. Offen: Observer um Effort/Task-Budget-Anzeige erweitern (braucht verifizierte Transcript-Datenformen, siehe `observer/DATA-NOTES.md`-Prozess). |

**Positionierung:** Die Frontier-Modelle kommodifizieren das *Bauen*. Was nicht
kommodifiziert wird: Spezifikationsqualität, Vertrauens-Gates, Kosten-Steuerung und
Beobachtbarkeit paralleler Agents. Genau das ist unser Repo. Fable 5 ist kein Risiko
für das Blueprint — es ist der Beweis, dass die verbleibende Engineering-Arbeit genau
hier liegt.

---

## Quellen

- [Claude Fable 5 and Claude Mythos 5 — Anthropic](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Anthropic releases Mythos-like AI model to the public — CNBC](https://www.cnbc.com/2026/06/09/anthropic-mythos-claude-fable-5.html)
- [Claude Fable 5 on AWS — Amazon](https://aws.amazon.com/blogs/aws/anthropic-claude-fable-5-on-aws-mythos-class-capabilities-with-built-in-safeguards-now-available/)
- [Claude Fable 5: What It Means for Developers — Cosmic](https://www.cosmicjs.com/blog/claude-fable-5-what-it-is-what-it-means-for-developers)
- Anthropic API-Dokumentation (Modellkatalog, Migration Guide, Task Budgets, Managed Agents Outcomes), Stand 2026-06
