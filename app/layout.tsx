import type { Metadata } from 'next'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/lexend/400.css'
import '@fontsource/lexend/500.css'
import '@fontsource/lexend/600.css'
import './globals.css'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'
import { Notification } from '@/app/components/ui/Notification'
import { Providers } from '@/app/providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Painel ND',
  description: 'Assistente pessoal para ajudar pessoas neurodivergentes com organização e produtividade',
  applicationName: 'Painel ND',
  authors: [{ name: 'Equipe Painel ND' }],
  keywords: ['neurodivergente', 'produtividade', 'organização', 'acessibilidade'],
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#1a1b1e' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: '/images/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 antialiased font-sans">
        <Providers>
          <Notification />
          <div className="flex h-screen overflow-hidden transition-colors duration-200" role="application" aria-label="Painel ND">
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 transition-all duration-200">
                <div className="mx-auto max-w-7xl">
                  {children}
                  <Footer />
                </div>
              </main>
            </div>
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
