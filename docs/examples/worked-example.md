# Worked Example: One Feature Through All Six Phases

This is a complete, honest run of the blueprint on one small feature. The project
is fictional but realistic: **tally**, a Node.js expense-tracker CLI (`tally add`,
`tally list`, JSON store in `~/.tally/`, no runtime dependencies, `node:test` for
tests). The feature: a new **`export --json <file>`** command.

The run includes the parts that usually get edited out: a failed build-test
iteration, a cleanup that had to touch a file outside the chunk plan, and a
review finding that was rejected rather than fixed.

Conventions: **Human** blocks are copy-paste-ready prompts, consistent with the
prompt templates in [blueprint/phases/](../../blueprint/phases/). **Agent** blocks
are abridged real-style outputs — `[...]` marks cuts. Each phase ran in a fresh
thread, as the [phase rules](../../AGENTIC-BLUEPRINT.md#phase-overview) require.

Artifacts produced along the way: [SPEC-example.md](SPEC-example.md) ·
[PLAN-example.md](PLAN-example.md)

---

## Phase 0 — Ideation & Scoping

New thread. The human starts with the sparring prompt from
[00-ideation.md](../../blueprint/phases/00-ideation.md).

**Human:**

> I have the following idea: tally (this repo) should be able to export my
> expenses so I can use them in other tools.
>
> Help me sharpen it:
> 1. What is the core problem being solved?
> 2. What should explicitly NOT be in scope?
> 3. Which success criteria would show that it works?
> 4. Do you see technical risks or ambiguities?
>
> Be critical. Question assumptions.

**Agent (abridged):**

> The core problem is data lock-in, not "export" — your expenses live in a private
> store file with no supported way out. Before I propose criteria, three things are
> ambiguous:
>
> 1. **Format.** "Other tools" could mean spreadsheets (CSV) or scripts (JSON).
>    Supporting both doubles the surface for v1.
> 2. **Selection.** All expenses, or filtered? `tally list` already has `--month`.
> 3. **Target file exists.** Overwrite silently, refuse, or prompt?

**Human:**

> JSON only — my immediate need is a script, CSV can come later. Month filter yes,
> same semantics as `list --month`, nothing fancier. Existing file: refuse with an
> error. No --force flag for now.

**Agent (abridged):**

> Then the scope is: `tally export --json <file> [--month YYYY-MM]`, refuse to
> overwrite, JSON array output. One more ambiguity: amounts are stored as integer
> cents. Exporting raw cents is faithful but `1250` will be misread as 1250 by
> anyone who doesn't know. Exporting formatted strings is friendlier but lossy.
> This is a data-contract decision — yours, not mine.

**Human:**

> Raw cents. The export is for machines; the README should state the convention.
> That decision and this scope go into a SPEC — fill out
> `blueprint/templates/SPEC.md.template` with what we just agreed. Mark the
> cents question as resolved.

The agent produced [SPEC-example.md](SPEC-example.md). The human read it, fixed
one behavior statement (the agent had written "handles invalid `--month` input" —
a vague verb the template forbids; it became "prints a usage message to stderr
and exits 1"), and set Status to `approved`.

**Gate (Phase 0):**

- [x] Problem statement is clear and specific
- [x] Scope is explicitly limited (CSV, import, `--force`, ranges all excluded)
- [x] At least 2 measurable success criteria defined (4 acceptance criteria)
- [x] Human is satisfied with the sharpness of the requirement

---

## Phase 1 — Planning

New thread. Context given: the SPEC and the planning prompt from
[01-planning.md](../../blueprint/phases/01-planning.md).

**Human:**

> Analyze the requirement: docs/examples/SPEC-example.md
>
> Create a plan with numbered Chunks.
> Each Chunk must:
> - Be implementable in a fresh context window
> - Touch at most 3-5 files
> - Have a clear "done" criterion
> - State which files are created/changed
>
> If the plan has more than 8 Chunks: propose how to reduce the scope.
> Mark dependencies between Chunks. Mark which Chunks are parallelizable.
> Also propose the execution mode (Chunk vs Mission) with one sentence of reasoning.

**Agent (abridged):**

> Three chunks: (1) pure export service + unit tests, (2) CLI wiring + file
> handling + command tests, (3) README + end-to-end test that literally executes
> the SPEC's acceptance-criteria check commands. Strictly sequential — 2 needs
> the service signature, 3 needs the working command. Shared contract: the
> expense record shape from `src/store.js` and the service signature
> `exportExpenses(expenses, { month? }) -> string`, both read-only in Phase 2.
>
> **Mode: Chunk Mode.** Three chunks across ~6 files is below the point where
> Mission Mode pays off — the coordination overhead of two thread switches is
> cheaper than Fable 5's 2× price premium for a feature this size.

The human made one change: the agent had put file I/O into the service; the human
moved it to the command layer ("the service stays pure — easier to test, and the
exists-check belongs next to the error message"). Result: [PLAN-example.md](PLAN-example.md).

**Gate (Phase 1):**

- [x] Plan has at most 8 Chunks (3)
- [x] Each Chunk has max 3-5 files
- [x] Each Chunk has a clear done criterion
- [x] Dependencies are marked (1 → 2 → 3)
- [x] Shared Contracts are defined (record shape, service signature)
- [x] Execution mode set (Chunk)
- [x] Human has reviewed and approved the plan

---

## Phase 2 — Building

One fresh thread per chunk. Chunk 1 completed in a single build-test iteration
(service + 3 unit tests, green on first run) — not shown. **Chunk 2 is shown in
full because its build-test loop did not pass on the first try.**

**Human (new thread):**

> Implement Chunk 2 from the plan: docs/examples/PLAN-example.md
>
> Reference: src/cli.js, src/commands/list.js (for the dispatch pattern),
> src/services/export.js (Chunk 1 output — read-only), the Shared Contracts
> section of the plan.
> Done criterion: export wired into CLI dispatch; SPEC behaviors 1-5 each covered
> by at least one test; full suite green; error paths exit 1 with a one-line
> stderr message.
>
> Rules:
> - Write tests for the core logic
> - Do not install packages younger than 14 days
> - No hardcoded secrets
> - If you are stuck after 5 attempts: STOP and report the blocker

**Agent — build-test loop, iteration 1 (abridged):**

> Implemented `src/commands/export.js` (arg parsing, exists-check, write) and
> registered it in `src/cli.js`. Wrote 5 tests in `test/export-command.test.js`,
> one per SPEC behavior. Running the suite:
>
> ```
> ✔ exports all expenses to the target file (exit 0)
> ✔ honors --month filter
> ✖ refuses to overwrite an existing file
>     AssertionError: expected exit code 1, got 0
> ✔ writes [] for an empty store
> ✔ rejects malformed --month with usage message
> # tests 13, pass 12, fail 1
> ```
>
> Analysis: the command detects the existing file and prints
> `error: out.json already exists` to stderr, but then simply `return`s. The
> dispatch in `cli.js` ignores return values, so the process exits 0. The file
> is untouched (correct), but the exit code violates SPEC behavior 3 — and the
> stderr message alone would let calling scripts silently treat a failed export
> as success.
>
> Fix: set `process.exitCode = 1` in the error path of `export.js` (same pattern
> the malformed-`--month` path already used — that's why test 5 passed).

**Agent — iteration 2:**

> ```
> # tests 13, pass 13, fail 0
> ```
>
> Suite green. Loop exit after 2 iterations (1 failed). Done criterion met.

Chunk 3 (README section incl. the raw-cents note, e2e test executing the four
acceptance-criteria check commands against a temp `HOME`) passed on the first
iteration — not shown.

**Gate (Phase 2, after Chunk 3):**

- [x] Done criteria of all chunks fulfilled
- [x] All new functions have at least one test
- [x] All tests green (`npm test`: 19 pass / 0 fail)
- [x] No hardcoded secrets/credentials
- [x] No packages younger than 14 days installed (no packages at all)
- [x] Feature works locally (e2e test + manual run)

---

## Phase 3 — Structure Cleanup

New thread, cleanup prompt from [03-cleanup.md](../../blueprint/phases/03-cleanup.md).
This phase is never skipped, and here it found something real.

**Agent (abridged):**

> Scanned the diff of `feature/export-json` against main. One genuine duplicate:
> `src/services/export.js` filters by month with its own
> `e.date.startsWith(month + "-")` logic — but `src/commands/list.js` has carried
> nearly identical inline filtering since before this feature.
>
> Proposed refactoring: extract `filterByMonth(expenses, month)` into a new
> `src/services/filters.js`; both `export.js` and `list.js` call it. No behavior
> change. **Note:** `list.js` is outside the chunk plan's file list — flagging
> this instead of doing it silently.

**Human:**

> Approved including list.js — deduplication across the old command is the point
> of this phase. Structure only, verify after the step.

**Agent — cleanup-verify loop, iteration 1:**

> Extracted `filterByMonth`, replaced both call sites. `npm test`: 19 pass /
> 0 fail. No further duplicates found in the diff. Loop exit after 1 iteration.

**Gate (Phase 3):**

- [x] No duplicated logic blocks across files
- [x] Reusable logic extracted into a service layer (`src/services/filters.js`)
- [x] All existing tests still green
- [x] Diff touches at most the files from the Chunk plan — **checked with one
      documented exception:** `src/commands/list.js`, explicitly approved by the
      human above
- [x] No functionality change — structure only

---

## Phase 4 — Review Loop

PR opened from `feature/export-json` (+212 / −9 across 7 files), PR template
filled. Review by a **second Claude Code agent in its own thread** (Option B in
[04-review-loop.md](../../blueprint/phases/04-review-loop.md)) — the build agent
never reviews itself.

**Review agent (abridged):**

> **Score: 4/5.** Two findings.
>
> 1. **[major]** `export.js` handles the file-exists case, but an actual write
>    failure (e.g. target directory does not exist:
>    `export --json /no/such/dir/out.json`) throws an unhandled `ENOENT` — the
>    user gets a raw stack trace. Exit code is incidentally non-zero, but the
>    behavior is untested and the output is noise, inconsistent with the
>    one-line-stderr convention the SPEC sets for error paths.
> 2. **[minor]** The exporter loads the whole store into memory and serializes
>    in one `JSON.stringify`. Consider streaming for large stores.

**Build agent (new thread, prompt from the phase doc) — iteration 1:**

> Finding 1 — **justified.** The SPEC doesn't list this path explicitly, but its
> error convention (one-line stderr + exit 1) clearly covers it. Fixed: wrapped
> the write in try/catch, print `error: cannot write <file>: <reason>`, set
> `process.exitCode = 1`; added a test using a nonexistent target directory.
> Suite: 20 pass / 0 fail. Pushed.
>
> Finding 2 — **rejected, with comment on the PR:** the store is one small JSON
> file that every existing command already reads fully into memory; the SPEC
> explicitly sets no performance constraint and lists large-file work as out of
> scope. Streaming would add complexity with no measurable benefit. If store
> size ever becomes a problem, it affects all commands and deserves its own
> Phase 0.

**Review agent — iteration 2:**

> Fix for finding 1 verified (code + new test). Rejection of finding 2 is
> well-reasoned and consistent with the SPEC's scope. **Score: 5/5.**

**Gate (Phase 4):**

- [x] Review score 5/5
- [x] CI pipeline green
- [x] No open review comments left unanswered (finding 2 answered, not ignored)
- [x] Branch is up-to-date with main

---

## Phase 5 — Merge & Validate

**Agent (pre-merge checks):** CI green · branch up-to-date with main · no merge
conflicts.

**Human:** read the final diff one last time (+218 / −9, 8 files — small enough
to actually read, which is the point of chunking), then merged. The agent does
not merge on its own.

**Agent (post-merge validation, abridged):**

> Ran `tally export --json /tmp/check.json` against the real store on main:
> exit 0, output parses, 47 records — matches `tally list | wc -l`. Re-ran the
> existing-file case: exit 1, file untouched. No deployment applies (local CLI).

**Gate (Phase 5):**

- [x] PR merged
- [x] Deployment successful — n/a (local CLI)
- [x] No regressions (full suite on main: 20 pass / 0 fail)
- [x] Feature works as expected (manual post-merge run above)

---

## What to take away

- **The cheap decisions happened early.** The raw-cents question cost one
  sentence in Phase 0; discovered mid-build it would have been an agent guess or
  a rework. The SPEC's Open Questions section exists for exactly this.
- **The failed iteration was caught by the loop, not by the human.** A wrong
  exit code is invisible in manual testing and fatal for scripts — a binary
  acceptance criterion ("exit 1, file unchanged via `cmp`") made it a red test
  instead of a production surprise.
- **Cleanup found real debt because it's unskippable.** The month-filter
  duplication predated the feature; the never-skip rule surfaced it before
  review, so the review could stay about correctness — and the out-of-plan file
  was escalated, not silently touched.
- **Rejecting a review finding is a normal outcome.** The streaming suggestion
  was declined in one paragraph — defensible only because the SPEC's Out of
  Scope section had already drawn that line. Without it, the rejection is just
  an opinion.
- **Human time concentrated at the gates.** Roughly 25 minutes total across five
  gates (sparring, SPEC read, plan trim, cleanup approval, final diff + merge);
  everything between gates ran in loops with hard iteration limits.

**Next step after a run like this:** a short retro with
[retro-template.md](../../blueprint/meta/retro-template.md) — e.g. "the exit-code
miss suggests adding 'error paths set `process.exitCode`' to this project's
CLAUDE.md" is exactly the kind of learning that should outlive the feature.
