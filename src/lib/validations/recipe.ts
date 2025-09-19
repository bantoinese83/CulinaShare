import { z } from 'zod'
import { RECIPE_CONFIG } from '@/config/constants'

const difficultySchema = z.enum(['easy', 'medium', 'hard', 'expert'])
const dietaryTagSchema = z.enum([
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'keto',
  'paleo',
  'low-carb',
  'high-protein',
  'low-sodium',
  'sugar-free',
  'halal',
  'kosher',
])

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required').max(100, 'Ingredient name must be less than 100 characters'),
  quantity: z.string().min(1, 'Quantity is required').max(50, 'Quantity must be less than 50 characters'),
  unit: z.string().max(20, 'Unit must be less than 20 characters').optional(),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
  order_index: z.number().int().min(0, 'Order index must be non-negative'),
})

export const instructionSchema = z.object({
  step_number: z.number().int().min(1, 'Step number must be at least 1'),
  description: z.string().min(1, 'Instruction description is required').max(RECIPE_CONFIG.MAX_INSTRUCTION_LENGTH, `Instruction must be less than ${RECIPE_CONFIG.MAX_INSTRUCTION_LENGTH} characters`),
  image_url: z.string().url('Invalid image URL').optional(),
  time_estimate: z.number().int().min(0, 'Time estimate must be non-negative').optional(),
})

export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Recipe title is required').max(RECIPE_CONFIG.MAX_TITLE_LENGTH, `Title must be less than ${RECIPE_CONFIG.MAX_TITLE_LENGTH} characters`),
  description: z.string().max(RECIPE_CONFIG.MAX_DESCRIPTION_LENGTH, `Description must be less than ${RECIPE_CONFIG.MAX_DESCRIPTION_LENGTH} characters`).optional(),
  prep_time: z.number().int().min(0, 'Prep time must be non-negative').max(1440, 'Prep time must be less than 24 hours'),
  cook_time: z.number().int().min(0, 'Cook time must be non-negative').max(1440, 'Cook time must be less than 24 hours'),
  servings: z.number().int().min(1, 'Servings must be at least 1').max(50, 'Servings must be less than 50'),
  cuisine: z.string().max(50, 'Cuisine must be less than 50 characters').optional(),
  difficulty: difficultySchema,
  dietary_tags: z.array(dietaryTagSchema).max(10, 'Maximum 10 dietary tags allowed'),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required').max(RECIPE_CONFIG.MAX_INGREDIENTS, `Maximum ${RECIPE_CONFIG.MAX_INGREDIENTS} ingredients allowed`),
  instructions: z.array(instructionSchema).min(1, 'At least one instruction is required').max(RECIPE_CONFIG.MAX_INSTRUCTIONS, `Maximum ${RECIPE_CONFIG.MAX_INSTRUCTIONS} instructions allowed`),
  image_url: z.string().url('Invalid image URL').optional(),
})

export const updateRecipeSchema = createRecipeSchema.partial().omit({ ingredients: true, instructions: true })

export const createReviewSchema = z.object({
  recipe_id: z.string().uuid('Invalid recipe ID'),
  rating: z.number().int().min(RECIPE_CONFIG.MIN_RATING, `Rating must be at least ${RECIPE_CONFIG.MIN_RATING}`).max(RECIPE_CONFIG.MAX_RATING, `Rating must be at most ${RECIPE_CONFIG.MAX_RATING}`),
  comment: z.string().max(RECIPE_CONFIG.MAX_REVIEW_LENGTH, `Comment must be less than ${RECIPE_CONFIG.MAX_REVIEW_LENGTH} characters`).optional(),
})

export const updateReviewSchema = z.object({
  rating: z.number().int().min(RECIPE_CONFIG.MIN_RATING, `Rating must be at least ${RECIPE_CONFIG.MIN_RATING}`).max(RECIPE_CONFIG.MAX_RATING, `Rating must be at most ${RECIPE_CONFIG.MAX_RATING}`).optional(),
  comment: z.string().max(RECIPE_CONFIG.MAX_REVIEW_LENGTH, `Comment must be less than ${RECIPE_CONFIG.MAX_REVIEW_LENGTH} characters`).optional(),
})

export const recipeSearchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  cuisine: z.string().max(50, 'Cuisine must be less than 50 characters').optional(),
  difficulty: difficultySchema.optional(),
  dietary_tags: z.array(dietaryTagSchema).optional(),
  prep_time_max: z.number().int().min(0).max(1440).optional(),
  cook_time_max: z.number().int().min(0).max(1440).optional(),
  min_rating: z.number().min(0).max(5).optional(),
  user_id: z.string().uuid('Invalid user ID').optional(),
  is_published: z.boolean().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title', 'prep_time', 'cook_time', 'average_rating', 'view_count', 'like_count']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type RecipeSearchInput = z.infer<typeof recipeSearchSchema>
export type IngredientInput = z.infer<typeof ingredientSchema>
export type InstructionInput = z.infer<typeof instructionSchema>
