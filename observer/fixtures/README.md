# fixtures/

Sample data files for unit tests and manual development.

Place static JSON snapshots here that mirror the real `~/.claude/` directory structure.
Parsers and metrics modules should accept a configurable `baseDir` so tests can point at this directory instead of `~/.claude`.

## Suggested layout

```
fixtures/
  teams/
    demo/
      config.json          # TeamInfo shape
      inboxes/
        team-lead.json     # Message[] shape
        worker-a.json
  tasks/
    demo/
      1.json               # Task shape
      2.json
  projects/
    -Users-demo-project/
      abc123.jsonl         # transcript lines (assistant, user, system, …)
```

All fixture data must be **anonymised** — no real names, email addresses, or API keys.
