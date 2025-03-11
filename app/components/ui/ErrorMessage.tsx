'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { HandledError } from '@/app/lib/utils/errorHandling';

type AlertType = 'error' | 'warning' | 'info' | 'success';

interface ErrorMessageProps {
  error?: HandledError | null;
  message?: string;
  type?: AlertType;
  onDismiss?: () => void;
  showIcon?: boolean;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Componente para exibir mensagens de erro, avisos ou informações
 */
export function ErrorMessage({
  error,
  message,
  type = 'error',
  onDismiss,
  showIcon = true,
  showAction = false,
  actionText = 'Tentar novamente',
  onAction
}: ErrorMessageProps) {
  // Se não tiver mensagem ou erro, não renderiza nada
  if (!message && !error) return null;
  
  // Determina a mensagem a ser exibida
  const displayMessage = message || (error ? error.userMessage : '');
  
  // Determina o tipo de alerta com base no erro ou no tipo fornecido
  const alertType = error ? 
    (error.severity === 'warning' ? 'warning' : 
     error.severity === 'info' ? 'info' : 'error') : 
    type;
  
  // Configura cores e ícones com base no tipo de alerta
  const configs = {
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" aria-hidden="true" />
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-200',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
    },
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-200',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: <Info className="h-5 w-5 text-green-500 dark:text-green-400" aria-hidden="true" />
    }
  };
  
  const config = configs[alertType];
  
  return (
    <div 
      className={`rounded-md p-4 mb-4 border ${config.bgColor} ${config.borderColor}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {config.icon}
          </div>
        )}
        
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {displayMessage}
          </p>
          
          {error?.suggestedAction && (
            <p className={`mt-1 text-sm ${config.textColor} opacity-90`}>
              {error.suggestedAction}
            </p>
          )}
          
          {showAction && onAction && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onAction}
                className={`text-sm font-medium rounded-md px-3 py-1.5 ${config.textColor} border ${config.borderColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`}
              >
                {actionText}
              </button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-md ${config.textColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`}
              onClick={onDismiss}
              aria-label="Fechar"
            >
              <span className="sr-only">Fechar</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 