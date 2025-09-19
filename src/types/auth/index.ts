import { User } from '../user'

export interface AuthUser extends User {
  // Supabase auth user properties
  aud: string
  role?: string
  email_confirmed_at?: string
  phone_confirmed_at?: string
  last_sign_in_at?: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  identities: Array<{
    id: string
    user_id: string
    identity_data: Record<string, unknown>
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
  }>
  factors?: Array<{
    id: string
    user_id: string
    factor_type: string
    status: string
    created_at: string
    updated_at: string
  }>
}

export interface SignUpRequest {
  email: string
  password: string
  username: string
  first_name?: string
  last_name?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInWithProviderRequest {
  provider: 'google' | 'github' | 'apple'
  redirect_to?: string
}

export interface ResetPasswordRequest {
  email: string
  redirect_to?: string
}

export interface UpdatePasswordRequest {
  password: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signUp: (data: SignUpRequest) => Promise<{ error: Error | null }>
  signIn: (data: SignInRequest) => Promise<{ error: Error | null }>
  signInWithProvider: (data: SignInWithProviderRequest) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (data: ResetPasswordRequest) => Promise<{ error: Error | null }>
  updatePassword: (data: UpdatePasswordRequest) => Promise<{ error: Error | null }>
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>
}
