# Cloud Execution Profile — Managed Agents + Outcomes

> Alternative execution path for Phases 2–4: instead of local tmux Teammates, the
> build runs as a **managed-agent session** on Anthropic's infrastructure — with an
> **outcome rubric** against which an independent grader evaluates every iteration.
> Status: Anthropic beta (`managed-agents-2026-04-01`). Local Agent Teams
> ([agent-teams.md](agent-teams.md)) remain the default for interactive work.

## Why this fits the Blueprint

Our Review-Fix Loop is conceptually identical to Anthropic's outcome mechanism:
iterate → grade → revise, with `max_iterations` as the hard limit. The difference:
with an outcome, the loop runs server-side, and the grader has its **own
context window** — structurally enforced "no self-review".

| Blueprint concept | Managed-agents counterpart |
|---|---|
| Phase 1 plan + Definition of Done | `user.define_outcome` with rubric (`description` + `rubric`) |
| Review-Fix Loop (max 7) | Grader loop (`max_iterations`, default 3, max 20) |
| Loop abort → Escalation | `result: max_iterations_reached` / `failed` → session idle, human takes over |
| No self-review | Grader = separate context window, by design |
| No merge without Human Go | Session writes to a feature branch; PR/merge stays with the human |
| File Ownership / isolation | Container per session, repo mounted via `github_repository` resource |
| Agent Observer | Session events (`span.model_request_end.model_usage`) + console UI |

## When cloud, when local?

```
Build is pending (Phase 2)
    |
    v
Do you need interaction during the run (sparring, course correction)?
    ├── YES → Local: Agent Teams / Claude Code (Mission or Chunk Mode)
    └── NO: Can the Definition of Done be formulated as a gradeable rubric?
            ├── YES → Cloud Execution Profile (outcome session, fire-and-forget)
            └── NO → Back to Phase 1 — no autonomous run without a verifiable DoD
```

Typical cloud cases: overnight runs, migrations with a clear rubric, recurring
maintenance jobs (dependency bumps, lint campaigns), CI-triggered fixes.

## Setup (one-time) — Agent + Environment as YAML in the Repo

Agents are persistent, versioned objects: **create once, store the ID,
start only one session per run.** Never `agents.create()` in the hot path.

```yaml
# blueprint-builder.agent.yaml
name: Blueprint Builder
model: claude-fable-5
system: |
  You are a build agent following the Agentic Blueprint. Follow AGENTIC-BLUEPRINT.md
  in the mounted repo: tests for core logic, no packages younger than 14 days,
  no hardcoded secrets, no merging — you work on the feature branch.
tools:
  - type: agent_toolset_20260401
```

```sh
AGENT_ID=$(ant beta:agents create < blueprint-builder.agent.yaml --transform id -r)
ENV_ID=$(ant beta:environments create --name blueprint-env \
  --config '{type: cloud, networking: {type: unrestricted}}' --transform id -r)
# Persist IDs in config/.env — updates via: ant beta:agents update --version N
```

## Per Run: Session + Outcome

The Phase 1 plan **is** the rubric — the Definition of Done checklist becomes
gradeable criteria 1:1 ("CSV has a numeric `price` column", not "data looks
good").

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

# Outcome INSTEAD of user.message — the agent starts upon receiving the rubric
client.beta.sessions.events.send(
    session_id=session.id,
    events=[{
        "type": "user.define_outcome",
        "description": "<Mission from the Phase 1 plan>",
        "rubric": {"type": "text", "content": PLAN_DOD_AS_MARKDOWN},
        "max_iterations": 5,   # Blueprint convention: 5 (matching the Build-Test Loop)
    }],
)
```

Open the stream **before** the outcome is sent; abort Gate: `session.status_idle`
with `stop_reason.type != "requires_action"` or `session.status_terminated` —
do not break on the bare `idle`.

## Blueprint Rules in the Cloud Profile (non-negotiable)

1. **Rubric = Phase 1 output.** No session without a reviewed plan. Vague rubrics
   produce expensive, noisy grader loops.
2. **`max_iterations` = the loop limit** of the corresponding phase (build: 5, review: 7).
3. **`max_iterations_reached` / `failed` = Escalation to the human** — like any
   loop abort. No second outcome to "just try again".
4. **No merge without Human Go.** The agent pushes the branch; PR creation and merge
   stay with the human (or go through Phases 4/5 locally).
5. **Watch the costs:** `span.model_request_end.model_usage` delivers the same
   token fields as the Observer pipeline; for Fable 5 rates see
   [pricing.ts](https://github.com/Liohtml/agentic-blueprint/blob/master/observer/src/collector/pricing.ts).

## References

- Anthropic docs: Managed Agents Overview / Define Outcomes / Sessions
  (`platform.claude.com/docs/en/managed-agents/`)
- Related in the Blueprint: [agent-teams.md](agent-teams.md) (local counterpart),
  [02-building.md](../phases/02-building.md) (Mission Mode),
  [review-fix-loop.md](../loops/review-fix-loop.md) (loop semantics)
