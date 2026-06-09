import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { existsSync, writeFileSync, appendFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

import {
  encodeCwd,
  normalizeModel,
  resolveSessions,
  createTranscriptReader,
  createStatsAccumulator,
  parseTranscriptFile,
} from './transcriptParser.ts';
import type { TeamInfo } from '../types.ts';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURE_PROJECTS = join(here, '..', '..', 'fixtures', 'projects');
const TEAMMATE_FILE = join(
  FIXTURE_PROJECTS,
  '-Users-test-demo',
  'd0000000-0000-4000-8000-000000000002.jsonl',
);

const demoTeam: TeamInfo = {
  name: 'demo-team',
  description: 'fixture team',
  createdAt: 0,
  leadAgentId: 'team-lead@demo-team',
  leadSessionId: 'd0000000-0000-4000-8000-000000000001',
  members: [
    {
      agentId: 'team-lead@demo-team',
      name: 'team-lead',
      agentType: 'team-lead',
      model: 'claude-opus-4-8[1m]',
      joinedAt: 0,
      tmuxPaneId: '',
      cwd: '/Users/test/demo',
      subscriptions: [],
    },
  ],
};

describe('encodeCwd', () => {
  it('replaces / and . with -', () => {
    expect(encodeCwd('/Users/x/fitness-coach')).toBe('-Users-x-fitness-coach');
    expect(encodeCwd('/Users/x/a.b.c')).toBe('-Users-x-a-b-c');
  });
});

describe('normalizeModel', () => {
  it('strips bracketed suffixes like [1m]', () => {
    expect(normalizeModel('claude-opus-4-8[1m]')).toBe('claude-opus-4-8');
    expect(normalizeModel('claude-opus-4-8')).toBe('claude-opus-4-8');
    expect(normalizeModel(undefined)).toBe('');
  });
});

describe('parseTranscriptFile — exact aggregation', () => {
  const stats = parseTranscriptFile(TEAMMATE_FILE);

  it('sums TokenUsage exactly across assistant lines', () => {
    // assistant#1: 100/10/5/50 ; assistant#2: 200/20/0/80
    expect(stats.tokens).toEqual({
      inputTokens: 300,
      outputTokens: 30,
      cacheCreationInputTokens: 5,
      cacheReadInputTokens: 130,
    });
  });

  it('counts tools used', () => {
    expect(stats.toolsUsed).toEqual({ Read: 1 });
  });

  it('reports currentActivity from the most-recent assistant message', () => {
    // newest assistant line is end_turn with no tool_use → "responding"
    expect(stats.currentActivity).toBe('responding');
  });

  it('uses the max assistant timestamp for lastActiveAt', () => {
    expect(stats.lastActiveAt).toBe(Date.parse('2026-06-09T13:00:10.000Z'));
  });

  it('counts errors: tool_result is_error + system level=error, but NOT hookErrors:[]', () => {
    expect(stats.errorCount).toBe(2);
  });

  it('normalises the model id', () => {
    expect(stats.model).toBe('claude-opus-4-8');
  });

  it('captures the session id from the lines', () => {
    expect(stats.sessionId).toBe('d0000000-0000-4000-8000-000000000002');
  });
});

describe('createStatsAccumulator — currentActivity fallbacks', () => {
  it('uses last tool_use name when newest message has a tool call', () => {
    const acc = createStatsAccumulator('s');
    acc.add([
      {
        type: 'assistant',
        timestamp: '2026-06-09T13:00:00.000Z',
        message: {
          model: 'claude-opus-4-8',
          stop_reason: 'tool_use',
          content: [
            { type: 'tool_use', name: 'Grep' },
            { type: 'tool_use', name: 'Bash' },
          ],
        },
      },
    ]);
    expect(acc.stats().currentActivity).toBe('Bash');
    expect(acc.stats().toolsUsed).toEqual({ Grep: 1, Bash: 1 });
  });

  it('falls back to "thinking" when newest message is not end_turn and has no tool', () => {
    const acc = createStatsAccumulator('s');
    acc.add([
      {
        type: 'assistant',
        timestamp: '2026-06-09T13:00:00.000Z',
        message: { stop_reason: 'max_tokens', content: [{ type: 'text', text: 'hi' }] },
      },
    ]);
    expect(acc.stats().currentActivity).toBe('thinking');
  });
});

describe('resolveSessions', () => {
  it('maps the lead by sessionId and teammates via the Du bist regex', () => {
    const sessions = resolveSessions(demoTeam, { projectsDir: FIXTURE_PROJECTS });
    expect(sessions).toEqual([
      {
        sessionId: 'd0000000-0000-4000-8000-000000000001',
        agentName: 'team-lead',
        filePath: join(
          FIXTURE_PROJECTS,
          '-Users-test-demo',
          'd0000000-0000-4000-8000-000000000001.jsonl',
        ),
      },
      {
        sessionId: 'd0000000-0000-4000-8000-000000000002',
        agentName: 'tester',
        filePath: TEAMMATE_FILE,
      },
    ]);
  });

  it('ignores a teammate session whose body references a different team name', () => {
    const otherTeam: TeamInfo = { ...demoTeam, name: 'some-other-team', leadSessionId: 'none' };
    const sessions = resolveSessions(otherTeam, { projectsDir: FIXTURE_PROJECTS });
    // lead id "none" matches nothing; teammate body says "demo-team" not "some-other-team".
    expect(sessions).toEqual([]);
  });
});

describe('createTranscriptReader — incremental & shrink handling', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = join(tmpdir(), `observer-reader-test-${process.pid}.jsonl`);
    rmSync(tmp, { force: true });
  });
  afterEach(() => {
    rmSync(tmp, { force: true });
  });

  it('returns only newly-completed lines and buffers a trailing partial line', () => {
    writeFileSync(tmp, '{"type":"assistant","n":1}\n{"type":"assistant","n":2}'); // line 2 partial
    const reader = createTranscriptReader(tmp);

    const first = reader.update();
    expect(first.map((l) => (l as { n: number }).n)).toEqual([1]); // partial line 2 buffered

    appendFileSync(tmp, '\n{"type":"assistant","n":3}\n');
    const second = reader.update();
    expect(second.map((l) => (l as { n: number }).n)).toEqual([2, 3]);

    // No new bytes → nothing new.
    expect(reader.update()).toEqual([]);
  });

  it('resets to offset 0 when the file shrinks', () => {
    writeFileSync(tmp, '{"n":1}\n{"n":2}\n');
    const reader = createTranscriptReader(tmp);
    expect(reader.update().map((l) => (l as { n: number }).n)).toEqual([1, 2]);

    // Truncate + rewrite shorter content.
    writeFileSync(tmp, '{"n":9}\n');
    expect(reader.update().map((l) => (l as { n: number }).n)).toEqual([9]);
  });
});

