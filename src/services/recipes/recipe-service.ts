import { DatabaseService } from '../database/database-service'
import { supabase } from '@/lib/supabase/client'
import type { 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeSearchParams,
  RecipeWithDetails,
  Recipe
} from '@/types'

export class RecipeService {
  private db: DatabaseService

  constructor() {
    this.db = new DatabaseService(supabase)
  }

  async createRecipe(data: CreateRecipeRequest, userId: string): Promise<Recipe> {
    try {
      // Create the recipe
      const recipe = await this.db.recipes.createRecipe(data, userId)
      
      // Create ingredients
      if (data.ingredients.length > 0) {
        await this.db.ingredients.createIngredients(data.ingredients, recipe.id)
      }
      
      // Create instructions
      if (data.instructions.length > 0) {
        await this.db.instructions.createInstructions(data.instructions, recipe.id)
      }
      
      return recipe
    } catch (error) {
      throw new Error(`Failed to create recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateRecipe(id: string, data: UpdateRecipeRequest, userId: string): Promise<Recipe> {
    try {
      // Verify ownership
      const existingRecipe = await this.db.recipes.findById(id)
      if (!existingRecipe || existingRecipe.user_id !== userId) {
        throw new Error('Recipe not found or access denied')
      }

      // Update the recipe
      const recipe = await this.db.recipes.updateRecipe(id, data)
      
      return recipe
    } catch (error) {
      throw new Error(`Failed to update recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteRecipe(id: string, userId: string): Promise<void> {
    try {
      // Verify ownership
      const existingRecipe = await this.db.recipes.findById(id)
      if (!existingRecipe || existingRecipe.user_id !== userId) {
        throw new Error('Recipe not found or access denied')
      }

      // Delete the recipe (ingredients and instructions will be deleted via CASCADE)
      await this.db.recipes.delete(id)
    } catch (error) {
      throw new Error(`Failed to delete recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getRecipe(id: string, userId?: string): Promise<RecipeWithDetails | null> {
    try {
      const recipe = await this.db.recipes.getRecipeWithDetails(id, userId)
      
      if (recipe) {
        // Increment view count
        await this.db.recipes.incrementViewCount(id)
      }
      
      return recipe
    } catch (error) {
      throw new Error(`Failed to get recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async searchRecipes(params: RecipeSearchParams): Promise<Recipe[]> {
    try {
      return await this.db.recipes.searchRecipes(params)
    } catch (error) {
      throw new Error(`Failed to search recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getFeaturedRecipes(limit = 10): Promise<Recipe[]> {
    try {
      return await this.db.recipes.getFeaturedRecipes(limit)
    } catch (error) {
      throw new Error(`Failed to get featured recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getPopularRecipes(limit = 10): Promise<Recipe[]> {
    try {
      return await this.db.recipes.getPopularRecipes(limit)
    } catch (error) {
      throw new Error(`Failed to get popular recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getRecentRecipes(limit = 10): Promise<Recipe[]> {
    try {
      return await this.db.recipes.getRecentRecipes(limit)
    } catch (error) {
      throw new Error(`Failed to get recent recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async toggleLike(recipeId: string, userId: string): Promise<{ liked: boolean }> {
    try {
      return await this.db.recipes.toggleLike(recipeId, userId)
    } catch (error) {
      throw new Error(`Failed to toggle like: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async toggleSave(recipeId: string, userId: string): Promise<{ saved: boolean }> {
    try {
      return await this.db.recipes.toggleSave(recipeId, userId)
    } catch (error) {
      throw new Error(`Failed to toggle save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const recipeService = new RecipeService()
