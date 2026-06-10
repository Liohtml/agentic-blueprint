# Post-Feature Retro

> Run this retro after every larger feature or sprint.
> Goal: continuously improve the Blueprint.

**Feature:** <name>
**Date:** <YYYY-MM-DD>
**Agents involved:** <Claude Code, teammates, ...>
**Duration:** <how long the feature took>

---

## What Went Well?

- <What worked right away?>
- <Which prompts were effective?>
- <Where was the Chunk size exactly right?>

## What Went Badly?

- <Where did the agent loop without progress?>
- <Where was the context too much or too little?>
- <Which phase took unexpectedly long?>
- <Were there collisions between agents?>

## Surprises

- <What was unexpected — positive or negative?>
- <Which assumptions were wrong?>

## Numbers

| Metric | Value |
|--------|-------|
| Chunks planned | |
| Chunks executed | |
| Build-Test Loop average (iterations) | |
| Cleanup-Verify Loop average | |
| Review-Fix Loop average | |
| Escalations to the human | |
| Final review scores | |
| Total cost (USD, from the Observer) | |
| Model mix (share Fable/Opus/Sonnet/Haiku) | |

## Blueprint Adjustments

> What should be changed in the Blueprint based on this experience?

- [ ] Adjust prompt templates: <which, why>
- [ ] Adjust loop limits: <which loop, new limit, why>
- [ ] Adjust Gate checklists: <which Gate, what to add/remove>
- [ ] Sharpen agent roles: <which agent, what to change>
- [ ] New phase/loop needed? <describe>

## Persisting Learnings

> Learnings that should influence future runs do not belong only in this doc —
> they must land where agents read them automatically.

- [ ] `CLAUDE.md` / `AGENTS.md` updated (project-specific rules)
- [ ] Blueprint change proposed as a PR (framework-wide rules)
- [ ] Agent memory updated (memory tool or memory store), so agents
      find the learnings themselves in the next session

## Conclusion

<1-2 sentences: What is the most important insight?>
