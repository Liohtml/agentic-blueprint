# Phase 5: Merge & Validate

## Purpose
Final human check, merge, and validation that nothing broke.

## Who
- **Human:** Gives the final go and merges
- **Agent:** Pre-merge checks, post-merge validation

## Input
- PR with review score 5/5 from Phase 4

## Process

1. **Human reviews the PR one last time** — final look at the diff
2. **Pre-merge checks by the agent:**
   - CI green?
   - Branch up-to-date with main?
   - No merge conflicts?
3. **Human merges** — the agent does NOT do this on its own
4. **Post-merge validation:**
   - Deployment successful? (if applicable)
   - No regressions in monitoring/logs?
   - Feature works in staging/production?

## Gate
- [ ] PR merged
- [ ] Deployment successful (if applicable)
- [ ] No regressions in monitoring/logs
- [ ] Feature works as expected

## Output
Shipped feature

## Afterwards
- [Run a retro](../meta/retro-template.md) (recommended after every larger feature)
- Adapt the Blueprint if needed (see [how-to-adapt.md](../meta/how-to-adapt.md))
