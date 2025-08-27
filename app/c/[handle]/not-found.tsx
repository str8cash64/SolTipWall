import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserX, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Creator Not Found</CardTitle>
            <CardDescription>
              The creator you're looking for doesn't exist or isn't available.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Double-check the creator handle or browse our featured creators instead.
            </p>
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
