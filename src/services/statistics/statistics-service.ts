import { supabase } from '@/lib/supabase/client'
import type { AppStatistics } from '@/types/statistics'

export class StatisticsService {
  async getAppStatistics(): Promise<AppStatistics> {
    try {

      // Get total recipes count
      const { count: totalRecipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      if (recipesError) {
        throw new Error(`Failed to get recipes count: ${recipesError.message}`)
      }

      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (usersError) {
        throw new Error(`Failed to get users count: ${usersError.message}`)
      }

      // Get unique cuisine types count
      const { data: cuisineData, error: cuisineError } = await supabase
        .from('recipes')
        .select('cuisine')
        .eq('is_published', true)
        .not('cuisine', 'is', null)

      if (cuisineError) {
        throw new Error(`Failed to get cuisine types: ${cuisineError.message}`)
      }

      // Count unique cuisine types
      const uniqueCuisines = new Set(
        cuisineData?.map(recipe => recipe.cuisine).filter(Boolean) || []
      )

      return {
        totalRecipes: totalRecipes || 0,
        totalUsers: totalUsers || 0,
        totalCuisineTypes: uniqueCuisines.size,
      }
    } catch (error) {
      console.error('Error fetching app statistics:', error)
      // Return fallback values if there's an error
      return {
        totalRecipes: 0,
        totalUsers: 0,
        totalCuisineTypes: 0,
      }
    }
  }

  async getRecipeCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      if (error) {
        throw new Error(`Failed to get recipe count: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      console.error('Error fetching recipe count:', error)
      return 0
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (error) {
        throw new Error(`Failed to get user count: ${error.message}`)
      }

      return count || 0
    } catch (error) {
      console.error('Error fetching user count:', error)
      return 0
    }
  }

  async getCuisineTypesCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('cuisine')
        .eq('is_published', true)
        .not('cuisine', 'is', null)

      if (error) {
        throw new Error(`Failed to get cuisine types: ${error.message}`)
      }

      // Count unique cuisine types
      const uniqueCuisines = new Set(
        data?.map(recipe => recipe.cuisine).filter(Boolean) || []
      )

      return uniqueCuisines.size
    } catch (error) {
      console.error('Error fetching cuisine types count:', error)
      return 0
    }
  }
}

// Create singleton instance
export const statisticsService = new StatisticsService()
