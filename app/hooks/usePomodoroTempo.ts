import { useState, useEffect, useCallback } from 'react';
import { useTempoStore } from '@/app/store';
import { TempoTypes } from '@/app/types';

type CicloPomodoro = 'foco' | 'pausa' | 'longapausa';

interface UsePomodoroTempoRetorno {
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
  configuracao: TempoTypes.ConfiguracaoPomodoro;
  atualizarConfiguracao: (config: Partial<TempoTypes.ConfiguracaoPomodoro>) => void;
}

/**
 * Hook para gerenciar o temporizador Pomodoro usando o store de tempo
 * 
 * @returns Métodos e estado do temporizador Pomodoro
 */
export function usePomodoroTempo(): UsePomodoroTempoRetorno {
  // Acessando o store de tempo
  const configuracao = useTempoStore(state => state.configuracaoPomodoro);
  const pomodoroAtivo = useTempoStore(state => state.pomodoroAtivo);
  const atualizarConfiguracaoPomodoro = useTempoStore(state => state.atualizarConfiguracaoPomodoro);
  const iniciarPomodoro = useTempoStore(state => state.iniciarPomodoro);
  const pararPomodoro = useTempoStore(state => state.pararPomodoro);
  
  // Estado local do pomodoro
  const [isActive, setIsActive] = useState(pomodoroAtivo);
  const [isPaused, setIsPaused] = useState(true);
  const [ciclo, setCiclo] = useState<CicloPomodoro>('foco');
  const [ciclosCompletos, setCiclosCompletos] = useState(0);
  const [tempo, setTempo] = useState(configuracao.tempoFoco * 60);
  
  // Sincronizar com o estado global
  useEffect(() => {
    setIsActive(pomodoroAtivo);
  }, [pomodoroAtivo]);
  
  // Obter o tempo máximo do ciclo atual
  const getTempoMaximo = useCallback(() => {
    switch (ciclo) {
      case 'foco':
        return configuracao.tempoFoco * 60;
      case 'pausa':
        return configuracao.tempoPausa * 60;
      case 'longapausa':
        return configuracao.tempoLongaPausa * 60;
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
              if (novosCiclosCompletos % configuracao.ciclosAntesLongaPausa === 0) {
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
    iniciarPomodoro();
  }, [iniciarPomodoro]);
  
  const pausar = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const reiniciar = useCallback(() => {
    setIsActive(false);
    setIsPaused(true);
    setCiclo('foco');
    setCiclosCompletos(0);
    setTempo(configuracao.tempoFoco * 60);
    pararPomodoro();
  }, [configuracao.tempoFoco, pararPomodoro]);
  
  const pular = useCallback(() => {
    if (ciclo === 'foco') {
      const novosCiclosCompletos = ciclosCompletos + 1;
      setCiclosCompletos(novosCiclosCompletos);
      
      if (novosCiclosCompletos % configuracao.ciclosAntesLongaPausa === 0) {
        setCiclo('longapausa');
      } else {
        setCiclo('pausa');
      }
    } else {
      setCiclo('foco');
    }
  }, [ciclo, ciclosCompletos, configuracao.ciclosAntesLongaPausa]);
  
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
    atualizarConfiguracao: atualizarConfiguracaoPomodoro,
  };
} 