import { DatabaseService } from '../database/database-service'
import { supabase } from '@/lib/supabase/client'
import type { 
  UpdateUserRequest,
  User,
  UserProfile,
  UserStats
} from '@/types'

export class UserService {
  private db: DatabaseService

  constructor() {
    this.db = new DatabaseService(supabase)
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await this.db.users.getUserProfile(userId)
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async updateUserProfile(userId: string, data: UpdateUserRequest): Promise<User> {
    try {
      return await this.db.users.updateUser(userId, data)
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      return await this.db.users.getUserStats(userId)
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async searchUsers(query: string, limit = 20): Promise<User[]> {
    try {
      return await this.db.users.searchUsers(query, limit)
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      return await this.db.users.isUsernameAvailable(username)
    } catch (error) {
      throw new Error(`Failed to check username availability: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    try {
      return await this.db.users.isEmailAvailable(email)
    } catch (error) {
      throw new Error(`Failed to check email availability: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const userService = new UserService()
