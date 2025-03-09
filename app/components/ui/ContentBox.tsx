'use client';

import React from 'react';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';

interface ContentBoxProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  noPadding?: boolean;
  bordered?: boolean;
}

export const ContentBox = ({
  children,
  title,
  description,
  className = '',
  noPadding = false,
  bordered = false,
}: ContentBoxProps) => {
  const { highContrast, largerText, denseContent } = useUIPreferences();

  // Aplicar classes condicionais baseadas nas preferências do usuário
  const getContainerClasses = () => {
    return `rounded-lg bg-white dark:bg-gray-800 
      ${bordered ? (highContrast ? 'border-2 border-black dark:border-white' : 'border border-gray-200 dark:border-gray-700') : ''}
      ${noPadding ? '' : (denseContent ? 'p-3' : 'p-4')} 
      ${highContrast ? 'shadow-none' : 'shadow-sm'}
      ${className}`;
  };

  const getTitleClasses = () => {
    return `font-semibold mb-1 ${largerText ? 'text-xl' : 'text-lg'} 
      ${highContrast ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'}`;
  };

  const getDescriptionClasses = () => {
    return `${largerText ? 'text-base' : 'text-sm'} 
      ${highContrast ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'} 
      mb-${denseContent ? '2' : '3'}`;
  };

  return (
    <div className={getContainerClasses()}>
      {title && (
        <h2 className={getTitleClasses()}>
          {title}
        </h2>
      )}
      
      {description && (
        <p className={getDescriptionClasses()}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

export default ContentBox; 