import { BaseEntity } from '../common'

export interface Recipe extends BaseEntity {
  user_id: string
  title: string
  description?: string
  image_url?: string
  prep_time: number
  cook_time: number
  total_time: number
  servings: number
  cuisine?: string
  difficulty: RecipeDifficulty
  dietary_tags: DietaryTag[]
  is_published: boolean
  is_featured: boolean
  view_count: number
  like_count: number
  average_rating: number
  total_ratings: number
}

export interface Ingredient extends BaseEntity {
  recipe_id: string
  name: string
  quantity: string
  unit?: string
  notes?: string
  order_index: number
}

export interface Instruction extends BaseEntity {
  recipe_id: string
  step_number: number
  description: string
  image_url?: string
  time_estimate?: number
}

export interface Review extends BaseEntity {
  user_id: string
  recipe_id: string
  rating: number
  comment?: string
  is_verified: boolean
}

export interface ReviewWithDetails extends Review {
  user: {
    id: string
    username: string
    profile_picture_url?: string
  }
}

export interface CreateRecipeRequest {
  title: string
  description?: string
  prep_time: number
  cook_time: number
  servings: number
  cuisine?: string
  difficulty: RecipeDifficulty
  dietary_tags: DietaryTag[]
  ingredients: CreateIngredientRequest[]
  instructions: CreateInstructionRequest[]
  image_url?: string
}

export interface CreateIngredientRequest {
  name: string
  quantity: string
  unit?: string
  notes?: string
  order_index: number
}

export interface CreateInstructionRequest {
  step_number: number
  description: string
  image_url?: string
  time_estimate?: number
}

export interface UpdateRecipeRequest {
  title?: string
  description?: string
  prep_time?: number
  cook_time?: number
  servings?: number
  cuisine?: string
  difficulty?: RecipeDifficulty
  dietary_tags?: DietaryTag[]
  is_published?: boolean
  image_url?: string
}

export interface CreateReviewRequest {
  recipe_id: string
  rating: number
  comment?: string
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
}

export interface RecipeWithDetails extends Recipe {
  user: {
    id: string
    username: string
    profile_picture_url?: string
  }
  ingredients: Ingredient[]
  instructions: Instruction[]
  reviews: Review[]
  user_rating?: number
  user_liked: boolean
  user_saved: boolean
}

export interface RecipeSearchParams {
  query?: string
  cuisine?: string
  difficulty?: RecipeDifficulty
  dietary_tags?: DietaryTag[]
  prep_time_max?: number
  cook_time_max?: number
  min_rating?: number
  user_id?: string
  is_published?: boolean
  sort_by?: RecipeSortField
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export type RecipeDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type DietaryTag = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'high-protein'
  | 'low-sodium'
  | 'sugar-free'
  | 'halal'
  | 'kosher'

export type RecipeSortField = 
  | 'created_at'
  | 'updated_at'
  | 'title'
  | 'prep_time'
  | 'cook_time'
  | 'average_rating'
  | 'view_count'
  | 'like_count'
