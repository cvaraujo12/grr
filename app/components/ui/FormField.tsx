'use client';

import React, { useState, useEffect } from 'react';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  rules?: ValidationRule[];
  required?: boolean;
  helperText?: string;
  className?: string;
  id?: string;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  rules = [],
  required = false,
  helperText,
  className = '',
  id,
}: FormFieldProps) => {
  const { highContrast, largerText } = useUIPreferences();
  const [isTouched, setIsTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const fieldId = id || name;

  // Validar o campo quando o valor muda
  useEffect(() => {
    if (isTouched) {
      validateField(value);
    }
  }, [value, isTouched]);

  // Função para validar o campo
  const validateField = (fieldValue: string) => {
    const fieldErrors: string[] = [];
    
    // Verificar regra de obrigatoriedade
    if (required && !fieldValue.trim()) {
      fieldErrors.push('Este campo é obrigatório');
    }
    
    // Verificar outras regras de validação
    rules.forEach(rule => {
      if (!rule.test(fieldValue)) {
        fieldErrors.push(rule.message);
      }
    });
    
    setErrors(fieldErrors);
    setIsValid(fieldErrors.length === 0);
    
    return fieldErrors.length === 0;
  };

  // Manipulador de eventos onBlur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    validateField(e.target.value);
    
    if (onBlur) {
      onBlur(e);
    }
  };

  // Classes condicionais baseadas no estado de validação e preferências do usuário
  const getLabelClasses = () => {
    return `block mb-1 ${largerText ? 'text-base' : 'text-sm'} font-medium 
      ${highContrast ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`;
  };

  const getInputClasses = () => {
    let baseClasses = `w-full px-3 py-2 rounded-lg ${largerText ? 'text-base' : 'text-sm'} `;
    
    if (!isValid && isTouched) {
      baseClasses += highContrast
        ? 'border-2 border-red-800 dark:border-red-300 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 '
        : 'border border-red-300 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200 focus:ring-red-500 focus:border-red-500 ';
    } else {
      baseClasses += highContrast
        ? 'border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white '
        : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 ';
    }
    
    return baseClasses;
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={fieldId} className={getLabelClasses()}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type={type}
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={getInputClasses()}
        placeholder={placeholder}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined}
        required={required}
      />
      
      {/* Mensagens de erro */}
      {errors.length > 0 && isTouched && (
        <div 
          id={`${fieldId}-error`}
          className={`mt-1 ${largerText ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-red-800 dark:text-red-300' : 'text-red-600 dark:text-red-400'}`}
          role="alert"
        >
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-1 flex-shrink-0" />
            <span>{errors[0]}</span>
          </div>
        </div>
      )}
      
      {/* Campo válido */}
      {isValid && isTouched && value && (
        <div className={`mt-1 ${largerText ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-green-800 dark:text-green-300' : 'text-green-600 dark:text-green-400'}`}>
          <div className="flex items-center">
            <CheckCircle size={16} className="mr-1 flex-shrink-0" />
            <span>Campo válido</span>
          </div>
        </div>
      )}
      
      {/* Texto de ajuda */}
      {helperText && !errors.length && (
        <div 
          id={`${fieldId}-helper`}
          className={`mt-1 ${largerText ? 'text-sm' : 'text-xs'} ${highContrast ? 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <div className="flex items-center">
            <Info size={16} className="mr-1 flex-shrink-0" />
            <span>{helperText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormField; 