'use client'

import { useEffect } from 'react'
import { useUIPreferencesStore } from '@/app/stores/uiPreferencesStore'

interface UIPreferencesProviderProps {
  children: React.ReactNode
}

/**
 * Provedor que aplica as preferências de UI/UX globalmente na aplicação
 * Aplica classes CSS ao elemento body com base nas preferências do usuário
 */
export function UIPreferencesProvider({ children }: UIPreferencesProviderProps) {
  const {
    reduzirEstimulos,
    altoContraste,
    textoGrande,
  } = useUIPreferencesStore()
  
  // Aplica as preferências de UI como classes no elemento body
  useEffect(() => {
    const body = document.body
    
    // Gerenciar classe para redução de estímulos
    if (reduzirEstimulos) {
      body.classList.add('reducao-estimulos')
    } else {
      body.classList.remove('reducao-estimulos')
    }
    
    // Gerenciar classe para alto contraste
    if (altoContraste) {
      body.classList.add('alto-contraste')
    } else {
      body.classList.remove('alto-contraste')
    }
    
    // Gerenciar classe para texto grande
    if (textoGrande) {
      body.classList.add('texto-grande')
    } else {
      body.classList.remove('texto-grande')
    }
    
    // Cleanup ao desmontar o componente
    return () => {
      body.classList.remove('reducao-estimulos', 'alto-contraste', 'texto-grande')
    }
  }, [reduzirEstimulos, altoContraste, textoGrande])
  
  // Este componente não renderiza nada diretamente, apenas aplica as classes
  return <>{children}</>
} 