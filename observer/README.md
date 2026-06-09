# Observer

Real-time dashboard for Claude Code multi-agent teams.

Reads local Claude Code files (`~/.claude/teams/`, `~/.claude/tasks/`, `~/.claude/projects/`) and streams live metrics to a web UI via SSE.

## Quick Start

```bash
cd observer
npm install
npm run observe        # build + start server on :4317 + open browser
```

Or from the repo root: `./scripts/observe.sh --team <name>`.

## Development

```bash
npm run dev            # start server (tsx watch) + vite HMR in parallel
npm run typecheck      # tsc --noEmit
npm test               # vitest
```

## Architecture

```
observer/
  bin/
    observe.ts         # CLI entry point: observe [--team NAME] [--port N] [--no-open]
  src/
    types.ts           # shared TypeScript contract (READ-ONLY after scaffold — everything imports from here)
    server.ts          # Node http + SSE backend (no Express), serves web build + /events stream
    collector/         # data pipeline (tests co-located as *.test.ts):
                       #   teamParser, taskParser, inboxParser, transcriptParser  — file parsers
                       #   pricing, metrics, aggregator                           — token aggregation + cost
                       #   watcher                                                — fs.watch-based change detection
  web/
    src/               # Vite + React + Tailwind + uPlot frontend
      components/      #   AgentGrid, AgentCard, charts/ (token/cost/tasks/messages)
      lib/             #   useSnapshot (SSE client hook), mockSnapshot
  fixtures/            # anonymized sample data (teams/, tasks/, projects/) for vitest
```

## Ports

| Service | Port |
|---------|------|
| Server (SSE + static) | 4317 |
| Vite dev server | 5173 |

## Notes

- **Verify prices** — token pricing in `src/collector/pricing.ts` is non-authoritative. Check current rates before sharing cost figures.
- Never hardcode `~` or `/Users/<name>` — paths resolve via `os.homedir()`.
- The `[1m]` suffix on model names must be stripped before pricing lookup.
