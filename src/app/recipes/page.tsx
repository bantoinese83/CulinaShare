'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSearchRecipes } from '@/hooks/recipes/use-recipes'
import { RECIPE_CONFIG } from '@/config/constants'
import { Search, Clock, Users, Star, ChefHat, Heart, Bookmark } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function RecipesPageContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<{
    query: string
    cuisine: string
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert' | 'all'
    dietary_tags: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'keto' | 'paleo' | 'low-carb' | 'high-protein' | 'low-sodium' | 'sugar-free' | 'halal' | 'kosher')[]
    sort_by: 'created_at' | 'updated_at' | 'title' | 'prep_time' | 'cook_time' | 'average_rating' | 'view_count' | 'like_count'
    sort_order: 'asc' | 'desc'
  }>({
    query: searchParams.get('q') || '',
    cuisine: searchParams.get('cuisine') || 'all',
    difficulty: (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | 'expert') || 'all',
    dietary_tags: searchParams.get('dietary_tags')?.split(',') as ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'keto' | 'paleo' | 'low-carb' | 'high-protein' | 'low-sodium' | 'sugar-free' | 'halal' | 'kosher')[] || [],
    sort_by: (searchParams.get('sort_by') as 'created_at' | 'updated_at' | 'title' | 'prep_time' | 'cook_time' | 'average_rating' | 'view_count' | 'like_count') || 'created_at',
    sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
  })

  // Process filters to convert "all" to proper values for API
  const processedFilters = {
    ...filters,
    cuisine: filters.cuisine === 'all' ? '' : filters.cuisine,
    difficulty: filters.difficulty === 'all' ? undefined : filters.difficulty,
  }

  const { data: recipes, isLoading, error } = useSearchRecipes({
    ...processedFilters,
    is_published: true,
    page: 1,
    limit: 20,
  })

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      cuisine: 'all',
      difficulty: 'all',
      dietary_tags: [],
      sort_by: 'created_at',
      sort_order: 'desc',
    })
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Recipes</h2>
          <p className="text-muted-foreground">There was an error loading the recipes. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="heading-2 mb-4">Discover Recipes</h1>
        <p className="text-large text-muted-foreground">
          Find your next favorite recipe from our community of talented cooks
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recipes, ingredients, or cuisines..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cuisine</label>
                <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange('cuisine', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cuisines</SelectItem>
                    {RECIPE_CONFIG.CUISINE_TYPES.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {RECIPE_CONFIG.DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange('sort_by', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="average_rating">Rating</SelectItem>
                    <SelectItem value="view_count">Views</SelectItem>
                    <SelectItem value="like_count">Likes</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={filters.sort_order} onValueChange={(value) => handleFilterChange('sort_order', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                {Array.isArray(recipes) ? recipes.length : 0} recipes found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        ) : recipes && Array.isArray(recipes) && recipes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
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
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {recipe.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {recipe.cuisine || 'Other'}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                    <span>({recipe.total_ratings})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">by User {recipe.user_id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse our featured recipes
          </p>
          <Button asChild>
            <Link href="/">Browse Featured Recipes</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipesPageContent />
    </Suspense>
  )
}
