import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title:       'Second Brain — AI-Powered Knowledge System',
  description: 'Capture, organize, and intelligently surface knowledge with AI.',
  openGraph: {
    title:       'Second Brain',
    description: 'Your AI-powered personal knowledge management system',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="noise">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SmoothScroll>
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  )
}
