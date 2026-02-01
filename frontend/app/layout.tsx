import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import './globals-mobile.css'
import '@/styles/apple-glass.css'
import AuraOverlay from '../components/AuraOverlay'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const viewport: Viewport = {
  themeColor: '#667eea',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'NeuroPrep AI - Master Engineering Interviews',
  description: 'The world\'s most advanced AI interview platform with 224+ million unique questions across 47 engineering roles.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NeuroPrep AI'
  },
  formatDetection: {
    telephone: false
  }
}

import { Providers } from '../components/Providers'
import GlobalErrorBoundary from '../components/GlobalErrorBoundary'
import { Toaster } from 'react-hot-toast'
import GameStoreInit from '../components/GameStoreInit'
import JudgeWelcomeModal from '../components/JudgeWelcomeModal'
import ShareButton from '../components/ShareButton'
import AINavigator from '../components/AINavigator'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans bg-[#050505] text-white selection:bg-purple-500 selection:text-white`}
        suppressHydrationWarning
      >
        <GlobalErrorBoundary>
          <Providers>
            <GameStoreInit />
            <JudgeWelcomeModal />
            <AuraOverlay />
            <AINavigator />
            <div className="relative z-10 w-full min-h-screen">
              {children}
            </div>
             {/* Floating Share Button - moved inside Providers */}
             <ShareButton />
          </Providers>
        </GlobalErrorBoundary>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#121212',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }
          }}
        />
      </body>
    </html>
  );
}
