import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../lib/supabase/types'
import {
  UserRepository,
  RecipeRepository,
  IngredientRepository,
  InstructionRepository,
  ReviewRepository,
} from '../../lib/database/repositories'

export class DatabaseService {
  public readonly users: UserRepository
  public readonly recipes: RecipeRepository
  public readonly ingredients: IngredientRepository
  public readonly instructions: InstructionRepository
  public readonly reviews: ReviewRepository

  constructor(supabase: SupabaseClient<Database>) {
    this.users = new UserRepository(supabase)
    this.recipes = new RecipeRepository(supabase)
    this.ingredients = new IngredientRepository(supabase)
    this.instructions = new InstructionRepository(supabase)
    this.reviews = new ReviewRepository(supabase)
  }
}

export default DatabaseService
