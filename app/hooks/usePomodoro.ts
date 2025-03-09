import { useState, useEffect, useCallback } from 'react';
import { useConfigStore } from '@/app/store';

type CicloPomodoro = 'foco' | 'pausa' | 'longapausa';

interface ConfiguracaoPomodoro {
  tempoFoco: number;
  tempoPausa: number;
  tempoLongapausa: number;
  ciclosAntesLongapausa: number;
}

interface UsePomodoroRetorno {
  isActive: boolean;
  isPaused: boolean;
  ciclo: CicloPomodoro;
  ciclosCompletos: number;
  tempo: number;
  progresso: number;
  iniciar: () => void;
  pausar: () => void;
  reiniciar: () => void;
  pular: () => void;
  configuracao: ConfiguracaoPomodoro;
  atualizarConfiguracao: (config: Partial<ConfiguracaoPomodoro>) => void;
}

/**
 * Hook para gerenciar o temporizador Pomodoro
 * 
 * @param configInicial Configuração inicial opcional para o temporizador
 * @returns Métodos e estado do temporizador Pomodoro
 */
export function usePomodoro(
  configInicial?: Partial<ConfiguracaoPomodoro>
): UsePomodoroRetorno {
  // Configuração padrão
  const configPadrao = {
    tempoFoco: 25,
    tempoPausa: 5,
    tempoLongapausa: 15,
    ciclosAntesLongapausa: 4,
  };
  
  // Estado
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [ciclo, setCiclo] = useState<CicloPomodoro>('foco');
  const [ciclosCompletos, setCiclosCompletos] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPomodoro>({
    ...configPadrao,
    ...configInicial,
  });
  
  // Obter o tempo máximo do ciclo atual
  const getTempoMaximo = useCallback(() => {
    switch (ciclo) {
      case 'foco':
        return configuracao.tempoFoco * 60;
      case 'pausa':
        return configuracao.tempoPausa * 60;
      case 'longapausa':
        return configuracao.tempoLongapausa * 60;
      default:
        return configuracao.tempoFoco * 60;
    }
  }, [ciclo, configuracao]);
  
  // Inicializa o tempo baseado no ciclo atual
  useEffect(() => {
    setTempo(getTempoMaximo());
  }, [ciclo, configuracao, getTempoMaximo]);
  
  // Gerencia o temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTempo((time) => {
          if (time <= 1) {
            // Tocar som de notificação
            try {
              const audio = new Audio('/notification.mp3');
              audio.play();
            } catch (error) {
              console.log('Notificação de áudio bloqueada');
            }
            
            // Alternar entre ciclos
            if (ciclo === 'foco') {
              const novosCiclosCompletos = ciclosCompletos + 1;
              setCiclosCompletos(novosCiclosCompletos);
              
              // Verificar se deve ser uma pausa longa
              if (novosCiclosCompletos % configuracao.ciclosAntesLongapausa === 0) {
                setCiclo('longapausa');
              } else {
                setCiclo('pausa');
              }
            } else {
              setCiclo('foco');
            }
            
            return getTempoMaximo();
          }
          return time - 1;
        });
      }, 1000);
    } else {
      interval && clearInterval(interval);
    }
    
    return () => {
      interval && clearInterval(interval);
    };
  }, [isActive, isPaused, ciclo, ciclosCompletos, configuracao, getTempoMaximo]);
  
  // Métodos para controlar o temporizador
  const iniciar = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);
  
  const pausar = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const reiniciar = useCallback(() => {
    setIsActive(false);
    setIsPaused(true);
    setCiclo('foco');
    setCiclosCompletos(0);
    setTempo(configuracao.tempoFoco * 60);
  }, [configuracao.tempoFoco]);
  
  const pular = useCallback(() => {
    if (ciclo === 'foco') {
      const novosCiclosCompletos = ciclosCompletos + 1;
      setCiclosCompletos(novosCiclosCompletos);
      
      if (novosCiclosCompletos % configuracao.ciclosAntesLongapausa === 0) {
        setCiclo('longapausa');
      } else {
        setCiclo('pausa');
      }
    } else {
      setCiclo('foco');
    }
  }, [ciclo, ciclosCompletos, configuracao.ciclosAntesLongapausa]);
  
  const atualizarConfiguracao = useCallback((config: Partial<ConfiguracaoPomodoro>) => {
    setConfiguracao(prev => ({
      ...prev,
      ...config,
    }));
  }, []);
  
  // Calcula o progresso (0-100)
  const progresso = ((getTempoMaximo() - tempo) / getTempoMaximo()) * 100;
  
  return {
    isActive,
    isPaused,
    ciclo,
    ciclosCompletos,
    tempo,
    progresso,
    iniciar,
    pausar,
    reiniciar,
    pular,
    configuracao,
    atualizarConfiguracao,
  };
} 