# Observer — Real Data Notes (LEAD-owned, READ-ONLY for teammates)

> These are the **verified, real** shapes of Claude Code's local files as of 2026-06-09,
> derived from the live `konzept-review` team. **Build against THESE, not the idealized
> ULTRAPROMPT schema** where they differ. Differences are flagged ⚠️.
> This file is owned by the Lead. Do not edit it. `observer/src/types.ts` (T1) is the contract.

## Paths
- Team config:  `~/.claude/teams/{team}/config.json`
- Inboxes:      `~/.claude/teams/{team}/inboxes/{agentName}.json`
- Tasks:        `~/.claude/tasks/{team}/{n}.json`  (+ `.lock`, `.highwatermark` → ignore)
- Transcripts:  `~/.claude/projects/{encoded-cwd}/{sessionId}.jsonl`
  - `encoded-cwd` = the cwd with `/` and `.` replaced by `-` (e.g. `/Users/lionel/fitness-coach` → `-Users-lionel-fitness-coach`).

Resolve `~` via `os.homedir()`. Never hardcode `/Users/lionel`.

## A) config.json (REAL)
```jsonc
{
  "name": "konzept-review",
  "description": "...",
  "createdAt": 1781011170854,            // ms epoch
  "leadAgentId": "team-lead@konzept-review",
  "leadSessionId": "d4e9e7cb-0d31-4bb0-a8a3-c95e168fb40c",
  "members": [
    {
      "agentId": "team-lead@konzept-review",
      "name": "team-lead",
      "agentType": "team-lead",
      "model": "claude-opus-4-8[1m]",     // may carry a [1m] suffix → strip for pricing lookup
      "joinedAt": 1781011170854,          // ms epoch
      "tmuxPaneId": "",                    // ⚠️ often EMPTY
      "cwd": "/Users/lionel/fitness-coach",
      "subscriptions": []
    }
  ]
}
```
⚠️ **Differences from ULTRAPROMPT:** members have NO `color`, NO `prompt`, NO `isActive`,
NO `sessionId`. Extra field: `subscriptions`. The live team lists **only 1 member** even
though 4 agents exist. **T2 must treat members[] as a partial hint** and union it with
agents discovered from inboxes (B) and transcripts (D). Assign colors deterministically
if absent (hash name → palette). Derive `isActive` from transcript recency (D), not config.

## B) inboxes/{name}.json (REAL)
Array of messages. **The filename IS the recipient.** ⚠️ There is NO `to` field.
```jsonc
[
  {
    "from": "advocatus",
    "text": "architekt — Deal, voll dabei. ...",   // full body
    "summary": "Deal angenommen: ...",               // short preview
    "timestamp": "2026-06-09T13:26:25.826Z",         // ISO string (NOT ms)
    "color": "yellow",                               // sender's color
    "type": "message",
    "read": false
  }
]
```
Most inboxes are `[]`. T4: `parseMessages(team)` reads every `inboxes/*.json`, sets
`to = basename(file, ".json")`, `from = msg.from`, parses `timestamp` → ms.
Build comm edges as `{from, to, count}`.

## C) tasks/{team}/{n}.json
⚠️ The live `konzept-review` task dir contains ONLY `.lock` — **zero task files**.
So for the live demo the task board is legitimately empty. Build the parser against the
documented shape (and fixtures), tolerate an empty dir, skip `.lock`/`.highwatermark`/
non-`{n}.json` files. Expected shape:
```jsonc
{ "id": "1", "subject": "...", "description": "...",
  "status": "pending|in_progress|completed",
  "owner": "ux",                 // may be "" / absent
  "blocks": ["2"], "blockedBy": [] }
```
(See other dirs under `~/.claude/tasks/*` for real non-empty examples if needed.)

## D) transcripts {sessionId}.jsonl (REAL — the crux, T5)
One JSON object per line. Many line `type`s: `mode`, `permission-mode`,
`file-history-snapshot`, `attachment`, `user`, `last-prompt`, `ai-title`,
`assistant`, `system`. **Only `type:"assistant"` lines carry usage.**

Assistant line:
```jsonc
{
  "parentUuid": "...", "isSidechain": false, "type": "assistant",
  "uuid": "...", "timestamp": "2026-06-09T13:26:09.610Z", // ISO
  "requestId": "...", "cwd": "/Users/lionel/fitness-coach",
  "sessionId": "...", "version": "...", "gitBranch": "main",
  "message": {
    "model": "claude-opus-4-8",        // ⚠️ pricing key lives HERE, per-message
    "id": "...", "type": "message", "role": "assistant",
    "content": [ {"type":"thinking"|"text"|"tool_use", ...} ],
    "stop_reason": "...",
    "usage": {
      "input_tokens": 11744,
      "output_tokens": 1100,
      "cache_creation_input_tokens": 2643,
      "cache_read_input_tokens": 17337,
      "server_tool_use": { "web_search_requests": 0, "web_fetch_requests": 0 },
      "service_tier": "standard",
      "cache_creation": { "ephemeral_1h_input_tokens": 2643, "ephemeral_5m_input_tokens": 0 }
    }
  }
}
```
- **tool_use** detection: iterate `message.content[]`, where `c.type === "tool_use"`, tool name = `c.name`, input = `c.input`.
- **currentActivity** = name of the LAST tool_use seen (most recent assistant line with a tool_use). Fallback: "thinking"/"responding".
- **lastActiveAt** = max assistant `timestamp`.
- **errorCount** heuristic: count `type:"system"` lines whose content mentions error, OR
  tool_result lines with `is_error:true` (look in `user` lines' content[] where
  `type:"tool_result"` and `is_error===true`). Document whatever you implement.
- Incremental read: track byte offset per file; on poll, `fs.read` from offset to EOF,
  split on `\n`, keep a trailing partial-line buffer. Re-stat for size; if file shrank
  (rotation), reset offset to 0.

### Agent → session mapping (VERIFIED method — better than cwd+joinedAt)
For each `{sessionId}.jsonl` under the team's project dir(s):
- The **lead** session = `config.leadSessionId`.
- A **teammate** session's FIRST `type:"user"` message body starts with:
  `<teammate-message teammate_id="team-lead">\nDu bist "{NAME}"` → extract `{NAME}`.
  Regex: `/Du bist "([^"]+)"/`. This yields ux / architekt / advocatus directly.
- Project dir for a team = encode each member `cwd`. Live team cwd = `/Users/lionel/fitness-coach`.
  All 4 sessions live in `-Users-lionel-fitness-coach`.

Verified live mapping (ground truth for the Lead's final verification):
| session (prefix) | agent | model | in/out/cacheCreate/cacheRead |
|---|---|---|---|
| d4e9e7cb | team-lead  | claude-opus-4-8 | 55785/74981/359868/3678142 |
| 2a640adb | architekt  | claude-opus-4-8 | 41591/73846/570191/2309408 |
| 4167e65a | ux         | claude-opus-4-8 | 31582/54941/545809/2528322 |
| 87d27919 | advocatus  | claude-opus-4-8 | 46072/57926/446085/2831416 |

## Pricing (T6) — NON-AUTHORITATIVE, must be clearly marked "PREISE PRÜFEN"
Per-MTok rates, editable table keyed by normalized model id (strip `[1m]` etc.).
cache_read is cheapest, cache_creation (write) is a premium over input. Provide entries for
claude-opus-4-8, claude-sonnet-4-6, claude-haiku-4-5; default fallback for unknown models
(and log once). computeCost(usage, model) = input*inRate + output*outRate +
cache_creation_input_tokens*cacheWriteRate + cache_read_input_tokens*cacheReadRate, all /1e6.
