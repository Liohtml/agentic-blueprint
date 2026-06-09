/**
 * observer/src/collector/taskParser.ts
 *
 * Parses task JSON files from `~/.claude/tasks/{teamId}/` into Task[].
 *
 * Rules (per DATA-NOTES.md §C):
 *  - Only files matching /^\d+\.json$/ are processed.
 *  - `.lock`, `.highwatermark`, and any other non-numeric filename are silently skipped.
 *  - A missing or empty directory returns [].
 *  - Status values outside the union are normalised to 'pending'.
 *  - Missing `blocks` / `blockedBy` default to [].
 *  - Missing `owner` defaults to "".
 *  - Results are sorted ascending by numeric task id.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import type { Task } from '../types.js'

/** Matches filenames that are purely decimal digits followed by `.json`. */
const TASK_FILE_RE = /^\d+\.json$/

/**
 * Coerce an arbitrary value to the Task `status` union.
 * Anything that isn't `"in_progress"` or `"completed"` maps to `"pending"`.
 */
function normalizeStatus(raw: unknown): Task['status'] {
  if (raw === 'in_progress' || raw === 'completed') return raw
  return 'pending'
}

/**
 * Read all task JSON files from `dir`, parse and normalise them, then return
 * the list sorted by ascending numeric id.
 *
 * Exported separately from `parseTasks` so tests can point at fixture dirs
 * instead of `~/.claude/tasks/`.
 */
export async function parseTasksFromDir(dir: string): Promise<Task[]> {
  let entries: string[]
  try {
    entries = await fs.promises.readdir(dir)
  } catch (err: unknown) {
    // Tolerate a missing directory — the live konzept-review dir has no task
    // files and may not exist on other machines.
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }

  const tasks: Task[] = []

  for (const entry of entries) {
    if (!TASK_FILE_RE.test(entry)) continue

    const filePath = path.join(dir, entry)
    const raw = await fs.promises.readFile(filePath, 'utf-8')
    const obj = JSON.parse(raw) as Record<string, unknown>

    tasks.push({
      id: obj.id != null ? String(obj.id) : path.basename(entry, '.json'),
      subject: String(obj.subject ?? ''),
      description: String(obj.description ?? ''),
      status: normalizeStatus(obj.status),
      owner: obj.owner != null ? String(obj.owner) : '',
      blocks: Array.isArray(obj.blocks)
        ? (obj.blocks as unknown[]).map(String)
        : [],
      blockedBy: Array.isArray(obj.blockedBy)
        ? (obj.blockedBy as unknown[]).map(String)
        : [],
    })
  }

  // Sort ascending by the integer value of the id so callers always get a
  // stable, predictable order regardless of filesystem readdir order.
  tasks.sort((a, b) => Number(a.id) - Number(b.id))

  return tasks
}

/**
 * Parse tasks for `teamId` from the standard Claude Code tasks directory:
 * `~/.claude/tasks/{teamId}/`.
 *
 * Uses `os.homedir()` — never hardcodes a user path.
 */
export async function parseTasks(teamId: string): Promise<Task[]> {
  const dir = path.join(os.homedir(), '.claude', 'tasks', teamId)
  return parseTasksFromDir(dir)
}
