# Build-Test Loop

## Phase
Phase 2: Building

## Trigger
Code for a Chunk has been written.

## Flow

```
Iteration = 0

LOOP:
  1. Run / build the code
  2. Run the tests
  3. All tests green?
     - YES → EXIT LOOP (success)
     - NO → Iteration += 1
  4. Iteration > 5?
     - YES → EXIT LOOP (abort)
     - NO → analyze errors, apply fix → GOTO LOOP
```

## Max Iterations
5

## Token Budget (optional, API)

In addition to the hard iteration limit, a **Task Budget** can be set per loop run:
`output_config: {task_budget: {type: "tokens", total: N}}`
(beta header `task-budgets-2026-03-13`, minimum 20,000). The model sees a
running token countdown and prioritizes/finishes on its own. Soft limit —
the iteration limit remains the hard abort.

## On Success
Continue to Phase 3 (Structure Cleanup)

## On Abort
1. Document:
   - Which tests fail
   - Which errors occur
   - What has already been tried (all 5 approaches)
2. Create a comment/issue with this context
3. STOP — no further trial and error
4. Wait for the human's decision

## Common Causes of Abort
- Wrong approach chosen (architecture problem, not a code problem)
- Missing dependency or API understanding
- Chunk too large / touches too many files
- Context not precise enough
