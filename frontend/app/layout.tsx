import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@/styles/apple-glass.css'
import AuraOverlay from '../components/AuraOverlay'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

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

// ...



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#050505] text-white selection:bg-purple-500 selection:text-white`}
        suppressHydrationWarning
      >
        <Providers>
          <AuraOverlay />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
