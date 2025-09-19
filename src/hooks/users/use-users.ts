import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/users/user-service'
import type { 
  UpdateUserRequest
} from '@/types'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: (userId: string) => [...userKeys.profiles(), userId] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  userStats: (userId: string) => [...userKeys.stats(), userId] as const,
  search: () => [...userKeys.all, 'search'] as const,
  searchQuery: (query: string) => [...userKeys.search(), query] as const,
}

// Get user profile
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
  })
}

// Get user stats
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userKeys.userStats(userId),
    queryFn: () => userService.getUserStats(userId),
    enabled: !!userId,
  })
}

// Search users
export function useSearchUsers(query: string, limit = 20) {
  return useQuery({
    queryKey: userKeys.searchQuery(query),
    queryFn: () => userService.searchUsers(query, limit),
    enabled: !!query && query.length >= 2,
  })
}

// Check username availability
export function useUsernameAvailability(username: string) {
  return useQuery({
    queryKey: [...userKeys.all, 'username-availability', username],
    queryFn: () => userService.isUsernameAvailable(username),
    enabled: !!username && username.length >= 3,
  })
}

// Check email availability
export function useEmailAvailability(email: string) {
  return useQuery({
    queryKey: [...userKeys.all, 'email-availability', email],
    queryFn: () => userService.isEmailAvailable(email),
    enabled: !!email && email.includes('@'),
  })
}

// Update user profile mutation
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      userService.updateUserProfile(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.userStats(userId) })
    },
  })
}
