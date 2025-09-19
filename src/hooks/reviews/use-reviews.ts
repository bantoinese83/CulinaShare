import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/services/reviews/review-service'
import type { 
  CreateReviewRequest, 
  UpdateReviewRequest
} from '@/types'

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  byRecipe: (recipeId: string) => [...reviewKeys.lists(), 'recipe', recipeId] as const,
  byUser: (userId: string) => [...reviewKeys.lists(), 'user', userId] as const,
  userReview: (userId: string, recipeId: string) => [...reviewKeys.all, 'user-review', userId, recipeId] as const,
  rating: (recipeId: string) => [...reviewKeys.all, 'rating', recipeId] as const,
  distribution: (recipeId: string) => [...reviewKeys.all, 'distribution', recipeId] as const,
}

// Get reviews by recipe
export function useReviewsByRecipe(recipeId: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: [...reviewKeys.byRecipe(recipeId), { limit, offset }],
    queryFn: () => reviewService.getReviewsByRecipe(recipeId, limit, offset),
    enabled: !!recipeId,
  })
}

// Get reviews by user
export function useReviewsByUser(userId: string, limit = 20, offset = 0) {
  return useQuery({
    queryKey: [...reviewKeys.byUser(userId), { limit, offset }],
    queryFn: () => reviewService.getReviewsByUser(userId, limit, offset),
    enabled: !!userId,
  })
}

// Get user's review for a specific recipe
export function useUserReviewForRecipe(userId: string, recipeId: string) {
  return useQuery({
    queryKey: reviewKeys.userReview(userId, recipeId),
    queryFn: () => reviewService.getUserReviewForRecipe(userId, recipeId),
    enabled: !!userId && !!recipeId,
  })
}

// Get average rating for a recipe
export function useAverageRating(recipeId: string) {
  return useQuery({
    queryKey: reviewKeys.rating(recipeId),
    queryFn: () => reviewService.getAverageRating(recipeId),
    enabled: !!recipeId,
  })
}

// Get rating distribution for a recipe
export function useRatingDistribution(recipeId: string) {
  return useQuery({
    queryKey: reviewKeys.distribution(recipeId),
    queryFn: () => reviewService.getRatingDistribution(recipeId),
    enabled: !!recipeId,
  })
}

// Check if user has reviewed a recipe
export function useHasUserReviewed(userId: string, recipeId: string) {
  return useQuery({
    queryKey: reviewKeys.userReview(userId, recipeId),
    queryFn: () => reviewService.hasUserReviewed(userId, recipeId),
    enabled: !!userId && !!recipeId,
  })
}

// Create review mutation
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, userId }: { data: CreateReviewRequest; userId: string }) =>
      reviewService.createReview(data, userId),
    onSuccess: (_, { data }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.byRecipe(data.recipe_id) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.rating(data.recipe_id) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.distribution(data.recipe_id) })
      queryClient.invalidateQueries({ queryKey: ['recipes', 'detail', data.recipe_id] })
    },
  })
}

// Update review mutation
export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: string; data: UpdateReviewRequest; userId: string }) =>
      reviewService.updateReview(id, data, userId),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.byRecipe(review.recipe_id) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.rating(review.recipe_id) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.distribution(review.recipe_id) })
      queryClient.invalidateQueries({ queryKey: ['recipes', 'detail', review.recipe_id] })
    },
  })
}

// Delete review mutation
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      reviewService.deleteReview(id, userId),
    onSuccess: () => {
      // We need to get the recipe_id from the deleted review to invalidate the right queries
      // This is a limitation of the current approach - we might need to return more data
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
