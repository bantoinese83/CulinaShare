'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChefHat, Star, Users, Calendar, MapPin, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserProfile, useUserStats } from '@/hooks/users/use-users'
import { LoadingSpinner } from '@/components/ui/loading'
import { Error } from '@/components/ui/error'

// UUID validation function
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export default function ChefProfilePage() {
  const params = useParams()
  const chefId = params.id as string

  // Validate UUID format
  if (!isValidUUID(chefId)) {
    return (
      <div className="container py-8">
        <Error 
          title="Invalid Chef ID" 
          description="The chef ID format is invalid. Please check the URL and try again."
        />
      </div>
    )
  }

  // Fetch real chef data from the database
  const { data: chef, isLoading: chefLoading, error: chefError } = useUserProfile(chefId)
  const { data: stats, isLoading: statsLoading } = useUserStats(chefId)

  if (chefLoading || statsLoading) {
    return <LoadingSpinner />
  }

  if (chefError || !chef) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chef Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The chef you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/chefs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chefs
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/chefs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chefs
            </Link>
          </Button>
        </div>

        {/* Chef Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                {chef.profile_picture_url ? (
                  <Image
                    src={chef.profile_picture_url}
                    alt={chef.username}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
                {chef.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <Star className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Chef Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{chef.username}</h1>
                  {chef.is_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Verified Chef
                    </Badge>
                  )}
                </div>
                
                {chef.first_name && chef.last_name && (
                  <p className="text-lg text-muted-foreground mb-2">
                    {chef.first_name} {chef.last_name}
                  </p>
                )}

                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {chef.bio || 'No bio available'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {chef.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{chef.location}</span>
                    </div>
                  )}
                  {chef.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={chef.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-orange-500 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(chef.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{stats.total_recipes}</div>
                <div className="text-sm text-muted-foreground">Recipes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.total_reviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.average_rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.total_followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1" asChild>
            <Link href={`/recipes?chef=${chef.id}`}>
              <ChefHat className="mr-2 h-5 w-5" />
              View Recipes
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Users className="mr-2 h-5 w-5" />
            Follow Chef
          </Button>
        </div>
      </div>
    </div>
  )
}
