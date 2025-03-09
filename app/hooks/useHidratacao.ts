import { useState, useEffect, useCallback } from 'react';
import { useAlimentacaoStore, useConfigStore } from '@/app/store';

interface UseHidratacaoRetorno {
  coposBebidos: number;
  metaDiaria: number;
  progresso: number;
  adicionarCopo: () => void;
  removerCopo: () => void;
  definirMetaDiaria: (quantidade: number) => void;
  proximoLembrete: number | null;
  resetarLembrete: () => void;
}

/**
 * Hook para gerenciar o controle de hidratação
 * 
 * @param metaInicial Meta inicial de copos diários, padrão: 8
 * @returns Métodos e estado do controle de hidratação
 */
export function useHidratacao(metaInicial = 8): UseHidratacaoRetorno {
  // Obtém dados da store
  const coposHoje = useAlimentacaoStore(state => state.getCoposHoje());
  const registrarCopo = useAlimentacaoStore(state => state.registrarCopo);
  const removerCopo = useAlimentacaoStore(state => state.removerCopo);
  const definirCopos = useAlimentacaoStore(state => state.definirCopos);
  
  const { configuracao } = useConfigStore();
  
  // Estado local
  const [metaDiaria, setMetaDiaria] = useState(metaInicial);
  const [proximoLembrete, setProximoLembrete] = useState<number | null>(null);
  
  // Calcula o progresso (0-100)
  const progresso = Math.min((coposHoje / metaDiaria) * 100, 100);
  
  // Configurar o timer do próximo lembrete quando mudar a quantidade de copos
  useEffect(() => {
    if (configuracao.notificacoesAtivas && coposHoje < metaDiaria) {
      const intervalMs = configuracao.intervalosNotificacaoHidratacao * 60 * 1000;
      const tempoRestante = Math.floor(intervalMs / 60000); // Converte para minutos
      
      setProximoLembrete(tempoRestante);
      
      // Inicia contador
      const timer = setInterval(() => {
        setProximoLembrete(prev => {
          if (prev === null || prev <= 1) {
            // Tenta tocar som de notificação
            try {
              new Notification('Hora de beber água!', {
                body: `Lembre-se de se hidratar. Copos bebidos hoje: ${coposHoje} de ${metaDiaria}.`,
                icon: '/water-icon.png',
              });
            } catch (e) {
              console.log('Notificações não permitidas');
            }
            
            // Reinicia o contador
            return Math.floor(intervalMs / 60000);
          }
          return prev - 1;
        });
      }, 60000);
      
      return () => clearInterval(timer);
    } else {
      setProximoLembrete(null);
    }
  }, [coposHoje, metaDiaria, configuracao.notificacoesAtivas, configuracao.intervalosNotificacaoHidratacao]);
  
  // Métodos
  const adicionarCopo = useCallback(() => {
    registrarCopo();
  }, [registrarCopo]);
  
  const definirMetaDiaria = useCallback((quantidade: number) => {
    setMetaDiaria(quantidade);
  }, []);
  
  const resetarLembrete = useCallback(() => {
    const intervalMs = configuracao.intervalosNotificacaoHidratacao * 60 * 1000;
    setProximoLembrete(Math.floor(intervalMs / 60000));
  }, [configuracao.intervalosNotificacaoHidratacao]);
  
  return {
    coposBebidos: coposHoje,
    metaDiaria,
    progresso,
    adicionarCopo,
    removerCopo,
    definirMetaDiaria,
    proximoLembrete,
    resetarLembrete,
  };
} 