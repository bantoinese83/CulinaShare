import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase/types'
import { BaseRepository } from '../base-repository'
import type { Instruction, CreateInstructionRequest } from '@/types'

export class InstructionRepository extends BaseRepository<Instruction> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'instructions')
  }

  async createInstruction(data: CreateInstructionRequest, recipeId: string): Promise<Instruction> {
    const { data: result, error } = await (this.supabase
      .from('instructions') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert([{
        recipe_id: recipeId,
        step_number: data.step_number,
        description: data.description,
        image_url: data.image_url,
        time_estimate: data.time_estimate,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create instruction: ${error.message}`)
    }

    return result as Instruction
  }

  async createInstructions(instructions: CreateInstructionRequest[], recipeId: string): Promise<Instruction[]> {
    const instructionsData = instructions.map(instruction => ({
      recipe_id: recipeId,
      step_number: instruction.step_number,
      description: instruction.description,
      image_url: instruction.image_url,
      time_estimate: instruction.time_estimate,
    }))

    const { data, error } = await (this.supabase
      .from('instructions') as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .insert(instructionsData)
      .select()

    if (error) {
      throw new Error(`Failed to create instructions: ${error.message}`)
    }

    return data as Instruction[]
  }

  async getByRecipeId(recipeId: string): Promise<Instruction[]> {
    const { data, error } = await this.supabase
      .from('instructions')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('step_number', { ascending: true })

    if (error) {
      throw new Error(`Failed to get instructions by recipe ID: ${error.message}`)
    }

    return data as Instruction[]
  }

  async updateInstruction(id: string, data: Partial<CreateInstructionRequest>): Promise<Instruction> {
    return this.update(id, data)
  }

  async deleteByRecipeId(recipeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('instructions')
      .delete()
      .eq('recipe_id', recipeId)

    if (error) {
      throw new Error(`Failed to delete instructions by recipe ID: ${error.message}`)
    }
  }

  async reorderInstructions(recipeId: string, instructionIds: string[]): Promise<void> {
    const updates = instructionIds.map((id, index) => ({
      id,
      step_number: index + 1,
    }))

    for (const update of updates) {
      await this.update(update.id, { step_number: update.step_number })
    }
  }
}
