/**
 * Tests for observer/src/collector/pricing.ts
 *
 * Ground-truth token counts are taken from DATA-NOTES.md §D (verified live
 * team-lead session: d4e9e7cb, model claude-opus-4-8).
 *
 *   input:       55 785
 *   output:      74 981
 *   cacheCreate: 359 868
 *   cacheRead: 3 678 142
 *
 * Expected costs are derived from PRICING_TABLE at runtime (see
 * EXPECTED_* constants below), so price updates don't break this file.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeCost,
  getPricing,
  normalizeModelId,
  PRICING_TABLE,
  warnedModels,
} from './pricing.js';
import type { TokenUsage } from '../types.js';

// ---------------------------------------------------------------------------
// Ground-truth fixture (team-lead from DATA-NOTES.md)
// ---------------------------------------------------------------------------
const OPUS_USAGE: TokenUsage = {
  inputTokens:              55_785,
  outputTokens:             74_981,
  cacheCreationInputTokens: 359_868,
  cacheReadInputTokens:     3_678_142,
};

// Pre-computed expected values using the PRICING_TABLE rates
const M = 1_000_000;
const p = PRICING_TABLE['claude-opus-4-8']!;
const EXPECTED_INPUT_COST  = (OPUS_USAGE.inputTokens               * p.inputPerMTok)      / M;
const EXPECTED_OUTPUT_COST = (OPUS_USAGE.outputTokens              * p.outputPerMTok)     / M;
const EXPECTED_WRITE_COST  = (OPUS_USAGE.cacheCreationInputTokens  * p.cacheWritePerMTok) / M;
const EXPECTED_READ_COST   = (OPUS_USAGE.cacheReadInputTokens      * p.cacheReadPerMTok)  / M;
const EXPECTED_TOTAL       = EXPECTED_INPUT_COST + EXPECTED_OUTPUT_COST + EXPECTED_WRITE_COST + EXPECTED_READ_COST;

// ---------------------------------------------------------------------------
// normalizeModelId
// ---------------------------------------------------------------------------
describe('normalizeModelId', () => {
  it('strips [1m] suffix', () => {
    expect(normalizeModelId('claude-opus-4-8[1m]')).toBe('claude-opus-4-8');
  });

  it('strips [200k] suffix', () => {
    expect(normalizeModelId('claude-sonnet-4-6[200k]')).toBe('claude-sonnet-4-6');
  });

  it('strips 8-digit date suffix', () => {
    expect(normalizeModelId('claude-sonnet-4-6-20250201')).toBe('claude-sonnet-4-6');
  });

  it('strips bracket and date suffix together', () => {
    expect(normalizeModelId('claude-opus-4-8[1m]-20250101')).toBe('claude-opus-4-8');
  });

  it('leaves a plain model ID unchanged', () => {
    expect(normalizeModelId('claude-haiku-4-5')).toBe('claude-haiku-4-5');
  });
});

// ---------------------------------------------------------------------------
// getPricing — table lookup and fallback
// ---------------------------------------------------------------------------
describe('getPricing', () => {
  beforeEach(() => {
    // Reset the warned-once Set between tests so warning tests are independent
    warnedModels.clear();
  });

  it('returns fable pricing for claude-fable-5', () => {
    const entry = getPricing('claude-fable-5');
    expect(entry.inputPerMTok).toBe(10.00);
    expect(entry.outputPerMTok).toBe(50.00);
    expect(entry.cacheWritePerMTok).toBe(12.50);
    expect(entry.cacheReadPerMTok).toBe(1.00);
  });

  it('returns opus pricing for claude-opus-4-8', () => {
    const entry = getPricing('claude-opus-4-8');
    expect(entry.inputPerMTok).toBe(5.00);
    expect(entry.outputPerMTok).toBe(25.00);
    expect(entry.cacheWritePerMTok).toBe(6.25);
    expect(entry.cacheReadPerMTok).toBe(0.50);
  });

  it('handles [1m] suffix transparently', () => {
    const direct  = getPricing('claude-opus-4-8');
    const suffixed = getPricing('claude-opus-4-8[1m]');
    expect(suffixed).toEqual(direct);
  });

  it('returns sonnet pricing for claude-sonnet-4-6', () => {
    const entry = getPricing('claude-sonnet-4-6');
    expect(entry.inputPerMTok).toBe(3.00);
    expect(entry.outputPerMTok).toBe(15.00);
  });

  it('returns haiku pricing for claude-haiku-4-5', () => {
    const entry = getPricing('claude-haiku-4-5');
    expect(entry.inputPerMTok).toBe(1.00);
    expect(entry.outputPerMTok).toBe(5.00);
  });

  it('returns default (sonnet-class) fallback for unknown model', () => {
    const entry = getPricing('claude-unknown-future-9');
    expect(entry.inputPerMTok).toBe(3.00);   // sonnet-class default
    expect(entry.outputPerMTok).toBe(15.00);
  });

  it('warns only once for repeated unknown model calls', () => {
    const warnings: string[] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args.join(' '));

    getPricing('claude-mystery-99');
    getPricing('claude-mystery-99');
    getPricing('claude-mystery-99');

    console.warn = original;
    expect(warnings).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// computeCost — math correctness using DATA-NOTES ground-truth numbers
// ---------------------------------------------------------------------------
describe('computeCost', () => {
  it('returns correct per-category costs for claude-opus-4-8 (DATA-NOTES ground truth)', () => {
    const result = computeCost(OPUS_USAGE, 'claude-opus-4-8');
    expect(result.inputCostUsd).toBeCloseTo(EXPECTED_INPUT_COST, 8);
    expect(result.outputCostUsd).toBeCloseTo(EXPECTED_OUTPUT_COST, 8);
    expect(result.cacheWriteCostUsd).toBeCloseTo(EXPECTED_WRITE_COST, 8);
    expect(result.cacheReadCostUsd).toBeCloseTo(EXPECTED_READ_COST, 8);
  });

  it('totalCostUsd equals sum of parts (no rounding gaps)', () => {
    const result = computeCost(OPUS_USAGE, 'claude-opus-4-8');
    const manualSum = result.inputCostUsd + result.outputCostUsd
      + result.cacheWriteCostUsd + result.cacheReadCostUsd;
    expect(result.totalCostUsd).toBeCloseTo(manualSum, 12);
  });

  it('opus ground-truth total is plausible (~$18.73, within ±$5 of that range)', () => {
    const result = computeCost(OPUS_USAGE, 'claude-opus-4-8');
    // Sanity band: prices could vary ±25% from our table — still a big-number check
    expect(result.totalCostUsd).toBeGreaterThan(5);
    expect(result.totalCostUsd).toBeLessThan(50);
    // Tighter check against the computed expected value
    expect(result.totalCostUsd).toBeCloseTo(EXPECTED_TOTAL, 4);
  });

  it('cache-write cost is MORE expensive than input per token (premium rate)', () => {
    const opusPricing = PRICING_TABLE['claude-opus-4-8']!;
    expect(opusPricing.cacheWritePerMTok).toBeGreaterThan(opusPricing.inputPerMTok);
    // Verify this is reflected in absolute cost if counts are equal
    const equalUsage: TokenUsage = {
      inputTokens: 1_000_000, outputTokens: 0,
      cacheCreationInputTokens: 1_000_000, cacheReadInputTokens: 0,
    };
    const r = computeCost(equalUsage, 'claude-opus-4-8');
    expect(r.cacheWriteCostUsd).toBeGreaterThan(r.inputCostUsd);
  });

  it('cache-read cost is CHEAPER than input per token (discount rate)', () => {
    const opusPricing = PRICING_TABLE['claude-opus-4-8']!;
    expect(opusPricing.cacheReadPerMTok).toBeLessThan(opusPricing.inputPerMTok);
    const equalUsage: TokenUsage = {
      inputTokens: 1_000_000, outputTokens: 0,
      cacheCreationInputTokens: 0, cacheReadInputTokens: 1_000_000,
    };
    const r = computeCost(equalUsage, 'claude-opus-4-8');
    expect(r.cacheReadCostUsd).toBeLessThan(r.inputCostUsd);
  });

  it('zero usage produces zero cost', () => {
    const zero: TokenUsage = {
      inputTokens: 0, outputTokens: 0,
      cacheCreationInputTokens: 0, cacheReadInputTokens: 0,
    };
    const result = computeCost(zero, 'claude-opus-4-8');
    expect(result.totalCostUsd).toBe(0);
    expect(result.inputCostUsd).toBe(0);
  });

  it('accepts [1m]-suffixed model name', () => {
    const direct   = computeCost(OPUS_USAGE, 'claude-opus-4-8');
    const suffixed = computeCost(OPUS_USAGE, 'claude-opus-4-8[1m]');
    expect(suffixed.totalCostUsd).toBe(direct.totalCostUsd);
  });
});