// Optional: validate against the live konzept-review data if present on this machine.
describe('live konzept-review data (optional)', () => {
  const liveDir = join(
    process.env.HOME ?? '',
    '.claude',
    'projects',
    '-Users-lionel-fitness-coach',
  );
  const leadFile = join(liveDir, 'd4e9e7cb-0d31-4bb0-a8a3-c95e168fb40c.jsonl');

  it.skipIf(!existsSync(leadFile))('sums the lead session to the known ground truth', () => {
    const stats = parseTranscriptFile(leadFile);
    // Ground truth from DATA-NOTES.md §D: 55785/74981/359868/3678142
    expect(stats.tokens).toEqual({
      inputTokens: 55785,
      outputTokens: 74981,
      cacheCreationInputTokens: 359868,
      cacheReadInputTokens: 3678142,
    });
    expect(stats.model).toBe('claude-opus-4-8');
  });

  it.skipIf(!existsSync(liveDir))('resolves all four live sessions to their agents', () => {
    const liveTeam: TeamInfo = {
      name: 'konzept-review',
      description: '',
      createdAt: 0,
      leadAgentId: 'team-lead@konzept-review',
      leadSessionId: 'd4e9e7cb-0d31-4bb0-a8a3-c95e168fb40c',
      members: [
        {
          agentId: 'team-lead@konzept-review',
          name: 'team-lead',
          agentType: 'team-lead',
          model: 'claude-opus-4-8[1m]',
          joinedAt: 0,
          tmuxPaneId: '',
          cwd: '/Users/lionel/fitness-coach',
          subscriptions: [],
        },
      ],
    };
    const sessions = resolveSessions(liveTeam, {
      projectsDir: join(process.env.HOME ?? '', '.claude', 'projects'),
    });
    const names = sessions.map((s) => s.agentName).sort();
    expect(names).toEqual(['advocatus', 'architekt', 'team-lead', 'ux']);
    // Skip files that aren't sessions (dirs) gracefully.
    expect(readdirSync(join(liveDir)).length).toBeGreaterThan(0);
  });
});
