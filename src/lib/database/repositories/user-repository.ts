import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'
import { BaseRepository } from '../base-repository'
import type { User, CreateUserRequest, CreateUserProfileRequest, UpdateUserRequest, UserProfile, UserStats } from '@/types'

export class UserRepository extends BaseRepository<User> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'users')
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to find user by email: ${error.message}`)
    }

    return data as User
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to find user by username: ${error.message}`)
    }

    return data as User
  }

  async createUser(data: CreateUserRequest | CreateUserProfileRequest): Promise<User> {
    const { data: result, error } = await (this.supabase
      .from('users') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([{
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        is_verified: false,
        is_active: true,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return result as User
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return this.update(id, data)
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to get user profile: ${error.message}`)
    }

    if (!data) {
      return null
    }

    // Get additional counts separately
    const [recipeCount, reviewCount] = await Promise.all([
      this.supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', id)
        .then(({ count }) => count || 0),
      this.supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', id)
        .then(({ count }) => count || 0)
    ])

    return {
      ...(data as User),
      recipe_count: recipeCount,
      review_count: reviewCount,
      follower_count: 0, // TODO: Implement when user follows are added
      following_count: 0, // TODO: Implement when user follows are added
    } as UserProfile
  }

  async getUserStats(id: string): Promise<UserStats | null> {
    try {
      // First check if user exists
      const { data: userExists } = await this.supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (!userExists) {
        return null
      }

      // Get recipe count
      const { count: recipeCount } = await this.supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', id)

      // Get review count
      const { count: reviewCount } = await this.supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', id)

      // Get average rating from reviews
      const { data: ratingData } = await this.supabase
        .from('reviews')
        .select('rating')
        .eq('user_id', id)

      const averageRating = ratingData && ratingData.length > 0
        ? ratingData.reduce((sum, review) => sum + (review as { rating: number }).rating, 0) / ratingData.length
        : 0

      return {
        total_recipes: recipeCount || 0,
        total_reviews: reviewCount || 0,
        total_followers: 0, // TODO: Implement when user follows are added
        total_following: 0, // TODO: Implement when user follows are added
        average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      } as UserStats
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async searchUsers(query: string, limit = 20): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      throw new Error(`Failed to search users: ${error.message}`)
    }

    return data as User[]
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.findByUsername(username)
    return user === null
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user === null
  }
}
