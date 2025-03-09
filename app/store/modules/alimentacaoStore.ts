import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AlimentacaoTypes } from '@/app/types';
import { generateId, getCurrentDate, getCurrentTime } from '../utils';

// Interface do estado de alimentação
interface AlimentacaoState {
  refeicoes: AlimentacaoTypes.Refeicao[];
  hidratacao: AlimentacaoTypes.RegistroHidratacao[];

  // Ações para refeições
  adicionarRefeicao: (descricao: string, categoria?: AlimentacaoTypes.Refeicao['categoria'], foto?: string) => void;
  removerRefeicao: (id: string) => void;
  atualizarRefeicao: (id: string, refeicao: Partial<AlimentacaoTypes.Refeicao>) => void;
  
  // Ações para hidratação
  registrarCopo: () => void;
  removerCopo: () => void;
  definirCopos: (quantidade: number) => void;
  
  // Seletores
  getRefeicoesHoje: () => AlimentacaoTypes.Refeicao[];
  getRefeicoesData: (data: string) => AlimentacaoTypes.Refeicao[];
  getCoposHoje: () => number;
}

// Criação da store com persistência local
export const useAlimentacaoStore = create<AlimentacaoState>()(
  persist(
    (set, get) => ({
      refeicoes: [],
      hidratacao: [],
      
      // Implementações das ações para refeições
      adicionarRefeicao: (descricao, categoria, foto) => 
        set((state) => ({
          refeicoes: [
            ...state.refeicoes, 
            { 
              id: generateId(), 
              descricao,
              hora: getCurrentTime(),
              data: getCurrentDate(),
              categoria,
              foto
            }
          ],
        })),
      
      removerRefeicao: (id) =>
        set((state) => ({
          refeicoes: state.refeicoes.filter((r) => r.id !== id),
        })),
      
      atualizarRefeicao: (id, refeicao) =>
        set((state) => ({
          refeicoes: state.refeicoes.map((r) =>
            r.id === id ? { ...r, ...refeicao } : r
          ),
        })),
      
      // Implementações das ações para hidratação
      registrarCopo: () => {
        const hoje = getCurrentDate();
        const hidratacaoHoje = get().hidratacao.find(h => h.data === hoje);
        
        if (hidratacaoHoje) {
          // Atualiza o registro existente
          set((state) => ({
            hidratacao: state.hidratacao.map((h) =>
              h.data === hoje 
                ? { ...h, quantidadeCopos: h.quantidadeCopos + 1 } 
                : h
            ),
          }));
        } else {
          // Cria um novo registro
          set((state) => ({
            hidratacao: [
              ...state.hidratacao,
              { id: generateId(), data: hoje, quantidadeCopos: 1 }
            ],
          }));
        }
      },
      
      removerCopo: () => {
        const hoje = getCurrentDate();
        const hidratacaoHoje = get().hidratacao.find(h => h.data === hoje);
        
        if (hidratacaoHoje && hidratacaoHoje.quantidadeCopos > 0) {
          set((state) => ({
            hidratacao: state.hidratacao.map((h) =>
              h.data === hoje 
                ? { ...h, quantidadeCopos: h.quantidadeCopos - 1 } 
                : h
            ),
          }));
        }
      },
      
      definirCopos: (quantidade) => {
        const hoje = getCurrentDate();
        const hidratacaoHoje = get().hidratacao.find(h => h.data === hoje);
        
        if (hidratacaoHoje) {
          set((state) => ({
            hidratacao: state.hidratacao.map((h) =>
              h.data === hoje 
                ? { ...h, quantidadeCopos: quantidade } 
                : h
            ),
          }));
        } else {
          set((state) => ({
            hidratacao: [
              ...state.hidratacao,
              { id: generateId(), data: hoje, quantidadeCopos: quantidade }
            ],
          }));
        }
      },
      
      // Implementações dos seletores
      getRefeicoesHoje: () => {
        const hoje = getCurrentDate();
        return get().refeicoes.filter(refeicao => refeicao.data === hoje);
      },
      
      getRefeicoesData: (data) => {
        return get().refeicoes.filter(refeicao => refeicao.data === data);
      },
      
      getCoposHoje: () => {
        const hoje = getCurrentDate();
        const hidratacaoHoje = get().hidratacao.find(h => h.data === hoje);
        return hidratacaoHoje?.quantidadeCopos || 0;
      },
    }),
    {
      name: 'alimentacao-storage',
      partialize: (state) => ({ 
        refeicoes: state.refeicoes,
        hidratacao: state.hidratacao
      }),
    }
  )
); 