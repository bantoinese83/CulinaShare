import { useEffect } from 'react'
import { useAuthStore } from '../../stores/auth/auth-store'
import { authService } from '../../lib/auth/auth-service'
import type { SignUpRequest, SignInRequest, SignInWithProviderRequest, ResetPasswordRequest, UpdatePasswordRequest, AuthUser, User } from '@/types'

export function useAuth() {
  const {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    initialize,
    setUser,
    setLoading,
    clearError,
  } = useAuthStore()

  // Initialize auth state on mount
  useEffect(() => {
    initialize()

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && typeof session === 'object' && 'user' in session && session.user) {
        setUser(session.user as AuthUser)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session && typeof session === 'object' && 'user' in session && session.user) {
        setUser(session.user as AuthUser)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialize, setUser, setLoading])

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // Actions
    signUp: async (data: SignUpRequest) => {
      clearError()
      await signUp(data)
    },
    signIn: async (data: SignInRequest) => {
      clearError()
      await signIn(data)
    },
    signInWithProvider: async (data: SignInWithProviderRequest) => {
      clearError()
      await signInWithProvider(data)
    },
    signOut: async () => {
      clearError()
      await signOut()
    },
    resetPassword: async (data: ResetPasswordRequest) => {
      clearError()
      await resetPassword(data)
    },
    updatePassword: async (data: UpdatePasswordRequest) => {
      clearError()
      await updatePassword(data)
    },
    updateProfile: async (data: Partial<User>) => {
      clearError()
      await updateProfile(data)
    },
    clearError,
  }
}
