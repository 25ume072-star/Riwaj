import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">
          Authentication Error
        </h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong during the authentication process. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Try Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
