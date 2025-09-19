'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateRecipe } from '@/hooks/recipes/use-recipes'
import { useAuth } from '@/hooks/auth/use-auth'
import { createRecipeSchema, type CreateRecipeInput } from '@/lib/validations/recipe'
import { RECIPE_CONFIG } from '@/config/constants'
import { Plus, Trash2, Clock, Users, ChefHat } from 'lucide-react'

export function RecipeForm() {
  const router = useRouter()
  const { user } = useAuth()
  const createRecipeMutation = useCreateRecipe()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      title: '',
      description: '',
      prep_time: 0,
      cook_time: 0,
      servings: 1,
      cuisine: '',
      difficulty: 'easy',
      dietary_tags: [],
      ingredients: [{ name: '', quantity: '', unit: '', notes: '', order_index: 0 }],
      instructions: [{ step_number: 1, description: '', time_estimate: 0 }],
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  })

  // const watchedIngredients = watch('ingredients')
  // const watchedInstructions = watch('instructions')

  const onSubmit = async (data: CreateRecipeInput) => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    setIsSubmitting(true)
    try {
      await createRecipeMutation.mutateAsync({ data, userId: user.id })
      router.push('/recipes')
    } catch (error) {
      console.error('Failed to create recipe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addIngredient = () => {
    appendIngredient({
      name: '',
      quantity: '',
      unit: '',
      notes: '',
      order_index: ingredientFields.length,
    })
  }

  const addInstruction = () => {
    appendInstruction({
      step_number: instructionFields.length + 1,
      description: '',
      time_estimate: 0,
    })
  }

  const removeIngredientField = (index: number) => {
    if (ingredientFields.length > 1) {
      removeIngredient(index)
    }
  }

  const removeInstructionField = (index: number) => {
    if (instructionFields.length > 1) {
      removeInstruction(index)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            Share Your Recipe
          </CardTitle>
          <CardDescription>
            Create a new recipe and share it with the CulinaShare community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter recipe title"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select onValueChange={(value) => setValue('cuisine', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECIPE_CONFIG.CUISINE_TYPES.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your recipe..."
                  rows={3}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="prep_time" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Prep Time (min) *
                  </Label>
                  <Input
                    id="prep_time"
                    type="number"
                    {...register('prep_time', { valueAsNumber: true })}
                    min="0"
                    className={errors.prep_time ? 'border-destructive' : ''}
                  />
                  {errors.prep_time && (
                    <p className="text-sm text-destructive">{errors.prep_time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cook_time" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Cook Time (min) *
                  </Label>
                  <Input
                    id="cook_time"
                    type="number"
                    {...register('cook_time', { valueAsNumber: true })}
                    min="0"
                    className={errors.cook_time ? 'border-destructive' : ''}
                  />
                  {errors.cook_time && (
                    <p className="text-sm text-destructive">{errors.cook_time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Servings *
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    {...register('servings', { valueAsNumber: true })}
                    min="1"
                    className={errors.servings ? 'border-destructive' : ''}
                  />
                  {errors.servings && (
                    <p className="text-sm text-destructive">{errors.servings.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select onValueChange={(value) => setValue('difficulty', value as 'easy' | 'medium' | 'hard')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECIPE_CONFIG.DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              {ingredientFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`ingredients.${index}.name`}>Ingredient Name *</Label>
                      <Input
                        {...register(`ingredients.${index}.name`)}
                        placeholder="e.g., Chicken breast"
                        className={errors.ingredients?.[index]?.name ? 'border-destructive' : ''}
                      />
                      {errors.ingredients?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {errors.ingredients[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ingredients.${index}.quantity`}>Quantity *</Label>
                      <Input
                        {...register(`ingredients.${index}.quantity`)}
                        placeholder="e.g., 2"
                        className={errors.ingredients?.[index]?.quantity ? 'border-destructive' : ''}
                      />
                      {errors.ingredients?.[index]?.quantity && (
                        <p className="text-sm text-destructive">
                          {errors.ingredients[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ingredients.${index}.unit`}>Unit</Label>
                      <Input
                        {...register(`ingredients.${index}.unit`)}
                        placeholder="e.g., lbs, cups"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeIngredientField(index)}
                        size="sm"
                        variant="destructive"
                        disabled={ingredientFields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <Label htmlFor={`ingredients.${index}.notes`}>Notes (optional)</Label>
                    <Input
                      {...register(`ingredients.${index}.notes`)}
                      placeholder="e.g., diced, room temperature"
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Instructions</h3>
                <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {instructionFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Step {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeInstructionField(index)}
                        size="sm"
                        variant="destructive"
                        disabled={instructionFields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`instructions.${index}.description`}>Description *</Label>
                      <Textarea
                        {...register(`instructions.${index}.description`)}
                        placeholder="Describe this step..."
                        rows={3}
                        className={errors.instructions?.[index]?.description ? 'border-destructive' : ''}
                      />
                      {errors.instructions?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {errors.instructions[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`instructions.${index}.time_estimate`}>Time Estimate (minutes)</Label>
                        <Input
                          type="number"
                          {...register(`instructions.${index}.time_estimate`, { valueAsNumber: true })}
                          min="0"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
