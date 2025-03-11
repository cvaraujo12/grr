/**
 * Utilitário para tratamento de erros do Firebase e outros serviços
 */

import { FirebaseError } from 'firebase/app';

// Tipo para representar erros mapeados
export type HandledError = {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  userMessage: string;
  suggestedAction?: string;
};

// Mapeamento de códigos de erro do Firebase para mensagens amigáveis
const firebaseErrorMap: Record<string, Omit<HandledError, 'code'>> = {
  // Erros de autenticação
  'auth/email-already-in-use': {
    message: 'Este email já está sendo usado por outra conta.',
    severity: 'warning',
    userMessage: 'Este email já está registrado. Tente fazer login ou recuperar sua senha.',
    suggestedAction: 'Faça login ou use a opção "Esqueci minha senha"'
  },
  'auth/weak-password': {
    message: 'A senha fornecida é muito fraca.',
    severity: 'warning',
    userMessage: 'Sua senha precisa ser mais forte. Use pelo menos 6 caracteres com letras, números e símbolos.',
  },
  'auth/user-not-found': {
    message: 'Usuário não encontrado.',
    severity: 'warning',
    userMessage: 'Não existe conta com este email. Verifique se digitou corretamente ou crie uma nova conta.',
  },
  'auth/wrong-password': {
    message: 'Senha incorreta.',
    severity: 'warning',
    userMessage: 'Senha incorreta. Tente novamente ou redefina sua senha.',
    suggestedAction: 'Verifique se a senha está correta ou use "Esqueci minha senha"'
  },
  'auth/too-many-requests': {
    message: 'Muitas tentativas de login malsucedidas.',
    severity: 'warning',
    userMessage: 'Conta temporariamente bloqueada devido a muitas tentativas. Tente novamente mais tarde ou redefina sua senha.',
    suggestedAction: 'Aguarde alguns minutos e tente novamente'
  },
  'auth/invalid-login-credentials': {
    message: 'Credenciais de login inválidas.',
    severity: 'warning',
    userMessage: 'Email ou senha incorretos. Verifique suas informações e tente novamente.',
    suggestedAction: 'Verifique se digitou corretamente o email e a senha'
  },
  'auth/invalid-email': {
    message: 'Formato de email inválido.',
    severity: 'warning',
    userMessage: 'O formato do email informado é inválido. Por favor, use um email válido (ex: nome@dominio.com).',
  },
  'auth/missing-password': {
    message: 'Senha não informada.',
    severity: 'warning',
    userMessage: 'Por favor, informe sua senha para continuar.',
  },
  'auth/network-request-failed': {
    message: 'Falha na requisição de rede.',
    severity: 'error',
    userMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.',
    suggestedAction: 'Verifique sua conexão com a internet'
  },
  'auth/popup-closed-by-user': {
    message: 'O popup de autenticação foi fechado antes da operação ser concluída.',
    severity: 'info',
    userMessage: 'A janela de login foi fechada. Por favor, tente novamente e mantenha a janela aberta até a conclusão.',
  },
  'auth/internal-error': {
    message: 'Erro interno de autenticação.',
    severity: 'error',
    userMessage: 'Ocorreu um erro interno no serviço de autenticação. Por favor, tente novamente mais tarde.',
  },
  'auth/requires-recent-login': {
    message: 'Esta operação é sensível e requer autenticação recente.',
    severity: 'warning',
    userMessage: 'Por motivos de segurança, faça login novamente antes de realizar esta operação.',
    suggestedAction: 'Faça logout e login novamente'
  },
  'auth/email-already-exists': {
    message: 'O email já está sendo usado por outra conta.',
    severity: 'warning',
    userMessage: 'Este email já está cadastrado. Por favor, use outro email ou tente recuperar sua senha.',
  },
  
  // Erros específicos de recuperação de senha
  'auth/expired-action-code': {
    message: 'O código de ação expirou.',
    severity: 'warning',
    userMessage: 'O link de recuperação de senha expirou. Por favor, solicite um novo link.',
    suggestedAction: 'Solicite um novo link de recuperação de senha'
  },
  'auth/invalid-action-code': {
    message: 'O código de ação é inválido.',
    severity: 'warning',
    userMessage: 'O link de recuperação de senha é inválido ou já foi usado. Por favor, solicite um novo link.',
    suggestedAction: 'Solicite um novo link de recuperação de senha'
  },
  'auth/quota-exceeded': {
    message: 'Cota excedida para esta operação.',
    severity: 'warning',
    userMessage: 'Você enviou muitas solicitações recentemente. Por favor, aguarde um pouco antes de tentar novamente.',
    suggestedAction: 'Aguarde alguns minutos antes de tentar novamente'
  },
  
  // Erros de Firestore
  'permission-denied': {
    message: 'Permissão negada ao acessar o Firestore.',
    severity: 'error',
    userMessage: 'Você não tem permissão para realizar esta ação. Faça login novamente ou contate o suporte.',
  },
  'unavailable': {
    message: 'Serviço Firestore indisponível.',
    severity: 'error',
    userMessage: 'Serviço temporariamente indisponível. Verifique sua conexão ou tente novamente mais tarde.',
  },
  
  // Erro genérico
  'default': {
    message: 'Ocorreu um erro inesperado.',
    severity: 'error',
    userMessage: 'Ocorreu um problema. Tente novamente mais tarde.',
  }
};

/**
 * Processa um erro e retorna uma estrutura padronizada com mensagens amigáveis
 * @param error Objeto de erro
 * @returns Erro processado com detalhes e mensagens amigáveis
 */
export function handleError(error: unknown): HandledError {
  // Para erros do Firebase, extraímos o código e mapeamos para mensagens amigáveis
  if (error instanceof FirebaseError) {
    const errorData = firebaseErrorMap[error.code] || firebaseErrorMap['default'];
    return {
      code: error.code,
      ...errorData
    };
  }
  
  // Para erros gerais, criamos um objeto de erro padrão
  let errorMessage = 'Erro desconhecido';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return {
    code: 'unknown-error',
    message: errorMessage,
    severity: 'error',
    userMessage: 'Ocorreu um problema inesperado. Tente novamente mais tarde.',
  };
}

/**
 * Registra um erro no sistema de logs
 * @param error Erro a ser registrado
 * @param context Contexto adicional sobre o erro
 */
export function logError(error: unknown, context: Record<string, any> = {}): void {
  const processedError = handleError(error);
  
  // Em desenvolvimento, exibimos no console
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[${processedError.severity.toUpperCase()}] ${processedError.code}: ${processedError.message}`,
      { error, context }
    );
  }
  
  // Em produção, poderia enviar para um serviço de monitoramento como Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   // Enviar para serviço de monitoramento
  // }
} 