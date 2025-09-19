import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RECIPE_CONFIG } from '@/config/constants'
import { ChefHat, Clock, Users } from 'lucide-react'
import Link from 'next/link'

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Recipe Categories</h1>
        <p className="text-muted-foreground text-lg">
          Discover recipes by category and find your next culinary adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RECIPE_CONFIG.CUISINE_TYPES.map((cuisine) => (
          <Card key={cuisine} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/recipes?cuisine=${cuisine}`}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                  <CardTitle className="text-xl">{cuisine}</CardTitle>
                </div>
                <CardDescription>
                  Explore delicious {cuisine.toLowerCase()} recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Various</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>All Levels</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Browse</Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-muted-foreground mb-6">
          Browse all recipes or create your own category
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/recipes" 
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Browse All Recipes
          </Link>
          <Link 
            href="/recipes/new" 
            className="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
          >
            Share Your Recipe
          </Link>
        </div>
      </div>
    </div>
  )
}
