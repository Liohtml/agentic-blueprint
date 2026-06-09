/**
 * observer/src/collector/inboxParser.ts
 *
 * Parses agent inbox files from ~/.claude/teams/{team}/inboxes/*.json.
 *
 * Key design points (from DATA-NOTES.md §B):
 *  - The filename (basename without .json) IS the recipient `to` — there is
 *    NO `to` field in the JSON.
 *  - `timestamp` is an ISO-8601 string in the raw file; we convert it to
 *    Unix milliseconds via Date.parse().
 *  - Most inboxes are empty arrays — this is tolerated silently.
 *  - The raw JSON contains a `type` field ("message") that is not part of
 *    the Message contract and is intentionally dropped.
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'
import type { CommEdge, Message } from '../types.ts'

// ---------------------------------------------------------------------------
// Internal types (raw file shape)
// ---------------------------------------------------------------------------

/** Raw shape of one entry inside an inboxes/*.json file (DATA-NOTES §B). */
interface RawMessage {
  from: string
  text: string
  summary: string
  /** ISO-8601 string — NOT Unix ms. */
  timestamp: string
  color?: string
  /** Always "message" in practice; ignored in output. */
  type?: string
  read?: boolean
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the default teams base directory: `~/.claude/teams`.
 * Never hardcodes `/Users/…`.
 */
export function defaultTeamsDir(): string {
  return path.join(os.homedir(), '.claude', 'teams')
}

/**
 * Parse all inbox messages for a team.
 *
 * Reads every `{teamsBaseDir}/{teamId}/inboxes/*.json` file.
 * Non-`.json` files are skipped. Unreadable or malformed files are skipped
 * silently. Missing or inaccessible inbox directories return `[]`.
 *
 * @param teamId       Team directory name (e.g. `"konzept-review"`).
 * @param teamsBaseDir Root of all team directories. Defaults to
 *                     `~/.claude/teams`. Override in tests to point at
 *                     `fixtures/teams`.
 */
export async function parseMessages(
  teamId: string,
  teamsBaseDir: string = defaultTeamsDir(),
): Promise<Message[]> {
  const inboxesDir = path.join(teamsBaseDir, teamId, 'inboxes')

  let files: string[]
  try {
    files = await fs.readdir(inboxesDir)
  } catch {
    // Directory doesn't exist or isn't readable → empty result.
    return []
  }

  const messages: Message[] = []

  for (const file of files) {
    if (!file.endsWith('.json')) continue

    const recipient = path.basename(file, '.json')
    const filePath = path.join(inboxesDir, file)

    let raw: RawMessage[]
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const parsed: unknown = JSON.parse(content)
      if (!Array.isArray(parsed)) continue
      raw = parsed as RawMessage[]
    } catch {
      // Unreadable or malformed JSON → skip this inbox.
      continue
    }

    for (const msg of raw) {
      messages.push({
        from: msg.from,
        to: recipient,
        text: msg.text,
        summary: msg.summary,
        timestamp: Date.parse(msg.timestamp),
        color: msg.color,
        read: msg.read,
      })
    }
  }

  return messages
}

/**
 * Build directed communication edges from a flat list of messages.
 *
 * Aggregates a `{from, to, count}` entry for every unique ordered
 * (sender → recipient) pair. Direction is significant: alpha→beta and
 * beta→alpha are distinct edges.
 *
 * @param messages  Array produced by `parseMessages` (or any `Message[]`).
 */
export function buildEdges(messages: Message[]): CommEdge[] {
  const map = new Map<string, CommEdge>()

  for (const msg of messages) {
    const key = `${msg.from}\x00${msg.to}`
    const existing = map.get(key)
    if (existing !== undefined) {
      existing.count += 1
    } else {
      map.set(key, { from: msg.from, to: msg.to, count: 1 })
    }
  }

  // Return in deterministic order (stable sort by from, then to).
  return Array.from(map.values()).sort((a, b) => {
    const cmp = a.from.localeCompare(b.from)
    return cmp !== 0 ? cmp : a.to.localeCompare(b.to)
  })
}
