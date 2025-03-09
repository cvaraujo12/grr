'use client'

import { CardMelhorado } from '@/app/components/ui/CardMelhorado'
import { PainelDiaMelhorado } from '@/app/components/inicio/PainelDiaMelhorado'
import { Button } from '@/app/components/ui/Button'
import { Sliders, Eye, EyeOff, MoveHorizontal, RotateCcw, Type, ArrowRight } from 'lucide-react'
import { useUIPreferencesStore } from '@/app/stores/uiPreferencesStore'
import Link from 'next/link'

/**
 * Página de demonstração das melhorias de UI/UX
 * Esta página permite testar as melhorias implementadas com foco em usuários neurodivergentes
 */
export default function MelhoriasUIPage() {
  // Estados para controle das opções de visualização vindos da store
  const {
    densidade,
    mostrarBordas,
    mostrarSombras,
    reduzirEstimulos,
    altoContraste,
    textoGrande,
    setDensidade,
    setMostrarBordas,
    setMostrarSombras,
    setReduzirEstimulos,
    setAltoContraste,
    setTextoGrande,
    resetToDefaults
  } = useUIPreferencesStore()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Melhorias de Interface</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setReduzirEstimulos(!reduzirEstimulos)}
            className="flex items-center"
            aria-pressed={reduzirEstimulos}
          >
            {reduzirEstimulos ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Mostrar animações</span>
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Reduzir estímulos</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center"
            title="Restaurar configurações padrão"
            aria-label="Restaurar configurações padrão"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Painel do Dia Melhorado */}
          <CardMelhorado 
            title="Planejamento do Dia" 
            subtitle="Versão melhorada com hierarquia visual e componentes mais consistentes"
            titleSize="lg"
            hasBorder={mostrarBordas}
            hasBoxShadow={mostrarSombras}
            density={densidade}
            accentColor="inicio"
            collapsible
          >
            <PainelDiaMelhorado />
          </CardMelhorado>
        </div>
        
        {/* Controles de acessibilidade */}
        <div>
          <CardMelhorado 
            title="Opções de Visualização" 
            titleSize="md"
            hasBorder={mostrarBordas}
            hasBoxShadow={mostrarSombras}
            density={densidade}
            accentColor="perfil"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Sliders className="mr-2 h-4 w-4" /> 
                  Personalização da Interface
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Densidade dos Elementos:</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant={densidade === 'compact' ? 'default' : 'outline'}
                        onClick={() => setDensidade('compact')}
                        className="text-xs"
                      >
                        Compacto
                      </Button>
                      <Button 
                        size="sm"
                        variant={densidade === 'comfortable' ? 'default' : 'outline'}
                        onClick={() => setDensidade('comfortable')}
                        className="text-xs"
                      >
                        Confortável
                      </Button>
                      <Button 
                        size="sm"
                        variant={densidade === 'spacious' ? 'default' : 'outline'}
                        onClick={() => setDensidade('spacious')}
                        className="text-xs"
                      >
                        Espaçado
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Acessibilidade:</p>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="toggle-alto-contraste"
                        checked={altoContraste}
                        onChange={() => setAltoContraste(!altoContraste)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="toggle-alto-contraste" className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MoveHorizontal className="h-3 w-3 mr-1 inline" /> Alto contraste
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="toggle-texto-grande"
                        checked={textoGrande}
                        onChange={() => setTextoGrande(!textoGrande)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="toggle-texto-grande" className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <Type className="h-3 w-3 mr-1 inline" /> Texto maior
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Elementos Visuais:</p>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="toggle-bordas"
                        checked={mostrarBordas}
                        onChange={() => setMostrarBordas(!mostrarBordas)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="toggle-bordas" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Mostrar bordas
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="toggle-sombras"
                        checked={mostrarSombras}
                        onChange={() => setMostrarSombras(!mostrarSombras)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="toggle-sombras" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Mostrar sombras
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Suas preferências são salvas automaticamente e aplicadas em toda a plataforma.
                </p>
              </div>
            </div>
          </CardMelhorado>
          
          <div className="mt-6">
            <CardMelhorado 
              title="Como Usar" 
              hasBorder={mostrarBordas}
              hasBoxShadow={mostrarSombras}
              density={densidade}
              accentColor="estudos"
              collapsible
              defaultCollapsed
            >
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <p>
                  Este painel demonstra as melhorias de UI/UX focadas em pessoas neurodivergentes:
                </p>
                <ul>
                  <li>Estrutura mais clara e previsível</li>
                  <li>Redução de elementos visuais competindo por atenção</li>
                  <li>Hierarquia visual mais explícita</li>
                  <li>Opções para personalizar a densidade de informações</li>
                  <li>Controles para reduzir estímulos visuais</li>
                </ul>
                <p>
                  Todos os componentes possuem suporte completo a navegação por teclado e 
                  leitores de tela.
                </p>
              </div>
            </CardMelhorado>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Continuar Explorando
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/ui-melhorias/componentes-v2" 
            className="flex items-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg"
          >
            <div className="flex-shrink-0 mr-4">
              <div className="p-2 bg-purple-600 text-white rounded-full">
                <ArrowRight size={20} />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100">
                Componentes V2
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Explore os novos componentes de navegação, grid e formulários com validação
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 