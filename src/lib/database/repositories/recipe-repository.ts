import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'
import { BaseRepository } from '../base-repository'
import type { 
  Recipe, 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeWithDetails, 
  RecipeSearchParams
} from '@/types'

export class RecipeRepository extends BaseRepository<Recipe> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'recipes')
  }

  async createRecipe(data: CreateRecipeRequest, userId: string): Promise<Recipe> {
    const { data: result, error } = await (this.supabase
      .from('recipes') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([{
        user_id: userId,
        title: data.title,
        description: data.description,
        prep_time: data.prep_time,
        cook_time: data.cook_time,
        total_time: data.prep_time + data.cook_time,
        servings: data.servings,
        cuisine: data.cuisine,
        difficulty: data.difficulty,
        dietary_tags: data.dietary_tags,
        image_url: data.image_url,
        is_published: false,
        is_featured: false,
        view_count: 0,
        like_count: 0,
        average_rating: 0,
        total_ratings: 0,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create recipe: ${error.message}`)
    }

    return result as Recipe
  }

  async updateRecipe(id: string, data: UpdateRecipeRequest): Promise<Recipe> {
    const updateData: Record<string, unknown> = { ...data }
    
    if (data.prep_time !== undefined && data.cook_time !== undefined) {
      updateData.total_time = data.prep_time + data.cook_time
    }

    return this.update(id, updateData)
  }

  async getRecipeWithDetails(id: string, userId?: string): Promise<RecipeWithDetails | null> {
    const selectQuery = `
      *,
      user:users(id, username, profile_picture_url),
      ingredients:ingredients(*),
      instructions:instructions(*),
      reviews:reviews(*)
      ${userId ? `,user_rating:reviews!user_id(rating),user_liked:recipe_likes!user_id(id),user_saved:recipe_saves!user_id(id)` : ''}
    `
    
    const { data, error } = await this.supabase
      .from('recipes')
      .select(selectQuery)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get recipe with details: ${error.message}`)
    }

    return data as RecipeWithDetails
  }

  async searchRecipes(params: RecipeSearchParams): Promise<Recipe[]> {
    let query = this.supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)

    // Apply search filters
    if (params.query) {
      query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
    }

    if (params.cuisine) {
      query = query.eq('cuisine', params.cuisine)
    }

    if (params.difficulty) {
      query = query.eq('difficulty', params.difficulty)
    }

    if (params.dietary_tags && params.dietary_tags.length > 0) {
      query = query.overlaps('dietary_tags', params.dietary_tags)
    }

    if (params.prep_time_max) {
      query = query.lte('prep_time', params.prep_time_max)
    }

    if (params.cook_time_max) {
      query = query.lte('cook_time', params.cook_time_max)
    }

    if (params.min_rating) {
      query = query.gte('average_rating', params.min_rating)
    }

    if (params.user_id) {
      query = query.eq('user_id', params.user_id)
    }

    // Apply sorting
    const sortBy = params.sort_by || 'created_at'
    const sortOrder = params.sort_order || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 20
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to search recipes: ${error.message}`)
    }

    return data as Recipe[]
  }

  async getFeaturedRecipes(limit = 10): Promise<Recipe[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get featured recipes: ${error.message}`)
    }

    return data as Recipe[]
  }

  async getPopularRecipes(limit = 10): Promise<Recipe[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get popular recipes: ${error.message}`)
    }

    return data as Recipe[]
  }

  async getRecentRecipes(limit = 10): Promise<Recipe[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get recent recipes: ${error.message}`)
    }

    return data as Recipe[]
  }

  async incrementViewCount(id: string): Promise<void> {
    const { error } = await (this.supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .rpc('increment_view_count', { recipe_id: id })

    if (error) {
      throw new Error(`Failed to increment view count: ${error.message}`)
    }
  }

  async toggleLike(recipeId: string, userId: string): Promise<{ liked: boolean }> {
    // Check if already liked
    const { data: existingLike, error: checkError } = await this.supabase
      .from('recipe_likes')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Failed to check like status: ${checkError.message}`)
    }

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await this.supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)

      if (deleteError) {
        throw new Error(`Failed to unlike recipe: ${deleteError.message}`)
      }

      return { liked: false }
    } else {
      // Like
      const { error: insertError } = await (this.supabase
        .from('recipe_likes') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .insert([{ recipe_id: recipeId, user_id: userId }])

      if (insertError) {
        throw new Error(`Failed to like recipe: ${insertError.message}`)
      }

      return { liked: true }
    }
  }

  async toggleSave(recipeId: string, userId: string): Promise<{ saved: boolean }> {
    // Check if already saved
    const { data: existingSave, error: checkError } = await this.supabase
      .from('recipe_saves')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Failed to check save status: ${checkError.message}`)
    }

    if (existingSave) {
      // Unsave
      const { error: deleteError } = await this.supabase
        .from('recipe_saves')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)

      if (deleteError) {
        throw new Error(`Failed to unsave recipe: ${deleteError.message}`)
      }

      return { saved: false }
    } else {
      // Save
      const { error: insertError } = await (this.supabase
        .from('recipe_saves') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .insert([{ recipe_id: recipeId, user_id: userId }])

      if (insertError) {
        throw new Error(`Failed to save recipe: ${insertError.message}`)
      }

      return { saved: true }
    }
  }
}
