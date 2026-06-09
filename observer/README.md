# Observer

Real-time dashboard for Claude Code multi-agent teams.

Reads local Claude Code files (`~/.claude/teams/`, `~/.claude/tasks/`, `~/.claude/projects/`) and streams live metrics to a web UI via SSE.

## Quick Start

```bash
cd observer
npm install
npm run observe        # build + start server on :4317 + open browser
```

## Development

```bash
npm run dev            # start server (tsx watch) + vite HMR in parallel
npm run typecheck      # tsc --noEmit
npm test               # vitest
```

## Architecture

```
observer/
  src/
    types.ts           # shared contract (READ-ONLY after T1 — all teammates import from here)
    server/            # Node http + SSE collector (T2–T8)
    parsers/           # file parsers: team, tasks, inbox, transcript (T2–T5)
    metrics/           # token aggregation + cost (T6)
    watcher/           # fs.watch aggregator (T7)
  web/
    src/               # Vite + React + Tailwind + uPlot frontend (T9, T10)
    dist/              # vite build output (git-ignored)
  fixtures/            # sample data for tests and Storybook
```

## Ports

| Service | Port |
|---------|------|
| Server (SSE + static) | 4317 |
| Vite dev server | 5173 |

## Notes

- `PRICES PRÜFEN` — token pricing in `src/metrics/pricing.ts` is non-authoritative. Verify before sharing cost figures.
- Never hardcode `~` or `/Users/<name>` — paths resolve via `os.homedir()`.
- The `[1m]` suffix on model names must be stripped before pricing lookup.
