'use client'

import { useState } from 'react'
import { usePomodoroTempo } from '@/app/hooks/usePomodoroTempo'
import { Card } from '@/app/components/ui/Card'
import { Button } from '@/app/components/ui/Button'
import { Slider } from '@/app/components/ui/Slider'

export function TemporizadorPomodoro() {
  const [mostrarConfig, setMostrarConfig] = useState(false)

  // Usar o hook personalizado para o temporizador Pomodoro
  const pomodoro = usePomodoroTempo()

  // Formatador de tempo
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className={`p-4 flex flex-col items-center justify-center text-center ${
          pomodoro.ciclo === 'foco' ? 'bg-green-50 border-green-200' : 
          pomodoro.ciclo === 'pausa' ? 'bg-blue-50 border-blue-200' : 
          'bg-purple-50 border-purple-200'
        }`}>
          <div className="font-medium mb-1">Modo Atual</div>
          <div className="text-lg font-bold">
            {pomodoro.ciclo === 'foco'
              ? 'Concentração'
              : pomodoro.ciclo === 'pausa'
              ? 'Pausa Curta'
              : 'Pausa Longa'}
          </div>
        </Card>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={
              pomodoro.ciclo === 'foco'
                ? '#10b981' // verde
                : pomodoro.ciclo === 'pausa'
                ? '#3b82f6' // azul
                : '#a855f7' // roxo
            }
            strokeWidth="12"
            strokeDasharray="339.292"
            strokeDashoffset={276.5 - (276.5 * pomodoro.progresso) / 100}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold">{formatarTempo(pomodoro.tempo)}</div>
          <div className="text-gray-500 text-sm mt-2">
            {pomodoro.isActive && !pomodoro.isPaused ? 'Em andamento' : 'Pausado'}
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <p>Ciclos completados: {pomodoro.ciclosCompletos}</p>
        <p className="text-sm text-gray-500">
          Próximo: {pomodoro.ciclo === 'foco'
            ? (pomodoro.ciclosCompletos + 1) % pomodoro.configuracao.ciclosAntesLongaPausa === 0
              ? 'Pausa Longa'
              : 'Pausa Curta'
            : 'Concentração'}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {pomodoro.isActive && !pomodoro.isPaused ? (
          <Button
            onClick={pomodoro.pausar}
            variant="secondary"
          >
            Pausar
          </Button>
        ) : (
          <Button
            onClick={pomodoro.iniciar}
            variant="primary"
          >
            {pomodoro.isPaused && pomodoro.tempo < pomodoro.configuracao.tempoFoco * 60
              ? 'Continuar'
              : 'Iniciar'}
          </Button>
        )}
        <Button
          onClick={pomodoro.reiniciar}
          variant="outline"
        >
          Reiniciar
        </Button>
        <Button
          onClick={pomodoro.pular}
          variant="outline"
        >
          Pular
        </Button>
        <Button
          onClick={() => setMostrarConfig(!mostrarConfig)}
          variant="ghost"
        >
          {mostrarConfig ? 'Ocultar Configurações' : 'Configurações'}
        </Button>
      </div>

      {mostrarConfig && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Configurações do Pomodoro</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="tempoFoco" className="text-sm font-medium">
                  Tempo de foco:
                </label>
                <span className="text-sm">{pomodoro.configuracao.tempoFoco} minutos</span>
              </div>
              <Slider
                min={10}
                max={60}
                step={5}
                value={pomodoro.configuracao.tempoFoco}
                onChange={(valor) => pomodoro.atualizarConfiguracao({ tempoFoco: valor })}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="tempoPausa" className="text-sm font-medium">
                  Tempo de pausa:
                </label>
                <span className="text-sm">{pomodoro.configuracao.tempoPausa} minutos</span>
              </div>
              <Slider
                min={5}
                max={30}
                step={5}
                value={pomodoro.configuracao.tempoPausa}
                onChange={(valor) => pomodoro.atualizarConfiguracao({ tempoPausa: valor })}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="tempoLongaPausa" className="text-sm font-medium">
                  Tempo de pausa longa:
                </label>
                <span className="text-sm">{pomodoro.configuracao.tempoLongaPausa} minutos</span>
              </div>
              <Slider
                min={15}
                max={45}
                step={5}
                value={pomodoro.configuracao.tempoLongaPausa}
                onChange={(valor) => pomodoro.atualizarConfiguracao({ tempoLongaPausa: valor })}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="ciclos" className="text-sm font-medium">
                  Ciclos até pausa longa:
                </label>
                <span className="text-sm">{pomodoro.configuracao.ciclosAntesLongaPausa} ciclos</span>
              </div>
              <Slider
                min={2}
                max={6}
                step={1}
                value={pomodoro.configuracao.ciclosAntesLongaPausa}
                onChange={(valor) => pomodoro.atualizarConfiguracao({ ciclosAntesLongaPausa: valor })}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
