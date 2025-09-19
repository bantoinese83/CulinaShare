import { useQuery } from '@tanstack/react-query'
import { statisticsService } from '@/services/statistics/statistics-service'

// Query keys
export const statisticsKeys = {
  all: ['statistics'] as const,
  app: () => [...statisticsKeys.all, 'app'] as const,
  recipes: () => [...statisticsKeys.all, 'recipes'] as const,
  users: () => [...statisticsKeys.all, 'users'] as const,
  cuisines: () => [...statisticsKeys.all, 'cuisines'] as const,
}

// Get all app statistics
export function useAppStatistics() {
  return useQuery({
    queryKey: statisticsKeys.app(),
    queryFn: () => statisticsService.getAppStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Get recipe count only
export function useRecipeCount() {
  return useQuery({
    queryKey: statisticsKeys.recipes(),
    queryFn: () => statisticsService.getRecipeCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Get user count only
export function useUserCount() {
  return useQuery({
    queryKey: statisticsKeys.users(),
    queryFn: () => statisticsService.getUserCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Get cuisine types count only
export function useCuisineTypesCount() {
  return useQuery({
    queryKey: statisticsKeys.cuisines(),
    queryFn: () => statisticsService.getCuisineTypesCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
