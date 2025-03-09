import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos para as preferências de UI
type Densidade = 'compact' | 'comfortable' | 'spacious'

interface UIPreferences {
  // Densidade e espaçamento
  densidade: Densidade
  
  // Elementos visuais
  mostrarBordas: boolean
  mostrarSombras: boolean
  
  // Acessibilidade
  reduzirEstimulos: boolean
  altoContraste: boolean
  textoGrande: boolean
  
  // Funções de atualização
  setDensidade: (densidade: Densidade) => void
  setMostrarBordas: (mostrar: boolean) => void
  setMostrarSombras: (mostrar: boolean) => void
  setReduzirEstimulos: (reduzir: boolean) => void
  setAltoContraste: (ativar: boolean) => void
  setTextoGrande: (ativar: boolean) => void
  
  // Funções utilitárias
  resetToDefaults: () => void
}

// Valores padrão
const DEFAULT_PREFERENCES = {
  densidade: 'comfortable' as Densidade,
  mostrarBordas: true,
  mostrarSombras: true,
  reduzirEstimulos: false,
  altoContraste: false,
  textoGrande: false,
}

// Criação da store com persistência no localStorage
export const useUIPreferencesStore = create<UIPreferences>()(
  persist(
    (set) => ({
      // Estados iniciais
      ...DEFAULT_PREFERENCES,
      
      // Setters
      setDensidade: (densidade) => set({ densidade }),
      setMostrarBordas: (mostrarBordas) => set({ mostrarBordas }),
      setMostrarSombras: (mostrarSombras) => set({ mostrarSombras }),
      setReduzirEstimulos: (reduzirEstimulos) => set({ reduzirEstimulos }),
      setAltoContraste: (altoContraste) => set({ altoContraste }),
      setTextoGrande: (textoGrande) => set({ textoGrande }),
      
      // Reset para valores padrão
      resetToDefaults: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: 'ui-preferences', // Nome da chave no localStorage
      partialize: (state) => ({
        densidade: state.densidade,
        mostrarBordas: state.mostrarBordas,
        mostrarSombras: state.mostrarSombras,
        reduzirEstimulos: state.reduzirEstimulos,
        altoContraste: state.altoContraste,
        textoGrande: state.textoGrande,
      }),
    }
  )
) 