# Review-Fix Loop

## Phase
Phase 4: Review Loop

## Trigger
A PR has been created and review feedback is available.

## Flow

```
Iteration = 0

LOOP:
  1. Read review feedback
  2. For each finding:
     a. Justified? → apply fix
     b. Unjustified? → write a comment explaining why
  3. Push fixes
  4. Wait for new review
  5. Score >= 5/5 or manual approval?
     - YES → EXIT LOOP (success)
     - NO → Iteration += 1
  6. Iteration > 7?
     - YES → EXIT LOOP (abort)
     - NO → GOTO LOOP
```

## Max Iterations
7

> With Fable 5 on a Mission as the build agent, one-shot fixes are the norm. If the loop still
> runs >3 iterations, the problem is almost certainly in the specification or
> an architecture conflict — escalate earlier instead of looping on.

## Token Budget (optional, API)

In addition to the hard iteration limit, a **Task Budget** can be set per loop run:
`output_config: {task_budget: {type: "tokens", total: N}}`
(beta header `task-budgets-2026-03-13`, minimum 20,000). The model sees a
running token countdown and prioritizes/finishes on its own. Soft limit —
the iteration limit remains the hard abort.

## On Success
Continue to Phase 5 (Merge & Validate)

## On Abort
1. Document:
   - Current review findings that could not be resolved
   - What was changed in each attempt
   - Suspected reason why the score is not improving
2. Escalate to the human
3. STOP — the human takes over manual review and decides

## Common Causes of Abort
- PR too large (>500 lines of diff) — hard for reviewers
- Architecture feedback requiring larger rework
- Contradictory findings between iterations
- Review agent has different conventions than the project
