# Phase 3: Structure Cleanup

## Purpose
Clean up the code after the build. Eliminate duplicates, build service layers, optimize the structure for the next agent pass.

## Who
- **Agent:** Performs the cleanup autonomously
- **Human:** Only intervenes on Escalation

## IMPORTANT
This phase is NEVER skipped. Even if the code "looks good".

## Input
- Code from Phase 2 on a feature branch

## Process

1. **Start a new thread** — clean context window
2. **Analysis:** Agent scans the changed code for duplicates and missing structure
3. **Refactoring:** Extract reusable logic into a service layer
4. **Cleanup-Verify Loop:** After each refactoring, check that all tests are still green
5. **Check the Gate**

## Agent Prompt

```
Analyze the code that was changed in this feature branch.

Find:
- Duplicated logic across multiple files
- Missing service-layer abstractions
- Code that would be hard to understand in future sessions
- Functions that are implemented similarly in several places

Refactor into reusable modules.
Do NOT change any functionality — structure only.

After each refactoring step: check that all tests are still green.
If a test breaks: roll back the last step.
Max 3 iterations.
```

## Cleanup-Verify Loop

See: [cleanup-verify-loop.md](../loops/cleanup-verify-loop.md)

Max 3 iterations. On abort: rollback, the original remains.

## Gate
- [ ] No duplicated logic blocks across files
- [ ] Reusable logic extracted into a service layer
- [ ] All existing tests still green
- [ ] Diff touches at most the files from the Chunk plan
- [ ] No functionality change — structure only

## Output
Cleanly structured code, ready for review

## Next
[Phase 4: Review Loop](04-review-loop.md)
