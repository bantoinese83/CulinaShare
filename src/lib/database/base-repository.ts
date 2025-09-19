import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../supabase/types'
import type { BaseEntity, PaginationParams, PaginatedResponse, SortParams, FilterParams } from '@/types'

export abstract class BaseRepository<T extends BaseEntity> {
  protected supabase: SupabaseClient<Database>
  protected tableName: string

  constructor(supabase: SupabaseClient<Database>, tableName: string) {
    this.supabase = supabase
    this.tableName = tableName
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName as string)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to find ${this.tableName} by id: ${error.message}`)
    }

    return data as T
  }

  async findMany(filters?: FilterParams, sort?: SortParams, pagination?: PaginationParams): Promise<T[]> {
    let query = this.supabase
      .from(this.tableName as string)
      .select('*')

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    // Apply sorting
    if (sort) {
      query = query.order(sort.field, { ascending: sort.order === 'asc' })
    }

    // Apply pagination
    if (pagination) {
      const { page = 1, limit = 20 } = pagination
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to find ${this.tableName}: ${error.message}`)
    }

    return data as T[]
  }

  async findManyPaginated(
    filters?: FilterParams,
    sort?: SortParams,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20 } = pagination || {}

    // Get total count
    const { count, error: countError } = await this.supabase
      .from(this.tableName as string)
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Failed to count ${this.tableName}: ${countError.message}`)
    }

    // Get paginated data
    const data = await this.findMany(filters, sort, { page, limit })

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    }
  }

  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data: result, error } = await (this.supabase
      .from(this.tableName as string) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([data])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`)
    }

    return result as T
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): Promise<T> {
    const { data: result, error } = await (this.supabase
      .from(this.tableName as string) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`)
    }

    return result as T
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName as string)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`)
    }
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName as string)
      .select('id')
      .eq('id', id)
      .single()

    return !error && !!data
  }
}
