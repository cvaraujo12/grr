/**
 * Utilitários para gerenciar stores
 */

/**
 * Gera um ID único baseado no timestamp atual e um número aleatório
 * para garantir unicidade
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formata uma hora para o padrão HH:MM
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Retorna a hora atual formatada como HH:MM
 */
export const getCurrentTime = (): string => {
  return formatTime(new Date());
};

/**
 * Verifica se uma data é hoje
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentDate();
}; 