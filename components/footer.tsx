import Link from 'next/link'
import { Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for the Solana ecosystem. Pay-to-reply Q&A platform.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Telegram"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
