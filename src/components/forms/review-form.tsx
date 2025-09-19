'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateReview, useUpdateReview } from '@/hooks/reviews/use-reviews'
import { useAuth } from '@/hooks/auth/use-auth'
import { createReviewSchema, updateReviewSchema, type CreateReviewInput, type UpdateReviewInput } from '@/lib/validations/recipe'
import { Star, Send } from 'lucide-react'
import type { Review } from '@/types'

interface ReviewFormProps {
  recipeId: string
  existingReview?: Review
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({ recipeId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const createReviewMutation = useCreateReview()
  const updateReviewMutation = useUpdateReview()
  
  const isEditing = !!existingReview
  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateReviewInput | UpdateReviewInput>({
    resolver: zodResolver(isEditing ? updateReviewSchema : createReviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
  })

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
    setValue('rating', selectedRating)
  }

  const onSubmit = async (data: CreateReviewInput | UpdateReviewInput) => {
    if (!user) return

    try {
      if (isEditing && existingReview) {
        await updateReviewMutation.mutateAsync({
          id: existingReview.id,
          data: data as UpdateReviewInput,
          userId: user.id,
        })
      } else {
        await createReviewMutation.mutateAsync({
          data: { ...data, recipe_id: recipeId } as CreateReviewInput,
          userId: user.id,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your review and rating for this recipe'
            : 'Share your thoughts about this recipe with the community'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {displayRating > 0 && `${displayRating} star${displayRating !== 1 ? 's' : ''}`}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Share your experience with this recipe..."
              rows={4}
              className={errors.comment ? 'border-destructive' : ''}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
