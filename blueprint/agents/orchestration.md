# Orchestration — Deterministic Multi-Agent Patterns (Fable 5)

> Patterns for running multi-agent work as a **deterministic script or procedure**
> instead of ad-hoc prompting. When control flow matters — fan-out over a known
> list, verification gates, loops with exit conditions — the orchestrator should
> be code (or a written procedure followed literally), and the agents should be
> its function calls.

## Where this sits

Three mechanisms exist for multi-agent work; the canonical comparison table lives
in [agent-teams.md](agent-teams.md) — this doc does not duplicate it.

- **Subagent** (Agent tool, one-shot): a single delegated task with a returned result.
- **Workflow script** (deterministic orchestration, where available in Claude Code):
  code decides who runs when; agents are called like functions.
- **Agent Team**: live sessions with shared task list and messages, humans watching.

**Decision guidance:**

- One self-contained task to delegate → **subagent**.
- Control flow must be deterministic — fan-out over a known list, verification
  gates, loops with exit conditions → **workflow script** (the patterns below).
- Work is exploratory and humans watch and steer live → **agent team**
  ([agent-teams.md](agent-teams.md)); for fire-and-forget cloud runs with a
  gradeable rubric, see [managed-agents.md](managed-agents.md).

This doc adds **patterns**, not team-sizing guidance — how many agents a given
job deserves is an open community task and deliberately not covered here.

## Pattern catalog

> Skeletons below are JS-like pseudocode. Exact APIs vary by harness version;
> the patterns are tool-agnostic — port them to whatever spawn/await primitive
> your setup offers.

### 1. Fan-out / pipeline

Run each item through its stages **independently** — no global barrier between
stages. A barrier ("wait for all of stage 1 before any stage 2") is only
justified when a stage genuinely needs *all* prior results: deduplication,
early-exit on zero findings, cross-item comparison. Otherwise it just makes
the slowest item block every other item's progress.

```js
// Per-item pipeline: no global barrier
const results = await Promise.all(items.map(async (item) => {
  const found   = await agent(`research ${item}`);
  const checked = await agent(`verify, fresh context: ${found}`);
  return checked;
}));

// Barrier variant — only when a stage needs ALL prior results
const all = await Promise.all(items.map((i) => agent(`research ${i}`)));
const deduped = dedupe(all);                 // cross-item work justifies the barrier
if (deduped.length === 0) return;            // early exit on zero findings
```

### 2. Adversarial verification

For each finding, spawn N independent verifiers whose prompt is to **refute**
it; keep only findings that survive a majority. This generalizes the
blueprint's devil's-advocate gate and Phase 4's rule that *an agent never
reviews itself*: the finder's confidence is worthless as evidence, so the
check must come from fresh contexts with an incentive to disagree.

```js
async function survives(finding, n = 3) {
  const votes = await Promise.all(range(n).map(() =>
    agent(`Try to REFUTE this finding. Return {refuted: bool, reason}: ${finding}`)));
  return votes.filter((v) => !v.refuted).length > n / 2;
}
const confirmed = [];
for (const f of findings) if (await survives(f)) confirmed.push(f);
```

**Variant — perspective-diverse lenses:** instead of N identical refuters, one
verifier per lens (correctness / security / reproducibility). Fewer agents,
broader coverage; use it when failure modes differ by dimension rather than
by chance.

### 3. Judge panel

For wide solution spaces — design, naming, approach choices — one attempt is a
sample, not an answer. Run N independent attempts from *different angles*,
have independent judges score them, and synthesize from the winner.

```js
const attempts = await Promise.all(angles.map((a) =>
  agent(`Solve the task from this angle: ${a}`)));
const scores = await Promise.all(attempts.map((att) =>
  agent(`Judge on the rubric, return {score, weaknesses}: ${att}`)));   // judge ≠ author
const winner = attempts[argmax(scores)];
return agent(`Synthesize the final version from the winner,
              fixing the judges' noted weaknesses: ${winner}`);
