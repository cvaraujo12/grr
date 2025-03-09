import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TempoTypes } from '@/app/types';
import { generateId, getCurrentDate } from '../utils';

// Interface do estado de tempo
interface TempoState {
  blocosTempo: TempoTypes.BlocoTempo[];
  configuracaoPomodoro: TempoTypes.ConfiguracaoPomodoro;
  pomodoroAtivo: boolean;
  
  // Ações - Blocos de tempo
  adicionarBlocoTempo: (hora: string, atividade: string, categoria: TempoTypes.BlocoTempo['categoria'], duracao: number) => void;
  removerBlocoTempo: (id: string) => void;
  atualizarBlocoTempo: (id: string, bloco: Partial<TempoTypes.BlocoTempo>) => void;
  
  // Ações - Pomodoro
  atualizarConfiguracaoPomodoro: (config: Partial<TempoTypes.ConfiguracaoPomodoro>) => void;
  iniciarPomodoro: () => void;
  pararPomodoro: () => void;
  
  // Seletores
  getBlocosHoje: () => TempoTypes.BlocoTempo[];
  getBlocosPorCategoria: (categoria: TempoTypes.BlocoTempo['categoria']) => TempoTypes.BlocoTempo[];
  getBlocosPorData: (data: string) => TempoTypes.BlocoTempo[];
}

// Configuração padrão do pomodoro
const configuracaoPadrao: TempoTypes.ConfiguracaoPomodoro = {
  tempoFoco: 25,
  tempoPausa: 5,
  tempoLongaPausa: 15,
  ciclosAntesLongaPausa: 4
};

// Criação da store com persistência local
export const useTempoStore = create<TempoState>()(
  persist(
    (set, get) => ({
      blocosTempo: [],
      configuracaoPomodoro: configuracaoPadrao,
      pomodoroAtivo: false,
      
      adicionarBlocoTempo: (hora, atividade, categoria, duracao) => 
        set((state) => ({
          blocosTempo: [
            ...state.blocosTempo, 
            { 
              id: generateId(), 
              hora, 
              atividade, 
              categoria,
              data: getCurrentDate(),
              duracao
            }
          ],
        })),
      
      removerBlocoTempo: (id) =>
        set((state) => ({
          blocosTempo: state.blocosTempo.filter((bloco) => bloco.id !== id),
        })),
      
      atualizarBlocoTempo: (id, bloco) =>
        set((state) => ({
          blocosTempo: state.blocosTempo.map((b) =>
            b.id === id ? { ...b, ...bloco } : b
          ),
        })),
      
      atualizarConfiguracaoPomodoro: (config) =>
        set((state) => ({
          configuracaoPomodoro: { ...state.configuracaoPomodoro, ...config },
        })),
      
      iniciarPomodoro: () => set({ pomodoroAtivo: true }),
      
      pararPomodoro: () => set({ pomodoroAtivo: false }),
      
      getBlocosHoje: () => {
        const hoje = getCurrentDate();
        return get().blocosTempo.filter(bloco => bloco.data === hoje);
      },
      
      getBlocosPorCategoria: (categoria) => {
        return get().blocosTempo.filter(bloco => bloco.categoria === categoria);
      },
      
      getBlocosPorData: (data) => {
        return get().blocosTempo.filter(bloco => bloco.data === data);
      },
    }),
    {
      name: 'tempo-storage',
      partialize: (state) => ({ 
        blocosTempo: state.blocosTempo,
        configuracaoPomodoro: state.configuracaoPomodoro
      }),
    }
  )
); 