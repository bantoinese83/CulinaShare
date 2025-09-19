import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { authService } from '../../lib/auth/auth-service'
import type { AuthState, AuthUser, SignUpRequest, SignInRequest, SignInWithProviderRequest, ResetPasswordRequest, UpdatePasswordRequest, User } from '@/types'

interface AuthStore extends AuthState {
  // Actions
  signUp: (data: SignUpRequest) => Promise<void>
  signIn: (data: SignInRequest) => Promise<void>
  signInWithProvider: (data: SignInWithProviderRequest) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  initialize: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    loading: true,
    error: null,

    // Actions
    signUp: async (data: SignUpRequest) => {
      set({ loading: true, error: null })
      
      const { user, error } = await authService.signUp(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ user, loading: false, error: null })
    },

    signIn: async (data: SignInRequest) => {
      set({ loading: true, error: null })
      
      const { user, error } = await authService.signIn(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ user, loading: false, error: null })
    },

    signInWithProvider: async (data: SignInWithProviderRequest) => {
      set({ loading: true, error: null })
      
      const { error } = await authService.signInWithProvider(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ loading: false, error: null })
    },

    signOut: async () => {
      set({ loading: true, error: null })
      
      const { error } = await authService.signOut()
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ user: null, loading: false, error: null })
    },

    resetPassword: async (data: ResetPasswordRequest) => {
      set({ loading: true, error: null })
      
      const { error } = await authService.resetPassword(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ loading: false, error: null })
    },

    updatePassword: async (data: UpdatePasswordRequest) => {
      set({ loading: true, error: null })
      
      const { error } = await authService.updatePassword(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ loading: false, error: null })
    },

    updateProfile: async (data: Partial<User>) => {
      set({ loading: true, error: null })
      
      const { user, error } = await authService.updateProfile(data)
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      if (user) {
        set({ user: { ...get().user, ...user } as AuthUser, loading: false, error: null })
      } else {
        set({ loading: false, error: 'Failed to update profile' })
      }
    },

    initialize: async () => {
      set({ loading: true, error: null })
      
      const { user, error } = await authService.getCurrentUser()
      
      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ user, loading: false, error: null })
    },

    setUser: (user: AuthUser | null) => {
      set({ user })
    },

    setLoading: (loading: boolean) => {
      set({ loading })
    },

    setError: (error: string | null) => {
      set({ error })
    },

    clearError: () => {
      set({ error: null })
    },
  }))
)
