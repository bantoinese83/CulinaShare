import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send } from 'lucide-react'

export function Newsletter() {
  return (
    <section className="section bg-gradient-to-r from-orange-500 to-yellow-500">
      <div className="container">
        <Card className="mx-auto max-w-2xl border-0 bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="heading-3">Stay Updated</CardTitle>
            <CardDescription className="text-base">
              Get the latest recipes, cooking tips, and community updates delivered to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1"
                />
                <Button type="submit" className="btn-primary">
                  <Send className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
