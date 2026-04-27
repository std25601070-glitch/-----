import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    <html lang="en" dir="ltr" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628]`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
