import { useCallback } from 'react';
import { useTempoStore } from '@/app/store';
import { TempoTypes } from '@/app/types';

interface UseBlocosTempoRetorno {
  blocos: TempoTypes.BlocoTempo[];
  blocosHoje: TempoTypes.BlocoTempo[];
  adicionarBloco: (hora: string, atividade: string, categoria: TempoTypes.BlocoTempo['categoria'], duracao: number) => void;
  removerBloco: (id: string) => void;
  atualizarBloco: (id: string, bloco: Partial<TempoTypes.BlocoTempo>) => void;
  getBlocosPorCategoria: (categoria: TempoTypes.BlocoTempo['categoria']) => TempoTypes.BlocoTempo[];
  getBlocosPorData: (data: string) => TempoTypes.BlocoTempo[];
}

/**
 * Hook para gerenciar os blocos de tempo
 * 
 * @returns Métodos e estado dos blocos de tempo
 */
export function useBlocosTempo(): UseBlocosTempoRetorno {
  // Acessando o store de tempo
  const blocos = useTempoStore(state => state.blocosTempo);
  const adicionarBlocoTempo = useTempoStore(state => state.adicionarBlocoTempo);
  const removerBlocoTempo = useTempoStore(state => state.removerBlocoTempo);
  const atualizarBlocoTempo = useTempoStore(state => state.atualizarBlocoTempo);
  const getBlocosHoje = useTempoStore(state => state.getBlocosHoje);
  const getBlocosPorCategoria = useTempoStore(state => state.getBlocosPorCategoria);
  const getBlocosPorData = useTempoStore(state => state.getBlocosPorData);
  
  // Obter blocos de hoje
  const blocosHoje = getBlocosHoje();
  
  return {
    blocos,
    blocosHoje,
    adicionarBloco: adicionarBlocoTempo,
    removerBloco: removerBlocoTempo,
    atualizarBloco: atualizarBlocoTempo,
    getBlocosPorCategoria,
    getBlocosPorData
  };
} 