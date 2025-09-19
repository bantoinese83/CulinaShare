import { supabase } from '../supabase/client'
import { DatabaseService } from '../../services/database/database-service'
import type { 
  SignUpRequest, 
  SignInRequest, 
  SignInWithProviderRequest, 
  ResetPasswordRequest, 
  UpdatePasswordRequest,
  AuthUser,
  User,
  CreateUserProfileRequest
} from '@/types'

export class AuthService {
  private db: DatabaseService

  constructor() {
    this.db = new DatabaseService(supabase)
  }

  async signUp(data: SignUpRequest): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      // Check if username is available
      const isUsernameAvailable = await this.db.users.isUsernameAvailable(data.username)
      if (!isUsernameAvailable) {
        return { user: null, error: new Error('Username is already taken') }
      }

      // Check if email is available
      const isEmailAvailable = await this.db.users.isEmailAvailable(data.email)
      if (!isEmailAvailable) {
        return { user: null, error: new Error('Email is already registered') }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      })

      if (authError) {
        return { user: null, error: authError }
      }

      if (!authData.user) {
        return { user: null, error: new Error('Failed to create user') }
      }

      // Create user profile
      await this.db.users.createUser({
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
      } as CreateUserProfileRequest)

      return { user: authData.user as unknown as AuthUser, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async signIn(data: SignInRequest): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return { user: null, error }
      }

      return { user: authData.user as unknown as AuthUser, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async signInWithProvider(data: SignInWithProviderRequest): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: data.provider,
        options: {
          redirectTo: data.redirect_to || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: data.redirect_to || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async updatePassword(data: UpdatePasswordRequest): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        return { user: null, error: new Error('User not authenticated') }
      }

      const user = await this.db.users.updateUser(authUser.id, data)
      return { user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async getCurrentUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        return { user: null, error }
      }

      return { user: user as unknown as AuthUser, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  async getSession(): Promise<{ session: unknown; error: Error | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (error) {
      return { session: null, error: error as Error }
    }
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()
