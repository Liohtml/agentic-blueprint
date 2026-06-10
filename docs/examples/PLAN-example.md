# Feature Plan: `export --json` command for tally

> Artifact from the [worked example](worked-example.md), Phase 1. Written with
> [PLAN.md.template](../../blueprint/templates/PLAN.md.template).

**Created:** 2026-06-10
**Status:** approved
**Requirement:** [SPEC-example.md](SPEC-example.md)

---

## Scope

Add `tally export --json <file> [--month YYYY-MM]` to the tally CLI. JSON only,
no overwrite of existing files, behavior statements 1–5 of the SPEC. Nothing else.

## Success Criteria

Condensed from the SPEC's Acceptance Criteria (full check commands live in the SPEC):

- `npm test` exits 0, including new tests covering behaviors 1–5
- Seeded store (3 expenses) exports to a parseable JSON array of length 3, exit 0
- Pre-existing target file: exit 1, file byte-identical (`cmp`)
- `--month 2026-05` on a two-month store exports only the 2026-05 records

## Execution Mode

**Chunk Mode.** Three chunks across 7 files is below the threshold where
Mission Mode pays off: the coordination overhead (two thread switches, two small
context reloads) is cheaper than Fable 5's 2× price premium for a feature this size.

## Shared Contracts

> Read-only during Phase 2.

- Expense record shape from `src/store.js`:
  `{ id: string, date: "YYYY-MM-DD", amount: number /* integer cents */, category: string, note?: string }`
- Export service signature: `exportExpenses(expenses, { month? }) -> string`
  (returns the JSON text; file I/O stays in the command layer)

---

## Chunks

### Chunk 1: Export service (pure logic)

**Files:** `src/services/export.js`, `test/export-service.test.js`
**Agent:** Claude Code
**Depends on:** none
**Parallelizable:** no
**Done criterion:** `exportExpenses` returns a JSON array string for a given
expense list; honors the optional month filter; returns `[]` for empty/no-match
input; unit tests for all three cases green.

### Chunk 2: CLI command and file handling

**Files:** `src/commands/export.js`, `src/cli.js`, `test/export-command.test.js`
**Agent:** Claude Code
**Depends on:** Chunk 1
**Parallelizable:** no
**Done criterion:** `tally export` wired into the CLI dispatch; behaviors 1–5
of the SPEC each covered by at least one test; full suite green; error paths
exit 1 with a one-line stderr message.

### Chunk 3: Docs and end-to-end verification

**Files:** `README.md`, `test/e2e-export.test.js`
**Agent:** Claude Code
**Depends on:** Chunk 2
**Parallelizable:** no
**Done criterion:** README documents the command and the raw-cents convention;
e2e test runs the real CLI against a temp `HOME` and executes the three
command-level Acceptance Criteria checks (AC 2–4; AC 1 is `npm test` itself
and is verified by the suite being green); suite green.

---

## Dependency Graph

```
Chunk 1 ──► Chunk 2 ──► Chunk 3
```

No parallelization in this feature — the chain is strictly sequential.
