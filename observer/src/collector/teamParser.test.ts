/**
 * observer/src/collector/teamParser.test.ts
 *
 * Vitest unit tests for teamParser.ts.
 * Tests run against observer/fixtures/ — no real ~/.claude/ access required.
 */

import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  colorForName,
  stripModel,
  parseTeam,
  parseTeams,
} from './teamParser.js';

// ---------------------------------------------------------------------------
// Fixture path helpers
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Points to observer/fixtures/ — mirrors the ~/.claude/ layout. */
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures');

// ---------------------------------------------------------------------------
// colorForName
// ---------------------------------------------------------------------------

describe('colorForName', () => {
  it('returns a non-empty string', () => {
    expect(colorForName('team-lead')).toBeTruthy();
  });

  it('is deterministic — same input always produces same output', () => {
    expect(colorForName('team-lead')).toBe(colorForName('team-lead'));
    expect(colorForName('architekt')).toBe(colorForName('architekt'));
  });

  it('produces different colours for different names (palette has 8 entries)', () => {
    const names = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta'];
    const colours = names.map(colorForName);
    // Not all colours need to be unique (8 names, 8 palette entries),
    // but we should get at least 2 distinct values across these names.
    const unique = new Set(colours);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('returns one of the known palette colours', () => {
    const palette = new Set(['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'orange', 'white']);
    const colour = colorForName('team-lead');
    expect(palette.has(colour)).toBe(true);
  });

  it('handles empty string without throwing', () => {
    expect(() => colorForName('')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// stripModel
// ---------------------------------------------------------------------------

describe('stripModel', () => {
  it('strips the [1m] suffix', () => {
    expect(stripModel('claude-opus-4-8[1m]')).toBe('claude-opus-4-8');
  });

  it('leaves a clean model id untouched', () => {
    expect(stripModel('claude-opus-4-8')).toBe('claude-opus-4-8');
  });

  it('strips other bracket suffixes', () => {
    expect(stripModel('claude-sonnet-4-6[2m]')).toBe('claude-sonnet-4-6');
    expect(stripModel('claude-haiku-4-5[xyz]')).toBe('claude-haiku-4-5');
  });

  it('does not strip mid-string brackets', () => {
    // Only trailing bracket suffix should be removed
    expect(stripModel('claude-[1m]-opus')).toBe('claude-[1m]-opus');
  });

  it('handles empty string', () => {
    expect(stripModel('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// parseTeam (fixture-based)
// ---------------------------------------------------------------------------

describe('parseTeam', () => {
  it('parses sample-team config from fixtures', async () => {
    const team = await parseTeam('sample-team', FIXTURES_DIR);

    expect(team.name).toBe('sample-team');
    expect(team.description).toBeTruthy();
    expect(typeof team.createdAt).toBe('number');
    expect(team.leadAgentId).toBeTruthy();
    expect(team.leadSessionId).toBeTruthy();
    expect(Array.isArray(team.members)).toBe(true);
  });

  it('strips [1m] from member model fields', async () => {
    const team = await parseTeam('sample-team', FIXTURES_DIR);
    for (const member of team.members) {
      expect(member.model).not.toMatch(/\[\w+\]$/);
    }
  });

  it('returns correct member fields', async () => {
    const team = await parseTeam('sample-team', FIXTURES_DIR);
    expect(team.members.length).toBeGreaterThan(0);

    const lead = team.members[0];
    expect(lead).toBeDefined();
    if (lead) {
      expect(lead.name).toBe('team-lead');
      expect(lead.agentType).toBe('team-lead');
      expect(lead.model).toBe('claude-opus-4-8'); // stripped
      expect(typeof lead.joinedAt).toBe('number');
      expect(typeof lead.tmuxPaneId).toBe('string'); // often empty
      expect(typeof lead.cwd).toBe('string');
      expect(Array.isArray(lead.subscriptions)).toBe(true);
    }
  });

  it('throws a descriptive error for a non-existent team', async () => {
    await expect(parseTeam('does-not-exist', FIXTURES_DIR)).rejects.toThrow(
      /teamParser.*does-not-exist/,
    );
  });

  it('does not mutate the source — returns a new object with stripped models', async () => {
    // Parse twice and check we get fresh objects each time
    const a = await parseTeam('sample-team', FIXTURES_DIR);
    const b = await parseTeam('sample-team', FIXTURES_DIR);
    expect(a).not.toBe(b); // different object references
    expect(a.name).toBe(b.name);
  });
});

// ---------------------------------------------------------------------------
// parseTeams (fixture-based)
// ---------------------------------------------------------------------------

describe('parseTeams', () => {
  it('returns at least the sample-team from fixtures', async () => {
    const teams = await parseTeams(FIXTURES_DIR);
    expect(Array.isArray(teams)).toBe(true);
    expect(teams.length).toBeGreaterThan(0);

    const names = teams.map((t) => t.name);
    expect(names).toContain('sample-team');
  });

  it('all returned teams have stripped model fields', async () => {
    const teams = await parseTeams(FIXTURES_DIR);
    for (const team of teams) {
      for (const member of team.members) {
        expect(member.model).not.toMatch(/\[\w+\]$/);
      }
    }
  });

  it('returns empty array when teams directory does not exist', async () => {
    const result = await parseTeams('/tmp/observer-nonexistent-dir-xyz');
    expect(result).toEqual([]);
  });
});
