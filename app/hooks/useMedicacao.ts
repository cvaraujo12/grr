import { useCallback } from 'react';
import { useSaudeStore } from '@/app/store';
import { SaudeTypes } from '@/app/types';

interface UseMedicacaoRetorno {
  medicacoes: SaudeTypes.Medicacao[];
  medicacoesPendentes: { medicacao: SaudeTypes.Medicacao, horario: string }[];
  adicionarMedicacao: (nome: string, horarios: string[], observacoes?: string) => void;
  removerMedicacao: (id: string) => void;
  atualizarMedicacao: (id: string, medicacao: Partial<SaudeTypes.Medicacao>) => void;
  registrarMedicacaoTomada: (idMedicacao: string, dataHorario: string, tomada: boolean) => void;
  verificarHorarioTomado: (idMedicacao: string, dataHorario: string) => boolean;
}

/**
 * Hook para gerenciar as medicações e seus registros
 * 
 * @returns Métodos e estado das medicações
 */
export function useMedicacao(): UseMedicacaoRetorno {
  // Acessando o store de saúde
  const medicacoes = useSaudeStore(state => state.medicacoes);
  const medicacoesPendentes = useSaudeStore(state => state.getMedicacaoPendente());
  
  const adicionarMedicacao = useSaudeStore(state => state.adicionarMedicacao);
  const removerMedicacao = useSaudeStore(state => state.removerMedicacao);
  const atualizarMedicacao = useSaudeStore(state => state.atualizarMedicacao);
  const registrarMedicacaoTomada = useSaudeStore(state => state.registrarMedicacaoTomada);

  // Função para verificar se uma medicação foi tomada em um horário específico
  const verificarHorarioTomado = useCallback((idMedicacao: string, dataHorario: string): boolean => {
    const medicacao = medicacoes.find(med => med.id === idMedicacao);
    if (!medicacao) return false;
    
    return !!medicacao.tomada[dataHorario];
  }, [medicacoes]);

  return {
    medicacoes,
    medicacoesPendentes,
    adicionarMedicacao,
    removerMedicacao,
    atualizarMedicacao,
    registrarMedicacaoTomada,
    verificarHorarioTomado
  };
} 