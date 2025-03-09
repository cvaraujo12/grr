'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { UIPreferencesProvider } from '@/app/components/ui/UIPreferencesProvider'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      <UIPreferencesProvider>
        {children}
      </UIPreferencesProvider>
    </NextThemesProvider>
  )
}
