import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'NURAI Medical Assistant | المساعد الطبي الذكي',
  description: 'Premium AI-powered medical triage system for initial health assessments. نظام ذكاء اصطناعي متقدم للتقييم الصحي الأولي',
  generator: 'NURAI',
  keywords: ['medical', 'AI', 'triage', 'health assessment', 'healthcare', 'تقييم صحي', 'ذكاء اصطناعي'],
  authors: [{ name: 'NURAI Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NURAI',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="ltr" className="bg-background">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NURAI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                })
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628] flex flex-col`}>
        {children}
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
