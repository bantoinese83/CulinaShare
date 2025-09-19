import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - will be replaced with real data from API
const popularRecipes = [
  {
    id: '4',
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy cookies with the perfect amount of chocolate chips.',
    image: '/images/placeholder-recipe.jpg',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    rating: 4.9,
    reviews: 342,
    author: 'Baker Sarah',
    views: 12500,
  },
  {
    id: '5',
    title: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces.',
    image: '/images/placeholder-recipe.jpg',
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    rating: 4.8,
    reviews: 267,
    author: 'Chef Raj',
    views: 9800,
  },
  {
    id: '6',
    title: 'Beef Stir Fry',
    description: 'Quick and easy stir fry with fresh vegetables and tender beef.',
    image: '/images/placeholder-recipe.jpg',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    rating: 4.7,
    reviews: 189,
    author: 'Chef Li',
    views: 8700,
  },
  {
    id: '7',
    title: 'Caesar Salad',
    description: 'Classic salad with crisp romaine, croutons, and homemade dressing.',
    image: '/images/placeholder-recipe.jpg',
    prepTime: 20,
    cookTime: 0,
    servings: 4,
    rating: 4.6,
    reviews: 145,
    author: 'Chef Maria',
    views: 7200,
  },
]

export function PopularRecipes() {
  return (
    <section className="section bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="heading-2 mb-4">Popular This Week</h2>
          <p className="text-large max-w-2xl mx-auto">
            See what recipes are trending in our community right now.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularRecipes.map((recipe, index) => (
            <Card key={recipe.id} className="card-recipe group">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={400}
                  height={300}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-xs font-medium text-white">
                    <TrendingUp className="h-3 w-3" />
                    #{index + 1}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {recipe.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.prepTime + recipe.cookTime}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{recipe.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {recipe.views.toLocaleString()} views
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/recipes/${recipe.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/recipes?sort=popular">View All Popular Recipes</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