```

### 4. Loop-until-dry

For unknown-size discovery (bugs, gaps, dead links), a fixed count of finder
rounds misses the tail. Keep spawning finders until **K consecutive rounds
return nothing new**. Crucial detail: deduplicate against everything **seen**,
not just everything confirmed — otherwise findings rejected by verification
resurface every round and the loop never dries out.

```js
const seen = new Set();                       // everything SEEN, incl. rejected
const confirmed = [];
let dry = 0, round = 0;
while (dry < K && round++ < MAX_ROUNDS) {     // iteration limit = hard abort
  const found = await agent(`find more issues; already seen: ${[...seen]}`);
  const fresh = found.filter((f) => !seen.has(f.id));
  fresh.forEach((f) => seen.add(f.id));
  const kept = await verify(fresh);           // pattern 2
  confirmed.push(...kept);
  dry = fresh.length === 0 ? dry + 1 : 0;
}
```

### 5. The improvement-cycle pipeline

The composite pattern this repo runs on — the continuous improvement cycle as
a deterministic sequence (loop spec:
[improvement-loop.md](../loops/improvement-loop.md)):

1. **Research** — fan-out research agents (pattern 1) return structured findings.
2. **Devil's advocate** — adversarial gate (pattern 2) over the proposed plan;
   only `approve` / `approve-with-fixes` items proceed.
3. **Parallel implementation** — one agent per disjoint file set (strict file
   ownership, see [coordination.md](coordination.md)); implementation agents
   run **no git commands** — the orchestrator commits.
4. **Verification** — tests plus a fresh-context reviewer; then the human gate.

```js
const findings  = await fanOut(researchPrompts);            // pattern 1
const plan      = await devilsAdvocate(findings);           // pattern 2 gate
const reports   = await Promise.all(plan.workPackages.map(  // disjoint file sets
  (wp) => agent(`implement ${wp}; touch ONLY ${wp.files}; run NO git commands`)));
await verifyAndTest(reports);                               // fresh context
// orchestrator commits; human approves the merge
```

## Structured result contracts

Subagent results should be **machine-checkable envelopes, not prose** — the
orchestrator branches on them, so they must parse. Three canonical shapes:

**Research finding** (research → DA stage):

```json
{ "id": "F-012", "claim": "…", "source": "file/URL", "proposed_action": "…", "confidence": 0.8 }
```

**DA verdict** — this is the canonical definition; other docs reference this shape:

```json
{ "verdict": "approve | approve-with-fixes | reject",
  "findings": [ { "severity": "blocker | major | minor", "problem": "…", "fix": "…" } ] }
```

**Implementation report** (implement → verification stage):

```json
{ "files_written": ["…"], "tests_run": "cd observer && npx vitest run",
  "result": "pass | fail", "open_questions": ["…"] }
```

Scope note: these are machine contracts *between pipeline stages*; human-readable
phase-handoff documents are a separate, community-reserved template task — see
[coordination.md](coordination.md) for the handoff artifact list.

## Scaling knobs

- **Token budgets bound loop depth** — as in the loop specs, budgets are soft
  signals; the iteration limit remains the hard abort.
- **Effort and model tier per stage:** low tiers for mechanical stages
  (finders, bulk edits), top tier for verify/judge stages — a cheap judge makes
  the whole panel worthless. For tiers, effort levels, and prices, reference
  [decision-trees.md](../meta/decision-trees.md); they are not restated here.

## Safety rules

> **Non-negotiable, regardless of pattern:**
>
> - Orchestrated subagents never run git commands — the **orchestrator commits**.
> - An agent never verifies its own output — verifiers and judges get **fresh
>   context** (Phase 4: "an agent never reviews itself").
> - **Human gates are never delegated to a script:** merge approval, scope
>   changes, deletions, and outward-facing actions stay with the human
>   ([coordination.md](coordination.md): the human is the conductor).
