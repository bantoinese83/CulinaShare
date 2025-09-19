import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'
import { BaseRepository } from '../base-repository'
import type { Ingredient, CreateIngredientRequest } from '@/types'

export class IngredientRepository extends BaseRepository<Ingredient> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'ingredients')
  }

  async createIngredient(data: CreateIngredientRequest, recipeId: string): Promise<Ingredient> {
    const { data: result, error } = await (this.supabase
      .from('ingredients') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([{
        recipe_id: recipeId,
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        notes: data.notes,
        order_index: data.order_index,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create ingredient: ${error.message}`)
    }

    return result as Ingredient
  }

  async createIngredients(ingredients: CreateIngredientRequest[], recipeId: string): Promise<Ingredient[]> {
    const ingredientsData = ingredients.map(ingredient => ({
      recipe_id: recipeId,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      notes: ingredient.notes,
      order_index: ingredient.order_index,
    }))

    const { data, error } = await (this.supabase
      .from('ingredients') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert(ingredientsData)
      .select()

    if (error) {
      throw new Error(`Failed to create ingredients: ${error.message}`)
    }

    return data as Ingredient[]
  }

  async getByRecipeId(recipeId: string): Promise<Ingredient[]> {
    const { data, error } = await this.supabase
      .from('ingredients')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('order_index', { ascending: true })

    if (error) {
      throw new Error(`Failed to get ingredients by recipe ID: ${error.message}`)
    }

    return data as Ingredient[]
  }

  async updateIngredient(id: string, data: Partial<CreateIngredientRequest>): Promise<Ingredient> {
    return this.update(id, data)
  }

  async deleteByRecipeId(recipeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('ingredients')
      .delete()
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Failed to delete ingredients by recipe ID: ${error.message}`)
    }
  }

  async reorderIngredients(recipeId: string, ingredientIds: string[]): Promise<void> {
    const updates = ingredientIds.map((id, index) => ({
      id,
      order_index: index,
    }))

    for (const update of updates) {
      await this.update(update.id, { order_index: update.order_index })
    }
  }
}
