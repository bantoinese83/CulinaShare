import { Hero } from '@/components/features/hero'
import { FeaturedRecipes } from '@/components/features/featured-recipes'
import { PopularRecipes } from '@/components/features/popular-recipes'
import { Categories } from '@/components/features/categories'
import { Newsletter } from '@/components/features/newsletter'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedRecipes />
      <PopularRecipes />
      <Categories />
      <Newsletter />
    </main>
  )
}