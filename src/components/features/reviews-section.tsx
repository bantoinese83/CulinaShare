'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ReviewForm } from '@/components/forms/review-form'
import { useReviewsByRecipe, useUserReviewForRecipe, useDeleteReview } from '@/hooks/reviews/use-reviews'
import { useAuth } from '@/hooks/auth/use-auth'
import { Star, MessageSquare, Edit, Trash2 } from 'lucide-react'
import { ReviewWithDetails } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface ReviewsSectionProps {
  recipeId: string
}

export function ReviewsSection({ recipeId }: ReviewsSectionProps) {
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<ReviewWithDetails | null>(null)
  
  const { data: reviews, isLoading } = useReviewsByRecipe(recipeId, 10, 0)
  const { data: userReview } = useUserReviewForRecipe(user?.id || '', recipeId)
  const deleteReviewMutation = useDeleteReview()

  const handleEditReview = (review: ReviewWithDetails) => {
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return
    
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReviewMutation.mutateAsync({ id: reviewId, userId: user.id })
      } catch (error) {
        console.error('Failed to delete review:', error)
      }
    }
  }

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setEditingReview(null)
  }

  const handleCancelReview = () => {
    setShowReviewForm(false)
    setEditingReview(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {user && !userReview && !showReviewForm && (
        <div className="text-center py-6">
          <Button onClick={() => setShowReviewForm(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          recipeId={recipeId}
          existingReview={editingReview || undefined}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancelReview}
        />
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews ({reviews?.length || 0})
          </CardTitle>
          <CardDescription>
            What others are saying about this recipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{review.user?.username || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    {user?.id === review.user_id && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReview(review)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
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
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to review this recipe!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
