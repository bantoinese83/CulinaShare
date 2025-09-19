'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu, X, ChefHat, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/auth/use-auth'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold gradient-text">CulinaShare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/recipes" className="text-sm font-medium hover:text-orange-500 transition-colors">
            Recipes
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-orange-500 transition-colors">
            Categories
          </Link>
          <Link href="/chefs" className="text-sm font-medium hover:text-orange-500 transition-colors">
            Chefs
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes..."
              className="w-64 pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = e.currentTarget.value.trim()
                  if (query) {
                    window.location.href = `/recipes?q=${encodeURIComponent(query)}`
                  }
                }
              }}
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button asChild size="sm">
                <Link href="/recipes/new">Share Recipe</Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    {typeof user?.user_metadata?.username === 'string' ? user.user_metadata.username : 'Profile'}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes..."
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.currentTarget.value.trim()
                    if (query) {
                      window.location.href = `/recipes?q=${encodeURIComponent(query)}`
                    }
                  }
                }}
              />
            </div>
            <nav className="space-y-2">
              <Link
                href="/recipes"
                className="block py-2 text-sm font-medium hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/categories"
                className="block py-2 text-sm font-medium hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/chefs"
                className="block py-2 text-sm font-medium hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Chefs
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
