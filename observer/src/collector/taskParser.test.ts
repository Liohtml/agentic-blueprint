/**
 * observer/src/collector/taskParser.test.ts
 *
 * Tests for parseTasksFromDir().
 * Fixtures live under observer/fixtures/tasks/:
 *   demo/   — 4 task files + .lock + .highwatermark + notes.json (skip tests)
 *   empty/  — only .highwatermark (simulates an empty task dir)
 */

import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
import { parseTasksFromDir } from './taskParser.js'

const FIXTURES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../fixtures/tasks',
)

describe('parseTasksFromDir', () => {
  describe('demo team (4 tasks + noise files)', () => {
    it('returns exactly 4 tasks — skips .lock, .highwatermark, and notes.json', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      expect(tasks).toHaveLength(4)
    })

    it('sorts tasks by ascending numeric id', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      expect(tasks.map(t => t.id)).toEqual(['1', '2', '3', '4'])
    })

    it('normalises status correctly', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      expect(tasks[0].status).toBe('completed')
      expect(tasks[1].status).toBe('in_progress')
      expect(tasks[2].status).toBe('pending')
      expect(tasks[3].status).toBe('pending')
    })

    it('parses subject and description', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      expect(tasks[0].subject).toBe('Scaffold shared types')
      expect(tasks[0].description).toContain('TypeScript interfaces')
    })

    it('parses blocks dependency (task 1 blocks task 2)', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      const t1 = tasks.find(t => t.id === '1')!
      expect(t1.blocks).toEqual(['2'])
      expect(t1.blockedBy).toEqual([])
    })

    it('parses blockedBy dependency (task 2 blocked by task 1, blocks task 3)', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      const t2 = tasks.find(t => t.id === '2')!
      expect(t2.blockedBy).toEqual(['1'])
      expect(t2.blocks).toEqual(['3'])
    })

    it('defaults missing blocks / blockedBy to []', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      const t4 = tasks.find(t => t.id === '4')!
      expect(t4.blocks).toEqual([])
      expect(t4.blockedBy).toEqual([])
    })

    it('defaults missing owner to empty string', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      const t4 = tasks.find(t => t.id === '4')!
      expect(t4.owner).toBe('')
    })

    it('preserves owner when present', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'demo'))
      const t2 = tasks.find(t => t.id === '2')!
      expect(t2.owner).toBe('bob')
    })
  })

  describe('empty team (directory exists but no task files)', () => {
    it('returns [] when directory has no {n}.json files', async () => {
      const tasks = await parseTasksFromDir(path.join(FIXTURES_DIR, 'empty'))
      expect(tasks).toEqual([])
    })
  })

  describe('missing directory', () => {
    it('returns [] for a directory that does not exist', async () => {
      const tasks = await parseTasksFromDir(
        path.join(FIXTURES_DIR, 'nonexistent-team-xyz'),
      )
      expect(tasks).toEqual([])
    })
  })
})
