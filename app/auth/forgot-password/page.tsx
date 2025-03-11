'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';
import { handleError, logError, HandledError } from '@/app/lib/utils/errorHandling';
import { validateData } from '@/app/lib/utils/validation';
import { z } from 'zod';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<HandledError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Esquema de validação com Zod
  const emailSchema = z.object({
    email: z.string().email('Email inválido')
  });

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validação do formulário
    const validationResult = validateData(
      { email },
      {
        schema: emailSchema,
        errorMessages: {
          'email': 'Por favor, digite um email válido'
        }
      }
    );

    if (!validationResult.isValid) {
      setError({
        code: 'validation-error',
        message: validationResult.errors?.[0] || 'Erro de validação',
        severity: 'warning',
        userMessage: validationResult.errors?.[0] || 'Por favor, corrija o email para continuar.',
      });
      setLoading(false);
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
      // Não redirecionamos automaticamente para que o usuário possa ler a mensagem
    } catch (err) {
      const processedError = handleError(err);
      setError(processedError);
      logError(err, { email, context: 'forgot-password-page' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Logo Painel ND"
              width={64}
              height={64}
              className="mb-4"
            />
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Recupere sua senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enviaremos um email com instruções para redefinir sua senha
          </p>
        </div>
        
        {/* Componente de erro aprimorado */}
        <ErrorMessage 
          error={error} 
          onDismiss={() => setError(null)}
        />

        {/* Mensagem de sucesso */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md animate-fadeIn">
            <CheckCircle2 size={20} />
            <p>{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Seu email de cadastro
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="email-error"
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-live="polite"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Enviando...
                </span>
              ) : (
                'Enviar link de recuperação'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <Link 
            href="/auth/login" 
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para o login
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Não recebeu o email? Verifique sua pasta de spam ou tente novamente com um email diferente.
          </p>
        </div>
      </div>
    </div>
  );
} 