'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChefHat, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useAppStatistics } from '@/hooks/statistics/use-statistics'

export function Hero() {
  const { data: stats, isLoading } = useAppStatistics()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-orange-950/20 dark:via-yellow-950/20 dark:to-orange-950/30">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="heading-1 mb-6 text-balance">
            Share, Discover, and Plan Your{' '}
            <span className="gradient-text">Culinary Adventures</span>
          </h1>
          <p className="text-large mb-8 text-balance">
            Join our community of food lovers and cooking enthusiasts. Share your favorite recipes, 
            discover new culinary creations, and plan your meals with ease.
          </p>
          
          {/* Search Bar */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for recipes, ingredients, or cuisines..."
                className="h-14 pl-12 pr-4 text-lg"
              />
              <Button size="lg" className="absolute right-2 top-2 h-10">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="btn-primary">
              <Link href="/recipes/new">
                <ChefHat className="mr-2 h-5 w-5" />
                Share Your Recipe
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recipes">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Recipes
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <ChefHat className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="heading-4 mb-2">
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              ) : (
                `${stats?.totalRecipes.toLocaleString() || 0}+`
              )}
            </h3>
            <p className="text-body">Recipes Shared</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="heading-4 mb-2">
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              ) : (
                `${stats?.totalUsers.toLocaleString() || 0}+`
              )}
            </h3>
            <p className="text-body">Active Cooks</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="heading-4 mb-2">
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              ) : (
                `${stats?.totalCuisineTypes || 0}+`
              )}
            </h3>
            <p className="text-body">Cuisine Types</p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-800/20" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-yellow-200/30 blur-3xl dark:bg-yellow-800/20" />
      </div>
    </section>
  )
}
