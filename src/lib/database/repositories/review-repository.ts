import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'
import { BaseRepository } from '../base-repository'
import type { Review, ReviewWithDetails, CreateReviewRequest, UpdateReviewRequest } from '@/types'

export class ReviewRepository extends BaseRepository<Review> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'reviews')
  }

  async createReview(data: CreateReviewRequest, userId: string): Promise<Review> {
    const { data: result, error } = await (this.supabase
      .from('reviews') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([{
        user_id: userId,
        recipe_id: data.recipe_id,
        rating: data.rating,
        comment: data.comment,
        is_verified: false,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`)
    }

    return result as Review
  }

  async updateReview(id: string, data: UpdateReviewRequest): Promise<Review> {
    return this.update(id, data)
  }

  async getByRecipeId(recipeId: string, limit = 20, offset = 0): Promise<ReviewWithDetails[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, username, profile_picture_url)
      `)
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to get reviews by recipe ID: ${error.message}`)
    }

    return data as ReviewWithDetails[]
  }

  async getByUserId(userId: string, limit = 20, offset = 0): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select(`
        *,
        recipe:recipes(id, title, image_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to get reviews by user ID: ${error.message}`)
    }

    return data as Review[]
  }

  async getByUserAndRecipe(userId: string, recipeId: string): Promise<Review | null> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to get review by user and recipe: ${error.message}`)
    }

    return data as Review
  }

  async getAverageRating(recipeId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Failed to get average rating: ${error.message}`)
    }

    if (data.length === 0) {
      return 0
    }

    const sum = (data as { rating: number }[]).reduce((acc, review) => acc + review.rating, 0)
    return sum / data.length
  }

  async getRatingDistribution(recipeId: string): Promise<Record<number, number>> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Failed to get rating distribution: ${error.message}`)
    }

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    
    (data as { rating: number }[]).forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })

    return distribution
  }

  async deleteByRecipeId(recipeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('reviews')
      .delete()
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Failed to delete reviews by recipe ID: ${error.message}`)
    }
  }

  async hasUserReviewed(userId: string, recipeId: string): Promise<boolean> {
    const review = await this.getByUserAndRecipe(userId, recipeId)
    return review !== null
  }
}
