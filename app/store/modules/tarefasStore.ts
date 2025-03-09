import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TarefaTypes } from '@/app/types';
import { generateId, getCurrentDate } from '../utils';

// Interface do estado de tarefas
interface TarefasState {
  tarefas: TarefaTypes.Tarefa[];

  // Ações
  adicionarTarefa: (texto: string, categoria: TarefaTypes.Tarefa['categoria'], prioridade?: TarefaTypes.Tarefa['prioridade']) => void;
  removerTarefa: (id: string) => void;
  toggleTarefaConcluida: (id: string) => void;
  atualizarTarefa: (id: string, tarefa: Partial<TarefaTypes.Tarefa>) => void;
  
  // Seletores
  getTarefasHoje: () => TarefaTypes.Tarefa[];
  getTarefasPorCategoria: (categoria: TarefaTypes.Tarefa['categoria']) => TarefaTypes.Tarefa[];
  getTarefasPendentes: () => TarefaTypes.Tarefa[];
}

// Criação da store com persistência local
export const useTarefasStore = create<TarefasState>()(
  persist(
    (set, get) => ({
      tarefas: [],
      
      adicionarTarefa: (texto, categoria, prioridade = 'media') => 
        set((state) => ({
          tarefas: [
            ...state.tarefas, 
            { 
              id: generateId(), 
              texto, 
              categoria, 
              concluida: false,
              data: getCurrentDate(),
              prioridade,
              criado_em: new Date().toISOString()
            }
          ],
        })),
      
      removerTarefa: (id) =>
        set((state) => ({
          tarefas: state.tarefas.filter((t) => t.id !== id),
        })),
      
      toggleTarefaConcluida: (id) =>
        set((state) => ({
          tarefas: state.tarefas.map((t) =>
            t.id === id ? { ...t, concluida: !t.concluida } : t
          ),
        })),
      
      atualizarTarefa: (id, tarefa) =>
        set((state) => ({
          tarefas: state.tarefas.map((t) =>
            t.id === id ? { ...t, ...tarefa } : t
          ),
        })),
      
      getTarefasHoje: () => {
        const hoje = getCurrentDate();
        return get().tarefas.filter(tarefa => tarefa.data === hoje);
      },
      
      getTarefasPorCategoria: (categoria) => {
        return get().tarefas.filter(tarefa => tarefa.categoria === categoria);
      },
      
      getTarefasPendentes: () => {
        return get().tarefas.filter(tarefa => !tarefa.concluida);
      },
    }),
    {
      name: 'tarefas-storage',
      partialize: (state) => ({ tarefas: state.tarefas }),
    }
  )
); 