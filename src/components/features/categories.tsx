import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Utensils, 
  Coffee, 
  Cake, 
  Salad, 
  Pizza, 
  Fish, 
  Apple, 
  IceCream,
  MoreHorizontal 
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Breakfast',
    description: 'Start your day right',
    icon: Coffee,
    recipeCount: 245,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    name: 'Lunch',
    description: 'Quick and satisfying',
    icon: Salad,
    recipeCount: 189,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    name: 'Dinner',
    description: 'Main course meals',
    icon: Utensils,
    recipeCount: 456,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    name: 'Desserts',
    description: 'Sweet treats',
    icon: Cake,
    recipeCount: 178,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    name: 'Appetizers',
    description: 'Starters and snacks',
    icon: Pizza,
    recipeCount: 123,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    name: 'Seafood',
    description: 'Fresh from the ocean',
    icon: Fish,
    recipeCount: 89,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    name: 'Healthy',
    description: 'Nutritious options',
    icon: Apple,
    recipeCount: 234,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    name: 'Beverages',
    description: 'Drinks and cocktails',
    icon: IceCream,
    recipeCount: 67,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
]

export function Categories() {
  return (
    <section className="section">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="heading-2 mb-4">Browse by Category</h2>
          <p className="text-large max-w-2xl mx-auto">
            Find recipes organized by meal type, cuisine, or dietary preferences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.name} className="card-recipe group cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.recipeCount} recipes
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/recipes?category=${category.name.toLowerCase()}`}>
                      Browse Recipes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">
              <MoreHorizontal className="mr-2 h-5 w-5" />
              View All Categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
