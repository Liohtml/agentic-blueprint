# Projekt-Konfiguration

> Fuell diese Datei aus bevor du das Blueprint nutzt.
> Der Agent liest diese Datei um projektspezifische Entscheidungen zu treffen.

## Projekt

- **Name:** <PROJEKTNAME>
- **Beschreibung:** <1-2 Saetze was das Projekt macht>
- **Tech-Stack:** <z.B. Next.js, Svelte, FastAPI, ...>
- **Repository:** <GitHub URL>

## Agents

- **Primaer-Agent:** Claude Code
- **Sekundaer-Agent (optional):** <Antigravity | keiner>
- **Antigravity-Profil:** <A: UI/Design | C: Orchestrator | nicht genutzt>
- **Review-Tool:** </code-review Skill + Zweiter Claude Code Agent | Greptile | Manuell>
- **Modell-Tiering:** Fable 5 (Lead/Mission) · Opus (harte Logik) · Sonnet (Standard) · Haiku (Explore)
- **Default-Effort:** <xhigh fuer Mission-Chunks | high Standard | low fuer Subagents>

## Verzeichnis-Zuweisungen

> Welcher Agent ist fuer welche Verzeichnisse zustaendig?
> Agents arbeiten nie an denselben Dateien gleichzeitig.

- **Claude Code:** <z.B. src/lib/, src/api/, src/services/, tests/>
- **Antigravity:** <z.B. src/components/, src/ui/, src/layouts/>
- **Shared (read-only in Phase 2):** <z.B. src/types/, src/contracts/>

## Konventionen

- **Branch-Prefix:** feature/
- **Branch-Format:** feature/<chunk-nr>-<agent>-<beschreibung>
- **Commit-Style:** <conventional commits | freeform>
- **Max Chunks pro Plan:** 8

## Dependencies via Open-Source (Fallback)

> Default: Dependency-Source direkt via grep/read/web_fetch laden.
> Diese Liste nur fuer Repos, die der Agent nicht lokal oder per web_fetch erreicht.

- <github-url-1>
- <github-url-2>
