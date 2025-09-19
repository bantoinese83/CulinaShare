'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useUserProfile, useUserStats, useUpdateUserProfile } from '@/hooks/users/use-users'
import { useReviewsByUser } from '@/hooks/reviews/use-reviews'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  X, 
  ChefHat, 
  Star, 
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { LoadingSpinner } from '@/components/ui/loading'
import { Error } from '@/components/ui/error'
import Link from 'next/link'
import Image from 'next/image'

// UUID validation function
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [isEditing, setIsEditing] = useState(false)

  // Validate UUID format
  if (!isValidUUID(userId)) {
    return (
      <div className="container py-8">
        <Error 
          title="Invalid Profile ID" 
          description="The profile ID format is invalid. Please check the URL and try again."
        />
      </div>
    )
  }
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    website: '',
  })

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId)
  const { data: stats } = useUserStats(userId)
  const { data: reviews } = useReviewsByUser(userId, 5, 0)
  const updateProfileMutation = useUpdateUserProfile()

  const handleEdit = () => {
    if (profile) {
      setFormData({
        username: profile.username,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
      })
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!userId) return

    try {
      await updateProfileMutation.mutateAsync({
        userId: userId,
        data: formData,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (profileLoading) {
    return <LoadingSpinner />
  }

  if (profileError || !profile) {
    return (
      <div className="container py-8">
        <Error 
          title="Profile Not Found" 
          description="The requested user profile could not be found."
        />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                {profile.profile_picture_url ? (
                  <Image
                    src={profile.profile_picture_url}
                    alt={profile.username}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <User className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                  </div>
                )}
                {profile.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <Star className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  {profile.is_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Verified
                    </Badge>
                  )}
                </div>
                
                {profile.first_name && profile.last_name && (
                  <p className="text-lg text-muted-foreground mb-2">
                    {profile.first_name} {profile.last_name}
                  </p>
                )}

                {profile.bio && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-orange-500 transition-colors"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
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

        {/* Recent Reviews */}
        {reviews && reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Latest recipe reviews by {profile.username}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary">{review.rating} stars</Badge>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link 
                        href={`/recipes/${review.recipe_id}`}
                        className="text-sm font-medium hover:text-orange-500"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
