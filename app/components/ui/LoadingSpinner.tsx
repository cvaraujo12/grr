'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

/**
 * Componente para exibir estado de carregamento
 */
export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message,
  className = ''
}: LoadingSpinnerProps) {
  // Mapeia o tamanho para classes CSS
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  // Componente interno do spinner
  const Spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        className={`animate-spin text-primary ${sizeClasses[size]}`} 
        aria-hidden="true" 
      />
      {message && (
        <p 
          className="mt-2 text-sm text-gray-600 dark:text-gray-300"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
  
  // Se for fullscreen, envolve em um container que cobre toda a tela
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-gray-100/40 dark:bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center z-50"
        role="status"
        aria-label={message || 'Carregando'}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {Spinner}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      role="status"
      aria-label={message || 'Carregando'}
    >
      {Spinner}
    </div>
  );
} 