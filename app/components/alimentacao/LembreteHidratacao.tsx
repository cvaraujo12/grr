'use client'

import { useState } from 'react'
import { Droplet, PlusCircle, MinusCircle, Settings, X, Bell } from 'lucide-react'
import { useHidratacao } from '@/app/hooks/useHidratacao'
import { useConfigStore } from '@/app/store'

export function LembreteHidratacao() {
  const [showSettings, setShowSettings] = useState(false)
  const [permitiuNotificacoes, setPermitiuNotificacoes] = useState(false)
  
  const hidratacao = useHidratacao(8)
  const { configuracao, atualizarConfiguracao } = useConfigStore()
  
  // Solicitar permissão para notificações
  const solicitarPermissao = async () => {
    if ('Notification' in window) {
      const permissao = await Notification.requestPermission()
      if (permissao === 'granted') {
        setPermitiuNotificacoes(true)
        atualizarConfiguracao({ notificacoesAtivas: true })
      }
    }
  }

  return (
    <div className="flex flex-col">
      {/* Progresso visual com copos d'água */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${hidratacao.progresso}%` }}
            aria-label={`${hidratacao.progresso.toFixed(0)}% da meta de hidratação atingida`}
          />
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            {hidratacao.coposBebidos} de {hidratacao.metaDiaria} copos
          </span>
          
          {hidratacao.proximoLembrete !== null && (
            <span className="ml-3 flex items-center text-gray-500 dark:text-gray-400">
              <Bell size={14} className="mr-1" />
              Próximo lembrete em {hidratacao.proximoLembrete} min
            </span>
          )}
        </div>
      </div>
      
      {/* Ícones de copos */}
      <div className="flex flex-wrap justify-center mb-4 gap-2">
        {Array.from({ length: hidratacao.metaDiaria }).map((_, i) => (
          <Droplet
            key={i}
            className={`h-8 w-8 transition-colors ${
              i < hidratacao.coposBebidos
                ? 'text-blue-500 fill-blue-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            aria-label={i < hidratacao.coposBebidos ? 'Copo de água bebido' : 'Copo de água pendente'}
          />
        ))}
      </div>
      
      {/* Controles */}
      <div className="flex justify-center items-center space-x-6 mt-2">
        <button
          onClick={hidratacao.removerCopo}
          disabled={hidratacao.coposBebidos <= 0}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Remover um copo de água"
        >
          <MinusCircle className="h-8 w-8" />
        </button>
        
        <button
          onClick={hidratacao.adicionarCopo}
          className="p-2 rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none"
          aria-label="Adicionar um copo de água"
        >
          <PlusCircle className="h-10 w-10" />
        </button>
        
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label="Configurações de hidratação"
        >
          <Settings className="h-8 w-8" />
        </button>
      </div>
      
      {/* Overlay de configurações */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Configurações de Hidratação
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Fechar configurações"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="metaDiaria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta diária (copos)
                </label>
                <input
                  type="number"
                  id="metaDiaria"
                  min="1"
                  max="20"
                  value={hidratacao.metaDiaria}
                  onChange={(e) => hidratacao.definirMetaDiaria(parseInt(e.target.value) || 8)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="intervaloLembrete" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intervalo entre lembretes (minutos)
                </label>
                <input
                  type="number"
                  id="intervaloLembrete"
                  min="15"
                  max="240"
                  value={configuracao.intervalosNotificacaoHidratacao}
                  onChange={(e) => atualizarConfiguracao({ 
                    intervalosNotificacaoHidratacao: parseInt(e.target.value) || 60 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificacoesAtivas"
                  checked={configuracao.notificacoesAtivas}
                  onChange={() => {
                    if (!configuracao.notificacoesAtivas && !permitiuNotificacoes) {
                      solicitarPermissao();
                    } else {
                      atualizarConfiguracao({ 
                        notificacoesAtivas: !configuracao.notificacoesAtivas 
                      });
                    }
                  }}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                />
                <label htmlFor="notificacoesAtivas" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Notificações ativas
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowSettings(false);
                  hidratacao.resetarLembrete();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
