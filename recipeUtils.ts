import { createHash, randomBytes } from 'crypto';
import { z } from 'zod';

// Validation schemas
const RecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  servings: z.number().int().positive(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.number().positive(),
    unit: z.string().min(1),
  })).min(1),
  tags: z.array(z.string()).optional().default([]),
});

type Recipe = z.infer<typeof RecipeSchema>;

interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

/**
 * Paginate an array with proper bounds checking
 */
function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
  if (page < 1) throw new RangeError(`Page must be >= 1, got ${page}`);
  if (pageSize < 1 || pageSize > 100) throw new RangeError(`pageSize must be between 1 and 100, got ${pageSize}`);

  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);

  return {
    items: sliced,
    total: items.length,
    page,
    pageSize,
    hasNextPage: start + pageSize < items.length,
  };
}

/**
 * Generate a stable, deterministic cache key from a recipe
 */
function getCacheKey(recipe: Recipe): string {
  const normalized = JSON.stringify({
    title: recipe.title.toLowerCase().trim(),
    servings: recipe.servings,
    tags: [...recipe.tags].sort(),
  });
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Generate a secure invitation token
 */
function generateInviteToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Safely parse a recipe from unknown input (e.g. API body)
 */
function parseRecipe(input: unknown): Recipe {
  return RecipeSchema.parse(input);  // throws ZodError on invalid input
}

export { paginate, getCacheKey, generateInviteToken, parseRecipe, RecipeSchema };
export type { Recipe, PaginationResult };