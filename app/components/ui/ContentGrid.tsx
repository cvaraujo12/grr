'use client';

import React from 'react';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';

interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ContentGrid = ({
  children,
  columns = 2,
  gap = 'medium',
  className = '',
}: ContentGridProps) => {
  const { denseContent } = useUIPreferences();
  
  // Mapear o número de colunas para as classes de grid apropriadas
  const getColumnsClasses = () => {
    const baseClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };
    
    return baseClasses[columns];
  };
  
  // Mapear o tamanho do gap para as classes apropriadas
  const getGapClasses = () => {
    const baseGaps = {
      small: denseContent ? 'gap-2' : 'gap-3',
      medium: denseContent ? 'gap-3' : 'gap-4',
      large: denseContent ? 'gap-4' : 'gap-6',
    };
    
    return baseGaps[gap];
  };
  
  return (
    <div 
      className={`grid ${getColumnsClasses()} ${getGapClasses()} ${className}`}
      role="region"
    >
      {children}
    </div>
  );
};

// Componente de Card para usar dentro do grid
interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const ContentCard = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
}: ContentCardProps) => {
  const { highContrast, largerText, denseContent } = useUIPreferences();
  
  const getCardClasses = () => {
    return `rounded-lg ${denseContent ? 'p-3' : 'p-4'} bg-white dark:bg-gray-800 
      ${highContrast ? 'border-2 border-black dark:border-white' : 'border border-gray-200 dark:border-gray-700'} 
      ${onClick ? 'cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md' : ''}
      ${className}`;
  };
  
  return (
    <div 
      className={getCardClasses()}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && (
        <h3 className={`font-medium ${largerText ? 'text-lg' : 'text-base'} 
          ${highContrast ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'}`}
        >
          {title}
        </h3>
      )}
      
      {subtitle && (
        <p className={`${largerText ? 'text-base' : 'text-sm'} 
          ${highContrast ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'} 
          ${title ? 'mt-1' : ''} ${denseContent ? 'mb-1' : 'mb-2'}`}
        >
          {subtitle}
        </p>
      )}
      
      {children}
    </div>
  );
};

export default ContentGrid; 