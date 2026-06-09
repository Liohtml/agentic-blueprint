/**
 * observer/src/collector/teamParser.ts
 *
 * Scans ~/.claude/teams/{name}/config.json and returns TeamInfo objects.
 * Owned by T2 (team-parser). Types imported from types.ts — DO NOT edit types.ts.
 *
 * Key behaviours:
 *  - model fields are returned with any `[1m]`-style suffixes stripped.
 *  - members[] reflects only what config.json contains (a PARTIAL list);
 *    downstream aggregators must union with inbox/transcript discovery.
 *  - isActive is NOT inferred here — left to the transcript-based aggregator.
 *  - colorForName() assigns a deterministic palette colour when color is absent.
 *  - All paths resolve via os.homedir(); never hardcoded.
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import type { TeamInfo } from '../types.js';

// ---------------------------------------------------------------------------
// Colour helper
// ---------------------------------------------------------------------------

/**
 * Fixed palette of named colours, ordered for visual distinction.
 * Indexed deterministically via colorForName().
 */
const AGENT_PALETTE: readonly string[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'orange',
  'white',
];

/**
 * Returns a deterministic palette colour for a given agent name.
 * Uses a djb2-derived hash so the same name always maps to the same colour,
 * across processes and restarts.
 *
 * Use this helper when an agent's config entry has no `color` field.
 */
export function colorForName(name: string): string {
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    // djb2: hash = hash * 33 + charCode
    hash = (((hash << 5) + hash) + name.charCodeAt(i)) | 0; // keep 32-bit signed
  }
  const idx = Math.abs(hash) % AGENT_PALETTE.length;
  // AGENT_PALETTE is a fixed-length readonly array; idx is always in bounds.
  return AGENT_PALETTE[idx] as string;
}

// ---------------------------------------------------------------------------
// Model normalisation
// ---------------------------------------------------------------------------

/**
 * Strip any trailing bracket suffix from a model identifier.
 * E.g. "claude-opus-4-8[1m]" → "claude-opus-4-8".
 */
export function stripModel(model: string): string {
  return model.replace(/\[\w+\]$/, '').trim();
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Parse a single team's config.json.
 *
 * @param name     - Team directory name (e.g. "konzept-review")
 * @param baseDir  - Optional override for the Claude data root.
 *                   Defaults to `~/.claude`. Pass `fixtures/` in tests.
 * @returns        Parsed TeamInfo with model suffixes stripped from all members.
 * @throws         If the config file is missing or not valid JSON.
 */
export async function parseTeam(name: string, baseDir?: string): Promise<TeamInfo> {
  const root = baseDir ?? path.join(os.homedir(), '.claude');
  const configPath = path.join(root, 'teams', name, 'config.json');

  let raw: string;
  try {
    raw = await fs.readFile(configPath, 'utf8');
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    throw new Error(
      `[teamParser] Cannot read config for team "${name}" (${code ?? 'unknown'}): ${configPath}`,
    );
  }

  let data: TeamInfo;
  try {
    data = JSON.parse(raw) as TeamInfo;
  } catch (err) {
    throw new Error(
      `[teamParser] Invalid JSON in config for team "${name}": ${(err as Error).message}`,
    );
  }

  // Normalise model strings on every member
  const members = data.members.map((m) => ({
    ...m,
    model: stripModel(m.model),
  }));

  return { ...data, members };
}

/**
 * Scan `<baseDir>/teams/{name}/config.json` for all team directories and return
 * all parseable TeamInfo objects.
 * Directories whose config.json is missing or malformed are skipped with a warning.
 *
 * @param baseDir - Optional override for the Claude data root. Defaults to `~/.claude`.
 * @returns       Array of TeamInfo (may be empty if no teams directory exists yet).
 */
export async function parseTeams(baseDir?: string): Promise<TeamInfo[]> {
  const root = baseDir ?? path.join(os.homedir(), '.claude');
  const teamsDir = path.join(root, 'teams');

  let dirEntries: string[];
  try {
    const entries = await fs.readdir(teamsDir, { withFileTypes: true });
    dirEntries = entries.filter((d) => d.isDirectory()).map((d) => d.name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // teams directory doesn't exist yet — normal for a fresh install
    }
    throw err;
  }

  const results: TeamInfo[] = [];
  for (const entry of dirEntries) {
    try {
      const team = await parseTeam(entry, baseDir);
      results.push(team);
    } catch (err) {
      console.warn(`[teamParser] Skipping team "${entry}": ${(err as Error).message}`);
    }
  }

  return results;
}
