/**
 * **PREISE PRÜFEN — NICHT AUTORITATIV / VERIFY PRICES, NOT AUTHORITATIVE**
 *
 * Per-model pricing table (USD per million tokens).
 * Keys are normalised model IDs (strip [1m]/[200k]/date suffixes).
 *
 * Edit the PRICING_TABLE below to update rates — no other code needs changing.
 */

import type { CostBreakdown, TokenUsage } from '../types.js';

// ---------------------------------------------------------------------------
// Price record shape
// ---------------------------------------------------------------------------

/** Per-million-token rates for one model. All values are USD. */
export interface ModelPricing {
  /** USD per 1 M input tokens */
  inputPerMTok: number;
  /** USD per 1 M output tokens */
  outputPerMTok: number;
  /**
   * USD per 1 M cache-creation (write) tokens.
   * Maps to `cache_creation_input_tokens` in the JSONL usage block.
   */
  cacheWritePerMTok: number;
  /**
   * USD per 1 M cache-read tokens.
   * Maps to `cache_read_input_tokens` in the JSONL usage block.
   */
  cacheReadPerMTok: number;
}

// ---------------------------------------------------------------------------
// Editable price table — VERIFY BEFORE RELYING ON THESE NUMBERS
// ---------------------------------------------------------------------------

/**
 * Pricing table keyed by normalised model ID.
 * Cache-write is ~25% premium over input; cache-read is ~10% of input.
 * Sources: Anthropic pricing page (non-authoritative, subject to change).
 */
export const PRICING_TABLE: Record<string, ModelPricing> = {
  'claude-fable-5': {
    inputPerMTok:      10.00,
    outputPerMTok:     50.00,
    cacheWritePerMTok: 12.50,  // 1.25× input
    cacheReadPerMTok:   1.00,  // 0.10× input
  },
  'claude-opus-4-8': {
    inputPerMTok:       5.00,
    outputPerMTok:     25.00,
    cacheWritePerMTok:  6.25,  // 1.25× input
    cacheReadPerMTok:   0.50,  // 0.10× input
  },
  'claude-sonnet-4-6': {
    inputPerMTok:       3.00,
    outputPerMTok:     15.00,
    cacheWritePerMTok:  3.75,  // 1.25× input
    cacheReadPerMTok:   0.30,  // 0.10× input
  },
  'claude-haiku-4-5': {
    inputPerMTok:       1.00,
    outputPerMTok:      5.00,
    cacheWritePerMTok:  1.25,  // 1.25× input
    cacheReadPerMTok:   0.10,  // 0.10× input
  },
};

/**
 * Fallback rates used when a model is not in PRICING_TABLE.
 * Sonnet-class as a middle-ground estimate.
 */
const DEFAULT_PRICING: ModelPricing = {
  inputPerMTok:       3.00,
  outputPerMTok:     15.00,
  cacheWritePerMTok:  3.75,
  cacheReadPerMTok:   0.30,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Tracks which unknown model IDs have already triggered a console.warn so we
 * warn once per model per process lifetime.
 */
export const warnedModels = new Set<string>();

/**
 * Normalise a model ID for pricing lookup.
 *
 * Strips:
 *  - bracketed suffixes: `[1m]`, `[200k]`, etc.
 *  - 8-digit date suffixes: `-20250101`
 *  - leading/trailing whitespace
 *
 * Examples:
 *   `"claude-opus-4-8[1m]"`      → `"claude-opus-4-8"`
 *   `"claude-sonnet-4-6-20250201"` → `"claude-sonnet-4-6"`
 */
export function normalizeModelId(model: string): string {
  return model
    .replace(/\[.*?\]/g, '')    // strip [1m], [200k], …
    .replace(/-\d{8}$/, '')     // strip trailing YYYYMMDD date
    .trim();
}

/**
 * Return the ModelPricing entry for `model` (normalising first).
 * Falls back to DEFAULT_PRICING and emits a single console.warn per unknown ID.
 */
export function getPricing(model: string): ModelPricing {
  const normalised = normalizeModelId(model);
  const entry = PRICING_TABLE[normalised];
  if (entry !== undefined) return entry;

  if (!warnedModels.has(normalised)) {
    warnedModels.add(normalised);
    console.warn(
      `[observer/pricing] Unknown model "${normalised}" (raw: "${model}"). ` +
        'Falling back to Sonnet-class rates. ' +
        'PREISE PRÜFEN — NICHT AUTORITATIV / VERIFY PRICES, NOT AUTHORITATIVE.',
    );
  }
  return DEFAULT_PRICING;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Compute per-category and total USD cost for a single token-usage record.
 *
 * Formula (all divided by 1 000 000):
 *   inputCostUsd      = inputTokens               × inputPerMTok
 *   outputCostUsd     = outputTokens              × outputPerMTok
 *   cacheWriteCostUsd = cacheCreationInputTokens  × cacheWritePerMTok
 *   cacheReadCostUsd  = cacheReadInputTokens      × cacheReadPerMTok
 *   totalCostUsd      = sum of all four
 *
 * @param usage - Token counts from the JSONL `message.usage` field.
 * @param model - Model ID (may carry `[1m]` suffix; normalised internally).
 */
export function computeCost(usage: TokenUsage, model: string): CostBreakdown {
  const p = getPricing(model);
  const M = 1_000_000;

  const inputCostUsd      = (usage.inputTokens               * p.inputPerMTok)      / M;
  const outputCostUsd     = (usage.outputTokens              * p.outputPerMTok)     / M;
  const cacheWriteCostUsd = (usage.cacheCreationInputTokens  * p.cacheWritePerMTok) / M;
  const cacheReadCostUsd  = (usage.cacheReadInputTokens      * p.cacheReadPerMTok)  / M;
  const totalCostUsd      = inputCostUsd + outputCostUsd + cacheWriteCostUsd + cacheReadCostUsd;

  return { inputCostUsd, outputCostUsd, cacheWriteCostUsd, cacheReadCostUsd, totalCostUsd };
}
