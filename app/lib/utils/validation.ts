/**
 * Utilitários para validação de dados
 * Este módulo fornece funções para validar dados antes de usar/sincronizar com o Firestore
 */

import { z } from 'zod';

/**
 * Tipo para representar um esquema de validação com mensagens de erro
 */
export type ValidationSchema<T> = {
  schema: z.ZodType<T>;
  errorMessages: Record<string, string>;
};

/**
 * Valida dados contra um esquema Zod
 * @param data Dados a serem validados
 * @param schema Esquema de validação
 * @returns Objeto com resultado da validação e erros (se houver)
 */
export function validateData<T>(
  data: unknown, 
  validationSchema: ValidationSchema<T>
): { 
  isValid: boolean; 
  validatedData?: T; 
  errors?: string[]; 
} {
  try {
    const validatedData = validationSchema.schema.parse(data);
    return { isValid: true, validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        const customMessage = path in validationSchema.errorMessages 
          ? validationSchema.errorMessages[path]
          : err.message;
        return customMessage;
      });
      return { isValid: false, errors };
    }
    
    return { 
      isValid: false, 
      errors: ['Erro desconhecido durante validação'] 
    };
  }
}

/**
 * Verifica se um objeto existe e tem propriedades
 * @param obj Objeto a ser verificado
 * @returns Verdadeiro se o objeto existir e tiver propriedades
 */
export function isValidObject(obj: unknown): boolean {
  return obj !== null && 
         typeof obj === 'object' && 
         Object.keys(obj as object).length > 0;
}

/**
 * Valida um array de objetos
 * @param array Array a ser validado
 * @param itemValidator Função para validar cada item
 * @returns Verdadeiro se todos os itens forem válidos
 */
export function validateArray<T>(
  array: unknown, 
  itemValidator: (item: unknown) => boolean
): boolean {
  if (!Array.isArray(array)) {
    return false;
  }
  
  return array.every(item => itemValidator(item));
}

/**
 * Sanitiza um objeto removendo campos indesejados
 * @param obj Objeto a ser sanitizado
 * @param allowedFields Lista de campos permitidos
 * @returns Objeto sanitizado apenas com campos permitidos
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T, 
  allowedFields: string[]
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key))
  ) as Partial<T>;
} 