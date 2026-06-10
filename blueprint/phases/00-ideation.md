# Phase 0: Ideation & Scoping

## Purpose
Understand the problem, define the scope, set success criteria.

## Who
- **Human:** Drives the ideation, makes all decisions
- **Agent:** Sparring partner, checks feasibility, asks clarifying questions

## Input
- Idea, feature request, bug report, or business requirement

## Process

1. **Formulate the problem:** What exactly should be solved? (Not the solution, the problem.)
2. **Limit the scope:** What is NOT part of it? List explicitly.
3. **Define success criteria:** How do you know the feature is done?
4. **Feasibility check:** Have the agent verify the scope is realistic.

## Agent Prompt for Sparring

```
I have the following idea: <IDEA>

Help me sharpen it:
1. What is the core problem being solved?
2. What should explicitly NOT be in scope?
3. Which success criteria would show that it works?
4. Do you see technical risks or ambiguities?

Be critical. Question assumptions.
```

## Gate
- [ ] Problem statement is clear and specific
- [ ] Scope is explicitly limited (what is NOT included)
- [ ] At least 2 measurable success criteria defined
- [ ] Human is satisfied with the sharpness of the requirement

## Output
Documented problem statement with scope and success criteria. Can be informal or in an issue/ticket.
If the feature will clearly need multiple work units (more than ~3 files, more than 2 acceptance criteria, or more than a day of work), consider formalizing this output with the [SPEC template](../templates/SPEC.md.template) — see [spec-driven-development.md](https://github.com/Liohtml/agentic-blueprint/blob/master/docs/spec-driven-development.md) for when it pays off and when an issue suffices.

## Next
[Phase 1: Planning](01-planning.md)
