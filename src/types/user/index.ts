import { BaseEntity } from '../common'

export interface User extends BaseEntity {
  email: string
  username: string
  profile_picture_url?: string
  first_name?: string
  last_name?: string
  bio?: string
  location?: string
  website?: string
  is_verified: boolean
  is_active: boolean
}

export interface CreateUserRequest {
  email: string
  username: string
  password: string
  first_name?: string
  last_name?: string
}

export interface CreateUserProfileRequest {
  email: string
  username: string
  first_name?: string
  last_name?: string
}

export interface UpdateUserRequest {
  username?: string
  first_name?: string
  last_name?: string
  bio?: string
  location?: string
  website?: string
  profile_picture_url?: string
}

export interface UserProfile extends User {
  recipe_count: number
  review_count: number
  follower_count: number
  following_count: number
}

export interface UserStats {
  total_recipes: number
  total_reviews: number
  total_followers: number
  total_following: number
  average_rating: number
}
