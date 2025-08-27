import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TopNav } from '@/components/marketing'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TipWall - Get paid to answer. Get answers that matter.',
  description: 'Connect with Solana\'s top creators through paid Q&A. Get personalized insights, expert advice, and exclusive access to the minds shaping Web3. Answers delivered instantly via Telegram.',
  keywords: ['Solana', 'Q&A', 'Creator Economy', 'Cryptocurrency', 'Telegram', 'Web3', 'DeFi', 'NFT', 'Blockchain'],
  authors: [{ name: 'TipWall Team' }],
  creator: 'TipWall',
  publisher: 'TipWall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tipwall.app'),
  openGraph: {
    title: 'TipWall - Get paid to answer. Get answers that matter.',
    description: 'Connect with Solana\'s top creators through paid Q&A. Get personalized insights and expert advice.',
    url: 'https://tipwall.app',
    siteName: 'TipWall',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TipWall - Paid Q&A for Solana Creators',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TipWall - Get paid to answer. Get answers that matter.',
    description: 'Connect with Solana\'s top creators through paid Q&A.',
    images: ['/og-image.png'],
    creator: '@tipwall',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <TopNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
