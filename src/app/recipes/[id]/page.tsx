'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRecipe, useToggleLike, useToggleSave } from '@/hooks/recipes/use-recipes'
import { useAuth } from '@/hooks/auth/use-auth'
import { ReviewsSection } from '@/components/features/reviews-section'
import { 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  Heart, 
  Bookmark, 
  Share2, 
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading'
import { Error } from '@/components/ui/error'

export default function RecipeDetailsPage() {
  const params = useParams()
  const recipeId = params.id as string
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const { data: recipe, isLoading, error } = useRecipe(recipeId, user?.id)
  const toggleLikeMutation = useToggleLike()
  const toggleSaveMutation = useToggleSave()

  const handleLike = async () => {
    if (!user) return
    
    try {
      const result = await toggleLikeMutation.mutateAsync({ recipeId, userId: user.id })
      setIsLiked(result.liked)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      const result = await toggleSaveMutation.mutateAsync({ recipeId, userId: user.id })
      setIsSaved(result.saved)
    } catch (error) {
      console.error('Failed to toggle save:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !recipe) {
    return (
      <div className="container py-8">
        <Error 
          title="Recipe Not Found" 
          description="The recipe you're looking for doesn't exist or has been removed."
        />
      </div>
    )
  }

  const isOwner = user?.id === recipe.user_id

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/recipes">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recipe Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="heading-2">{recipe.title}</h1>
                {recipe.description && (
                  <p className="text-large text-muted-foreground">{recipe.description}</p>
                )}
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Recipe Image */}
            {recipe.image_url && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Recipe Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prep_time} min prep</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cook_time} min cook</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{recipe.average_rating.toFixed(1)} ({recipe.total_ratings} reviews)</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{recipe.difficulty}</Badge>
              {recipe.cuisine && <Badge variant="outline">{recipe.cuisine}</Badge>}
              {recipe.dietary_tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                {recipe.ingredients.length} ingredients needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{ingredient.quantity}</span>
                      {ingredient.unit && <span className="text-muted-foreground"> {ingredient.unit}</span>}
                      <span className="ml-2">{ingredient.name}</span>
                      {ingredient.notes && (
                        <span className="text-muted-foreground text-sm ml-2">({ingredient.notes})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>
                Follow these {recipe.instructions.length} steps to create your dish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {instruction.step_number}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-base leading-relaxed">{instruction.description}</p>
                      {instruction.time_estimate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>~{instruction.time_estimate} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{recipe.user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                disabled={!user}
              >
                <Heart className="h-4 w-4 mr-2" />
                {isLiked ? 'Liked' : 'Like'} ({recipe.like_count})
              </Button>
              
              <Button 
                className="w-full" 
                variant={isSaved ? "default" : "outline"}
                onClick={handleSave}
                disabled={!user}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardContent>
          </Card>

          {/* Nutrition Info */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Per serving</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Calories</span>
                    <span>--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs</span>
                    <span>--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat</span>
                    <span>--</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewsSection recipeId={recipeId} />
      </div>
    </div>
  )
}
