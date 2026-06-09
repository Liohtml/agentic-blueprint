import { describe, it, expect } from 'vitest'
import * as path from 'node:path'
import * as url from 'node:url'
import { buildEdges, parseMessages } from './inboxParser.ts'
import type { Message } from '../types.ts'

// ---------------------------------------------------------------------------
// Fixture path resolution
// ---------------------------------------------------------------------------

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
/** Points to observer/fixtures/teams — override teamsBaseDir in every call. */
const FIXTURE_TEAMS = path.resolve(__dirname, '../../fixtures/teams')

// ---------------------------------------------------------------------------
// parseMessages
// ---------------------------------------------------------------------------

describe('parseMessages', () => {
  it('reads all inbox files and derives `to` from filename', async () => {
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)

    // agent-alpha has 2 messages, agent-beta has 1, agent-gamma is empty
    expect(messages).toHaveLength(3)

    const recipients = new Set(messages.map((m) => m.to))
    expect(recipients.has('agent-alpha')).toBe(true)
    expect(recipients.has('agent-beta')).toBe(true)
    // agent-gamma inbox is [] → no messages with to='agent-gamma'
    expect(recipients.has('agent-gamma')).toBe(false)
  })

  it('converts ISO-8601 timestamp to Unix ms', async () => {
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)
    for (const msg of messages) {
      expect(typeof msg.timestamp).toBe('number')
      expect(Number.isFinite(msg.timestamp)).toBe(true)
      expect(msg.timestamp).toBeGreaterThan(0)
    }
  })

  it('maps all fields correctly for a known message', async () => {
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)
    const msg = messages.find((m) => m.to === 'agent-alpha' && m.from === 'agent-beta')

    expect(msg).toBeDefined()
    expect(msg!.text).toContain('Agreed')
    expect(msg!.summary).toContain('Plan accepted')
    expect(msg!.color).toBe('yellow')
    expect(msg!.read).toBe(false)
    expect(msg!.timestamp).toBe(Date.parse('2026-06-09T13:26:25.826Z'))
  })

  it('tolerates empty inbox arrays without errors', async () => {
    // agent-gamma.json is [] — should produce zero messages, not throw
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)
    expect(messages.filter((m) => m.to === 'agent-gamma')).toHaveLength(0)
  })

  it('returns [] for a non-existent team directory', async () => {
    const messages = await parseMessages('no-such-team', FIXTURE_TEAMS)
    expect(messages).toEqual([])
  })

  it('includes optional fields (color, read) when present', async () => {
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)
    for (const msg of messages) {
      if (msg.color !== undefined) {
        expect(typeof msg.color).toBe('string')
      }
      if (msg.read !== undefined) {
        expect(typeof msg.read).toBe('boolean')
      }
    }
  })
})

// ---------------------------------------------------------------------------
// buildEdges
// ---------------------------------------------------------------------------

describe('buildEdges', () => {
  const msgs: Message[] = [
    { from: 'alpha', to: 'beta', text: 'hi', summary: 'hi', timestamp: 1000 },
    { from: 'alpha', to: 'beta', text: 'hi again', summary: 'again', timestamp: 2000 },
    { from: 'beta', to: 'alpha', text: 'hello', summary: 'hello', timestamp: 3000 },
    { from: 'gamma', to: 'alpha', text: 'hey', summary: 'hey', timestamp: 4000 },
  ]

  it('returns one edge per unique (from, to) pair', () => {
    const edges = buildEdges(msgs)
    expect(edges).toHaveLength(3)
  })

  it('counts multiple messages in the same direction', () => {
    const edges = buildEdges(msgs)
    const ab = edges.find((e) => e.from === 'alpha' && e.to === 'beta')
    expect(ab?.count).toBe(2)
  })

  it('treats opposite directions as distinct edges', () => {
    const edges = buildEdges(msgs)
    const ba = edges.find((e) => e.from === 'beta' && e.to === 'alpha')
    expect(ba?.count).toBe(1)
  })

  it('returns [] for an empty message array', () => {
    expect(buildEdges([])).toEqual([])
  })

  it('every edge has from, to, and count as the correct types', () => {
    const edges = buildEdges(msgs)
    for (const edge of edges) {
      expect(typeof edge.from).toBe('string')
      expect(typeof edge.to).toBe('string')
      expect(typeof edge.count).toBe('number')
      expect(edge.count).toBeGreaterThan(0)
    }
  })

  it('returns edges in deterministic sorted order', () => {
    // Shuffle input and check order is stable
    const shuffled = [...msgs].reverse()
    const edges1 = buildEdges(msgs)
    const edges2 = buildEdges(shuffled)
    expect(edges1.map((e) => `${e.from}→${e.to}`)).toEqual(
      edges2.map((e) => `${e.from}→${e.to}`),
    )
  })

  it('works correctly with parsed fixture messages', async () => {
    const messages = await parseMessages('sample-team', FIXTURE_TEAMS)
    const edges = buildEdges(messages)

    // Fixture: beta→alpha (1), gamma→alpha (1), alpha→beta (1)
    expect(edges.length).toBeGreaterThan(0)

    const betaToAlpha = edges.find((e) => e.from === 'agent-beta' && e.to === 'agent-alpha')
    expect(betaToAlpha?.count).toBe(1)

    const alphaToAgent = edges.find((e) => e.from === 'agent-alpha' && e.to === 'agent-beta')
    expect(alphaToAgent?.count).toBe(1)
  })
})
