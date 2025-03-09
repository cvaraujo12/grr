'use client'

import { useState } from 'react'
import { Accessibility, Eye, Type, Sun, MoveHorizontal, X } from 'lucide-react'
import { useUIPreferencesStore } from '@/app/stores/uiPreferencesStore'
import { Button } from '@/app/components/ui/Button'
import Link from 'next/link'

/**
 * Menu flutuante de acessibilidade que pode ser acessado de qualquer lugar da aplicação
 * Permite ajustar rapidamente as principais configurações de acessibilidade
 */
export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    reduzirEstimulos,
    altoContraste,
    textoGrande,
    setReduzirEstimulos,
    setAltoContraste,
    setTextoGrande,
  } = useUIPreferencesStore()
  
  return (
    <>
      {/* Botão flutuante de acessibilidade */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-40 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
        aria-label="Abrir menu de acessibilidade"
      >
        <Accessibility className="h-6 w-6" />
      </button>
      
      {/* Painel de acessibilidade */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Overlay escuro */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 w-full sm:w-96 sm:rounded-lg overflow-hidden shadow-xl transform transition-all p-0 m-0 sm:m-4">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Accessibility className="h-5 w-5 mr-2" />
                Opções de Acessibilidade
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Fechar menu de acessibilidade"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <button
                  onClick={() => setReduzirEstimulos(!reduzirEstimulos)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    reduzirEstimulos 
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                  aria-pressed={reduzirEstimulos}
                >
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-3" />
                    <span className="font-medium">Reduzir estímulos visuais</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full ${reduzirEstimulos ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}>
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${
                        reduzirEstimulos ? 'translate-x-5 right-1' : 'translate-x-0 left-1'
                      }`} 
                    />
                  </div>
                </button>
                
                <button
                  onClick={() => setAltoContraste(!altoContraste)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    altoContraste 
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                  aria-pressed={altoContraste}
                >
                  <div className="flex items-center">
                    <MoveHorizontal className="h-5 w-5 mr-3" />
                    <span className="font-medium">Alto contraste</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full ${altoContraste ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}>
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${
                        altoContraste ? 'translate-x-5 right-1' : 'translate-x-0 left-1'
                      }`} 
                    />
                  </div>
                </button>
                
                <button
                  onClick={() => setTextoGrande(!textoGrande)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    textoGrande 
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                  aria-pressed={textoGrande}
                >
                  <div className="flex items-center">
                    <Type className="h-5 w-5 mr-3" />
                    <span className="font-medium">Texto maior</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full ${textoGrande ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} relative transition-colors`}>
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transform transition-transform ${
                        textoGrande ? 'translate-x-5 right-1' : 'translate-x-0 left-1'
                      }`} 
                    />
                  </div>
                </button>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Link href="/ui-melhorias">
                  <div className="flex items-center justify-center w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200 transition-colors">
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Mais opções de personalização</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 