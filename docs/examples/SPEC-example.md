# Spec: `export --json` command for tally

> Artifact from the [worked example](worked-example.md), Phase 0. Written with
> [SPEC.md.template](../../blueprint/templates/SPEC.md.template). The project
> (`tally`, a small expense-tracker CLI) is fictional but realistic.

**Date:** 2026-06-10 · **Author:** Alex · **Status:** approved
**Phase 0 source:** Phase 0 sparring transcript (see [worked-example.md](worked-example.md#phase-0--ideation--scoping))

---

## Problem & Goal

Expenses recorded with `tally` are locked inside its private store file
(`~/.tally/expenses.json`); there is no supported way to get them into other tools
(spreadsheets, scripts, tax software). Goal: a machine-readable export of the
expense data to a file the user names, optionally restricted to one month.

## In Scope

- New command `tally export --json <file>`
- Optional `--month YYYY-MM` filter (same semantics as `tally list --month`)
- Refusal to overwrite an existing target file
- Clean error behavior: non-zero exit code plus a one-line stderr message

## Out of Scope

- CSV or any other export format (JSON only; CSV is a possible later feature)
- Importing data back into tally
- An `--force` / overwrite flag (refusing is enough for v1)
- Date-range filters beyond a single month
- Streaming output / large-file performance work (store is one small JSON file)

## Behavior

1. When `tally export --json <file>` is run, the system writes all expenses as a
   JSON array to `<file>` and exits 0.
2. When `--month YYYY-MM` is given, the system exports only expenses whose `date`
   falls in that month.
3. When `<file>` already exists, the system writes nothing, prints
   `error: <file> already exists` to stderr, and exits 1.
4. When the store is empty or no expense matches the filter, the system writes
   `[]` and exits 0.
5. When the `--month` value is not of the form `YYYY-MM`, the system prints a
   usage message to stderr and exits 1.

## Constraints

- **Tech stack:** Node 20, plain JavaScript (ESM), built-in `node:test` runner
- **Forbidden:** no new runtime dependencies; the expense record shape in
  `src/store.js` is read-only
- **Performance:** none (store size is bounded by personal use)

## Acceptance Criteria

- [ ] `npm test` exits 0, including new tests covering behaviors 1–5
- [ ] On a store seeded with 3 expenses, `node src/cli.js export --json /tmp/out.json`
      exits 0 and `node -e "const a=JSON.parse(require('fs').readFileSync('/tmp/out.json'));process.exit(a.length===3?0:1)"`
      exits 0
- [ ] With a pre-existing target file, `export` exits 1 and `cmp` confirms the
      file content is byte-identical to before the run
- [ ] On a store seeded with expenses in 2026-04 and 2 expenses in 2026-05,
      `export --json /tmp/may.json --month 2026-05` exits 0 and
      `node -e "const a=JSON.parse(require('fs').readFileSync('/tmp/may.json'));process.exit(a.length===2&&a.every(e=>/^2026-05/.test(e.date))?0:1)"`
      exits 0

## Open Questions

- Amounts are stored as integer cents. Export raw cents or a formatted decimal
  string? — Owner: Alex — Decision: **raw cents**. The export is
  machine-oriented; formatting is the importer's job. Documented in the README
  so nobody mistakes `1250` for €1250.

---

**Approval checklist** (checked as part of the existing Phase 0 gate — this is
not an additional gate): all Open Questions resolved, every Acceptance Criterion
binary-checkable, human has set Status to `approved`.
