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
  
  // 🔴 ضع هنا الـ Public Key المولد من سيرفر الـ Node.js الخاص بك
  const PUBLIC_VAPID_KEY = "YOUR_PUBLIC_VAPID_KEY_FROM_SERVER";

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
              // دالة مساعدة لتحويل المفتاح السري
              function urlBase64ToUint8Array(base64String) {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');
                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);
                for (let i = 0; i < rawData.length; ++i) {
                  outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
              }

              if ('serviceWorker' in navigator && 'PushManager' in window) {
                window.addEventListener('load', async function() {
                  try {
                    // 1. تسجيل الـ Service Worker
                    const register = await navigator.serviceWorker.register('/sw.js');
                    console.log('Service Worker Registered successfully.');

                    // 2. طلب إذن الإشعارات من المستخدم
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      
                      // 3. توليد الاشتراك الفريد للجهاز
                      const subscription = await register.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array('${PUBLIC_VAPID_KEY}')
                      });

                      // 4. إرسال الاشتراك لسيرفر الإشعارات (Node.js)
                      await fetch('http://localhost:5000/subscribe', {
                        method: 'POST',
                        body: JSON.stringify(subscription),
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      });
                      console.log('NURAI Notifications linked successfully!');
                    } else {
                      console.log('Notification permission denied by user.');
                    }
                  } catch (error) {
                    console.error('Error setting up PWA notifications:', error);
                  }
                });
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
