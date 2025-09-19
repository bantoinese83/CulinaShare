'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChefHat, Star, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchUsers } from '@/hooks/users/use-users'
import { LoadingSpinner } from '@/components/ui/loading'
import { Error } from '@/components/ui/error'

export default function ChefsPage() {
  // Fetch real users from the database
  const { data: users, isLoading, error } = useSearchUsers('', 20)
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="container py-8">
        <Error 
          title="Failed to Load Chefs" 
          description="Unable to load the chefs list. Please try again later."
        />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Featured Chefs</h1>
        <p className="text-muted-foreground text-lg">
          Meet our talented community of chefs and discover their amazing recipes
        </p>
      </div>

      {users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((chef) => (
            <Card key={chef.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {chef.profile_picture_url ? (
                      <Image
                        src={chef.profile_picture_url}
                        alt={chef.username}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-15 h-15 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <ChefHat className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}
                    {chef.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                        <Star className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{chef.username}</CardTitle>
                    <CardDescription>
                      {chef.first_name && chef.last_name 
                        ? `${chef.first_name} ${chef.last_name}` 
                        : '@' + chef.username
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {chef.bio || 'No bio available'}
                </p>
                
                {chef.location && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{chef.location}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-4 w-4" />
                    <span>Chef</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>{chef.is_verified ? 'Verified' : 'Unverified'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(chef.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/profile/${chef.id}`}>View Profile</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Chefs Found</h3>
          <p className="text-muted-foreground mb-4">
            No chefs are currently available. Check back later!
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6">
          Share your recipes and connect with fellow food enthusiasts
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/auth/signup">Join as Chef</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/recipes">Browse All Recipes</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
