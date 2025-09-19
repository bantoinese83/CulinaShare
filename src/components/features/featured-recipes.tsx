'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, ChefHat } from 'lucide-react'
import { useFeaturedRecipes } from '@/hooks/recipes/use-recipes'
import { LoadingSpinner } from '@/components/ui/loading'
import { Error } from '@/components/ui/error'
import Link from 'next/link'
import Image from 'next/image'

export function FeaturedRecipes() {
  const { data: featuredRecipes, isLoading, error } = useFeaturedRecipes(3)
  if (error) {
    return (
      <section className="section">
        <div className="container">
          <Error 
            title="Error Loading Featured Recipes" 
            description="Unable to load featured recipes. Please try again later."
          />
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="heading-2 mb-4">Featured Recipes</h2>
            <p className="text-large max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional recipes from talented chefs around the world.
            </p>
          </div>
          <LoadingSpinner />
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="heading-2 mb-4">Featured Recipes</h2>
          <p className="text-large max-w-2xl mx-auto">
            Discover our handpicked selection of exceptional recipes from talented chefs around the world.
          </p>
        </div>

        {featuredRecipes && featuredRecipes.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="card-recipe group">
                <div className="relative overflow-hidden rounded-t-lg">
                  {recipe.image_url ? (
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      width={400}
                      height={300}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-48 w-full bg-muted flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-900">
                      {recipe.cuisine || 'Other'}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.total_time} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{recipe.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({recipe.total_ratings})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">by {recipe.user_id}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No featured recipes yet</h3>
            <p className="text-muted-foreground mb-4">
              Check back soon for our handpicked selection of amazing recipes!
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/recipes">View All Recipes</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
