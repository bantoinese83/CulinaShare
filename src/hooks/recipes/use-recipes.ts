import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { recipeService } from '@/services/recipes/recipe-service'
import type { 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeSearchParams
} from '@/types'

// Query keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params: RecipeSearchParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  featured: () => [...recipeKeys.all, 'featured'] as const,
  popular: () => [...recipeKeys.all, 'popular'] as const,
  recent: () => [...recipeKeys.all, 'recent'] as const,
}

// Get recipe by ID
export function useRecipe(id: string, userId?: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipeService.getRecipe(id, userId),
    enabled: !!id,
  })
}

// Search recipes
export function useSearchRecipes(params: RecipeSearchParams) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipeService.searchRecipes(params),
    placeholderData: keepPreviousData,
  })
}

// Get featured recipes
export function useFeaturedRecipes(limit = 10) {
  return useQuery({
    queryKey: [...recipeKeys.featured(), limit],
    queryFn: () => recipeService.getFeaturedRecipes(limit),
  })
}

// Get popular recipes
export function usePopularRecipes(limit = 10) {
  return useQuery({
    queryKey: [...recipeKeys.popular(), limit],
    queryFn: () => recipeService.getPopularRecipes(limit),
  })
}

// Get recent recipes
export function useRecentRecipes(limit = 10) {
  return useQuery({
    queryKey: [...recipeKeys.recent(), limit],
    queryFn: () => recipeService.getRecentRecipes(limit),
  })
}

// Create recipe mutation
export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, userId }: { data: CreateRecipeRequest; userId: string }) =>
      recipeService.createRecipe(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.featured() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.popular() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.recent() })
    },
  })
}

// Update recipe mutation
export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: string; data: UpdateRecipeRequest; userId: string }) =>
      recipeService.updateRecipe(id, data, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
    },
  })
}

// Delete recipe mutation
export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      recipeService.deleteRecipe(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.featured() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.popular() })
      queryClient.invalidateQueries({ queryKey: recipeKeys.recent() })
    },
  })
}

// Toggle like mutation
export function useToggleLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipeId, userId }: { recipeId: string; userId: string }) =>
      recipeService.toggleLike(recipeId, userId),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
    },
  })
}

// Toggle save mutation
export function useToggleSave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recipeId, userId }: { recipeId: string; userId: string }) =>
      recipeService.toggleSave(recipeId, userId),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) })
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
    },
  })
}
