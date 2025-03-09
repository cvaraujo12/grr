import { useCallback } from 'react';
import { useSaudeStore } from '@/app/store';
import { SaudeTypes } from '@/app/types';

interface UseRegistroHumorRetorno {
  registros: SaudeTypes.RegistroHumor[];
  registrosHoje: SaudeTypes.RegistroHumor[];
  registrosRecentes: SaudeTypes.RegistroHumor[];
  adicionarRegistro: (humor: SaudeTypes.RegistroHumor['humor'], hora: string, observacoes?: string) => void;
  removerRegistro: (id: string) => void;
  atualizarRegistro: (id: string, registro: Partial<SaudeTypes.RegistroHumor>) => void;
  getRegistrosPorData: (data: string) => SaudeTypes.RegistroHumor[];
}

/**
 * Hook para gerenciar os registros de humor
 * 
 * @returns Métodos e estado dos registros de humor
 */
export function useRegistroHumor(): UseRegistroHumorRetorno {
  // Acessando o store de saúde
  const registros = useSaudeStore(state => state.registrosHumor);
  const adicionarRegistroHumor = useSaudeStore(state => state.adicionarRegistroHumor);
  const removerRegistroHumor = useSaudeStore(state => state.removerRegistroHumor);
  const atualizarRegistroHumor = useSaudeStore(state => state.atualizarRegistroHumor);
  const getRegistrosPorData = useSaudeStore(state => state.getRegistrosHumorPorData);
  
  // Obter registros de hoje
  const hoje = new Date().toISOString().split('T')[0];
  const registrosHoje = getRegistrosPorData(hoje);
  
  // Obter registros recentes (últimos 7 dias)
  const registrosRecentes = useSaudeStore(state => state.getRegistrosHumorRecentes(7));
  
  // Simplificar a interface para adição de registro
  const adicionarRegistro = useCallback((
    humor: SaudeTypes.RegistroHumor['humor'], 
    hora: string, 
    observacoes?: string
  ) => {
    adicionarRegistroHumor(humor, hora, observacoes);
  }, [adicionarRegistroHumor]);

  return {
    registros,
    registrosHoje,
    registrosRecentes,
    adicionarRegistro,
    removerRegistro: removerRegistroHumor,
    atualizarRegistro: atualizarRegistroHumor,
    getRegistrosPorData
  };
} 