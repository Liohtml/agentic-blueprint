# Cleanup-Verify Loop

## Phase
Phase 3: Structure Cleanup

## Trigger
Refactoring has been applied to the code.

## Flow

```
Iteration = 0

LOOP:
  1. Apply refactoring step
  2. Run all tests
  3. All tests green AND functionality unchanged?
     - YES → More duplicates/structure problems?
       - YES → Iteration += 1, next refactoring step → GOTO LOOP
       - NO → EXIT LOOP (success)
     - NO → rollback of the last step, Iteration += 1
  4. Iteration > 3?
     - YES → EXIT LOOP (abort)
     - NO → GOTO LOOP
```

## Max Iterations
3

## Token Budget (optional, API)

In addition to the hard iteration limit, a **Task Budget** can be set per loop run:
`output_config: {task_budget: {type: "tokens", total: N}}`
(beta header `task-budgets-2026-03-13`, minimum 20,000). The model sees a
running token countdown and prioritizes/finishes on its own. Soft limit —
the iteration limit remains the hard abort.

## On Success
Continue to Phase 4 (Review Loop)

## On Abort
1. Rollback of ALL refactoring steps that broke tests
2. The original code from Phase 2 remains in place
3. Document which refactorings failed and why
4. Continue to Phase 4 with the original code (cleanup is nice-to-have, not a blocker)

## Important
- NO functionality changes — structure only
- Each refactoring step is verified individually
- On rollback: revert cleanly, do not "fix" on top of the fix
