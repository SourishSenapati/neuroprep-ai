import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import './globals-mobile.css'
import '@/styles/apple-glass.css'
import AuraOverlay from '../components/AuraOverlay'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'NeuroPrep AI - Master Engineering Interviews',
  description: 'The world\'s most advanced AI interview platform with 224+ million unique questions across 47 engineering roles.',
  manifest: '/manifest.json',
  themeColor: '#667eea',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
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

// ...



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
            <div className="relative z-10">
              {children}
            </div>
          </Providers>
        </GlobalErrorBoundary>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px'
            }
          }}
        />
        
        <footer className="py-8 text-center border-t border-white/5 bg-black/80 backdrop-blur-md relative z-40">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-gray-400 font-medium">Built with ❤️ using Next.js 15, deployed on Vercel</p>
            <div className="flex items-center gap-3 text-xs text-gray-600 font-mono bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Status: ✅ Production Ready
              </span>
              <span className="text-gray-700">|</span>
              <span>Version: 2.0.0</span>
              <span className="text-gray-700">|</span>
              <span>Last Updated: December 2025</span>
            </div>
          </div>
        </footer>

        {/* Floating Share Button */}
        <ShareButton />
      </body>
    </html>
  )
}
