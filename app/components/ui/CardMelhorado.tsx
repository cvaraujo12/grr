'use client'

import { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { Maximize2, Minimize2 } from 'lucide-react'

interface CardMelhoradoProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  titleSize?: 'sm' | 'md' | 'lg'
  hasBorder?: boolean
  hasBoxShadow?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  density?: 'compact' | 'comfortable' | 'spacious'
  accentColor?: 'none' | 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer' | 'financas' | 'hiperfocos' | 'sono' | 'perfil' | 'autoconhecimento'
}

/**
 * Componente Card melhorado com suporte a usuários neurodivergentes:
 * - Opções de densidade para controlar espaçamento
 * - Níveis de hierarquia visual com título e subtítulo
 * - Opção para remover elementos visuais distrativo (sombras, bordas)
 * - Suporte a cores de acento contextual
 * - Opção de colapsável para reduzir sobrecarga visual
 */
export function CardMelhorado({ 
  children, 
  title, 
  subtitle,
  className,
  titleSize = 'md',
  hasBorder = true,
  hasBoxShadow = true,
  collapsible = false,
  defaultCollapsed = false,
  density = 'comfortable',
  accentColor = 'none'
}: CardMelhoradoProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  // Definir as variáveis de estilo baseadas nas props
  const borderStyles = hasBorder ? 'border border-gray-200 dark:border-gray-700' : ''
  const shadowStyles = hasBoxShadow ? 'shadow-md' : ''
  
  // Mapear as densidades para classes concretas de padding
  const densityMap = {
    compact: 'p-2',
    comfortable: 'p-4',
    spacious: 'p-6'
  }
  
  const headerDensityMap = {
    compact: 'px-2 py-1.5',
    comfortable: 'px-4 py-3',
    spacious: 'px-6 py-4'
  }
  
  // Mapeamento de tamanhos de título
  const titleSizeMap = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  }
  
  // Definir classes para a cor de acento
  let accentStyles = '';
  if (accentColor !== 'none') {
    accentStyles = `border-t-4 border-t-${accentColor}-primary`;
  }
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-200",
      borderStyles,
      shadowStyles,
      accentStyles,
      className
    )}>
      {title && (
        <div className={cn(
          "border-b border-gray-200 dark:border-gray-700 flex justify-between items-center",
          headerDensityMap[density]
        )}>
          <div>
            <h2 className={cn(
              "font-medium text-gray-900 dark:text-white",
              titleSizeMap[titleSize]
            )}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expandir card" : "Recolher card"}
            >
              {isCollapsed ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}
      
      {!isCollapsed && (
        <div className={densityMap[density]}>
          {children}
        </div>
      )}
    </div>
  )
} 