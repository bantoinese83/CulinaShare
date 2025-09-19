import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

interface ErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function Error({ 
  title = 'Something went wrong', 
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className 
}: ErrorProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-destructive">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="text-center">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

export function ErrorPage({ 
  title = 'Page Not Found', 
  description = 'The page you are looking for does not exist.',
  onRetry 
}: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Error title={title} description={description} onRetry={onRetry} />
      </div>
    </div>
  )
}
