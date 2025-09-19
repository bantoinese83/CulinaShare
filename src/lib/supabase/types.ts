export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          profile_picture_url: string | null
          first_name: string | null
          last_name: string | null
          bio: string | null
          location: string | null
          website: string | null
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          profile_picture_url?: string | null
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          profile_picture_url?: string | null
          first_name?: string | null
          last_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          is_verified?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          image_url: string | null
          prep_time: number
          cook_time: number
          total_time: number
          servings: number
          cuisine: string | null
          difficulty: string
          dietary_tags: string[]
          is_published: boolean
          is_featured: boolean
          view_count: number
          like_count: number
          average_rating: number
          total_ratings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          image_url?: string | null
          prep_time: number
          cook_time: number
          total_time: number
          servings: number
          cuisine?: string | null
          difficulty: string
          dietary_tags?: string[]
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          like_count?: number
          average_rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          prep_time?: number
          cook_time?: number
          total_time?: number
          servings?: number
          cuisine?: string | null
          difficulty?: string
          dietary_tags?: string[]
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          like_count?: number
          average_rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
      }
      ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          quantity: string
          unit: string | null
          notes: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          quantity: string
          unit?: string | null
          notes?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          quantity?: string
          unit?: string | null
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      instructions: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          description: string
          image_url: string | null
          time_estimate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          description: string
          image_url?: string | null
          time_estimate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          description?: string
          image_url?: string | null
          time_estimate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          rating: number
          comment: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          rating: number
          comment?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          rating?: number
          comment?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recipe_likes: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
      recipe_saves: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
