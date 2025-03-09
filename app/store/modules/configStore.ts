import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConfigTypes } from '@/app/types';

// Interface do estado de configurações
interface ConfigState {
  configuracao: ConfigTypes.ConfiguracaoUsuario;
  
  // Ações
  atualizarConfiguracao: (config: Partial<ConfigTypes.ConfiguracaoUsuario>) => void;
  toggleTemaEscuro: () => void;
  toggleReducaoEstimulos: () => void;
  toggleNotificacoes: () => void;
  definirTempoFoco: (minutos: number) => void;
  definirTempoPausa: (minutos: number) => void;
  definirIntervaloHidratacao: (minutos: number) => void;
}

// Valores padrão para configurações
const configPadrao: ConfigTypes.ConfiguracaoUsuario = {
  tempoFoco: 25,
  tempoPausa: 5,
  temaEscuro: false,
  reducaoEstimulos: false,
  notificacoesAtivas: true,
  intervalosNotificacaoHidratacao: 60,
};

// Criação da store com persistência local
export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      configuracao: configPadrao,
      
      atualizarConfiguracao: (config) =>
        set((state) => ({
          configuracao: { ...state.configuracao, ...config },
        })),
      
      toggleTemaEscuro: () =>
        set((state) => ({
          configuracao: { 
            ...state.configuracao, 
            temaEscuro: !state.configuracao.temaEscuro 
          },
        })),
      
      toggleReducaoEstimulos: () =>
        set((state) => ({
          configuracao: { 
            ...state.configuracao, 
            reducaoEstimulos: !state.configuracao.reducaoEstimulos 
          },
        })),
      
      toggleNotificacoes: () =>
        set((state) => ({
          configuracao: { 
            ...state.configuracao, 
            notificacoesAtivas: !state.configuracao.notificacoesAtivas 
          },
        })),
      
      definirTempoFoco: (minutos) =>
        set((state) => ({
          configuracao: { ...state.configuracao, tempoFoco: minutos },
        })),
      
      definirTempoPausa: (minutos) =>
        set((state) => ({
          configuracao: { ...state.configuracao, tempoPausa: minutos },
        })),
      
      definirIntervaloHidratacao: (minutos) =>
        set((state) => ({
          configuracao: { 
            ...state.configuracao, 
            intervalosNotificacaoHidratacao: minutos 
          },
        })),
    }),
    {
      name: 'config-storage',
      partialize: (state) => ({ configuracao: state.configuracao }),
    }
  )
); 