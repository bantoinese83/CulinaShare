import { DatabaseService } from '../database/database-service'
import { supabase } from '@/lib/supabase/client'
import type { 
  CreateReviewRequest, 
  UpdateReviewRequest,
  Review,
  ReviewWithDetails
} from '@/types'

export class ReviewService {
  private db: DatabaseService

  constructor() {
    this.db = new DatabaseService(supabase)
  }

  async createReview(data: CreateReviewRequest, userId: string): Promise<Review> {
    try {
      return await this.db.reviews.createReview(data, userId)
    } catch (error) {
      throw new Error(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateReview(id: string, data: UpdateReviewRequest, userId: string): Promise<Review> {
    try {
      // Verify ownership
      const existingReview = await this.db.reviews.findById(id)
      if (!existingReview || existingReview.user_id !== userId) {
        throw new Error('Review not found or access denied')
      }

      return await this.db.reviews.updateReview(id, data)
    } catch (error) {
      throw new Error(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    try {
      // Verify ownership
      const existingReview = await this.db.reviews.findById(id)
      if (!existingReview || existingReview.user_id !== userId) {
        throw new Error('Review not found or access denied')
      }

      await this.db.reviews.delete(id)
    } catch (error) {
      throw new Error(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getReviewsByRecipe(recipeId: string, limit = 20, offset = 0): Promise<ReviewWithDetails[]> {
    try {
      return await this.db.reviews.getByRecipeId(recipeId, limit, offset)
    } catch (error) {
      throw new Error(`Failed to get reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getReviewsByUser(userId: string, limit = 20, offset = 0): Promise<Review[]> {
    try {
      return await this.db.reviews.getByUserId(userId, limit, offset)
    } catch (error) {
      throw new Error(`Failed to get user reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getUserReviewForRecipe(userId: string, recipeId: string): Promise<Review | null> {
    try {
      return await this.db.reviews.getByUserAndRecipe(userId, recipeId)
    } catch (error) {
      throw new Error(`Failed to get user review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAverageRating(recipeId: string): Promise<number> {
    try {
      return await this.db.reviews.getAverageRating(recipeId)
    } catch (error) {
      throw new Error(`Failed to get average rating: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getRatingDistribution(recipeId: string): Promise<Record<number, number>> {
    try {
      return await this.db.reviews.getRatingDistribution(recipeId)
    } catch (error) {
      throw new Error(`Failed to get rating distribution: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async hasUserReviewed(userId: string, recipeId: string): Promise<boolean> {
    try {
      return await this.db.reviews.hasUserReviewed(userId, recipeId)
    } catch (error) {
      throw new Error(`Failed to check review status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const reviewService = new ReviewService()
