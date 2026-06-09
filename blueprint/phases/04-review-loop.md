# Phase 4: Review Loop

## Purpose
Automated review cycle until the code meets quality standards.

## Who
- **Review agent:** Greptile, second Claude Code agent, or manual (see config.md)
- **Build agent:** Fixes based on feedback
- **Human:** Intervenes on loop abort

## IMPORTANT
An agent NEVER reviews itself. The review must always come from a separate instance.

## Input
- Cleanly structured code from Phase 3
- Feature branch ready for PR

## Process

1. **Create PR** with the PR template (see templates/PR-TEMPLATE.md)
2. **Wait for review** — automatic or manual
3. **Read and evaluate feedback**
4. **Apply fixes and push**
5. **Wait for new review**
6. **Repeat until score 5/5 or manual approval**

## Agent Prompt (build agent after review)

```
Read the review feedback on PR #<NO>.

For each finding:
1. Analyze whether it is justified
2. If yes: fix it and briefly explain what you changed
3. If no: comment why you consider it unjustified

Push all fixes.
Wait for a new review.
Repeat until score 5/5.

Max 7 iterations. After that: STOP and escalate to the human.
```

## Review-Fix Loop

See: [review-fix-loop.md](../loops/review-fix-loop.md)

Max 7 iterations.

## Review Agent Options

### Option A: Greptile (external)
- Automatic review on every push to the PR
- Confidence scores 1-5
- Agent reads feedback via the GitHub API / PR comments

### Option B: Second Claude Code agent
- Started in its own thread/worktree
- Reads the diff of the PR
- Writes a structured review with findings and severity
- Advantage: no external tool, full control

Which option is used is stated in `blueprint/config.md`.

## Gate
- [ ] Review score 5/5 or explicit human approval
- [ ] CI pipeline green
- [ ] No open review comments left unanswered
- [ ] Branch is up-to-date with main

## Output
PR ready to merge

## Next
[Phase 5: Merge & Validate](05-merge.md)
