import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CulinaShare - Share, Discover, and Plan Your Culinary Adventures',
    template: '%s | CulinaShare',
  },
  description: 'Share your favorite recipes, discover new culinary creations, and plan your meals with CulinaShare. Join our community of food lovers and cooking enthusiasts.',
  keywords: [
    'recipes',
    'cooking',
    'food',
    'meal planning',
    'culinary',
    'cookbook',
    'kitchen',
    'chef',
    'cooking community',
  ],
  authors: [{ name: 'CulinaShare Team' }],
  creator: 'CulinaShare',
  publisher: 'CulinaShare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CulinaShare - Share, Discover, and Plan Your Culinary Adventures',
    description: 'Share your favorite recipes, discover new culinary creations, and plan your meals with CulinaShare.',
    siteName: 'CulinaShare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CulinaShare - Share, Discover, and Plan Your Culinary Adventures',
    description: 'Share your favorite recipes, discover new culinary creations, and plan your meals with CulinaShare.',
    creator: '@culinashare',
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}