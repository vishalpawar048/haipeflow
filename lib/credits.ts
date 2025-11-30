import { pool } from "@/lib/auth";

export const CREDITS_PER_DOLLAR = 100;

// Pricing per 1M tokens (Gemini 2.0 Flash)
const GEMINI_2_0_FLASH_INPUT_PRICE = 0.10; // $0.10
const GEMINI_2_0_FLASH_OUTPUT_PRICE = 0.40; // $0.40

// Image generation price (approximate for Flash Image / Imagen 3)
const GEMINI_IMAGE_PRICE_PER_IMAGE = 0.04; // $0.04

// Video generation price (approximate for Veo)
const VEO_VIDEO_PRICE_PER_GENERATION = 0.20; // $0.20 per generation step

/**
 * Calculate cost in credits for text generation
 */
export const calculateTextCost = (inputTokens: number, outputTokens: number) => {
  const inputCost = (inputTokens / 1_000_000) * GEMINI_2_0_FLASH_INPUT_PRICE;
  const outputCost = (outputTokens / 1_000_000) * GEMINI_2_0_FLASH_OUTPUT_PRICE;
  const totalCostUSD = inputCost + outputCost;
  // Round up to 4 decimal places to avoid tiny fractions, but keep precision
  return Math.ceil(totalCostUSD * CREDITS_PER_DOLLAR * 10000) / 10000;
};

/**
 * Calculate cost in credits for image generation
 */
export const calculateImageCost = (count: number = 1) => {
  const costUSD = count * GEMINI_IMAGE_PRICE_PER_IMAGE;
  return costUSD * CREDITS_PER_DOLLAR;
};

/**
 * Calculate cost in credits for video generation
 */
export const calculateVideoCost = (count: number = 1) => {
  const costUSD = count * VEO_VIDEO_PRICE_PER_GENERATION;
  return costUSD * CREDITS_PER_DOLLAR;
};

/**
 * Get current user credits
 */
export async function getUserCredits(userId: string): Promise<number> {
  const res = await pool.query('SELECT credits FROM "user" WHERE id = $1', [userId]);
  return res.rows[0]?.credits ?? 0;
}

/**
 * Deduct credits from user
 * Throws error if insufficient credits
 */
export async function deductCredits(userId: string, amount: number): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const res = await client.query('SELECT credits FROM "user" WHERE id = $1 FOR UPDATE', [userId]);
    
    if (res.rows.length === 0) {
        throw new Error("User not found");
    }

    const currentCredits = res.rows[0].credits;

    if (currentCredits < amount) {
      throw new Error("Insufficient credits");
    }

    const newCredits = currentCredits - amount;
    await client.query('UPDATE "user" SET credits = $1 WHERE id = $2', [newCredits, userId]);
    await client.query("COMMIT");
    return newCredits;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Check if user has sufficient credits
 */
export async function hasSufficientCredits(userId: string, estimatedAmount: number): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits >= estimatedAmount;
}

