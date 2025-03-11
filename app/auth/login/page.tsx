'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';
import { handleError, logError, HandledError } from '@/app/lib/utils/errorHandling';
import { validateData } from '@/app/lib/utils/validation';
import { z } from 'zod';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<HandledError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const messageParam = searchParams.get('message');

  // Esquema de validação com Zod
  const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'A senha é obrigatória')
  });

  // Efeito para limpar mensagens de erro após um tempo
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(null), 5000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validação do formulário
    const validationResult = validateData(
      { email, password },
      {
        schema: loginSchema,
        errorMessages: {
          'email': 'Por favor, digite um email válido',
          'password': 'A senha é obrigatória'
        }
      }
    );

    if (!validationResult.isValid) {
      setError({
        code: 'validation-error',
        message: validationResult.errors?.[0] || 'Erro de validação',
        severity: 'warning',
        userMessage: validationResult.errors?.[0] || 'Por favor, corrija os erros no formulário para continuar.',
      });
      setLoading(false);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Login realizado com sucesso!');
      
      // Pequeno atraso para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push(returnTo);
      }, 800);
    } catch (err) {
      const processedError = handleError(err);
      setError(processedError);
      logError(err, { email, context: 'login-page' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('Login com Google realizado com sucesso!');
      
      // Pequeno atraso para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push(returnTo);
      }, 800);
    } catch (err) {
      const processedError = handleError(err);
      setError(processedError);
      logError(err, { context: 'google-login' });
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
            Entrar no Painel ND
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Seu assistente pessoal para organização e produtividade
          </p>
        </div>
        
        {/* Exibir mensagem do parâmetro de URL, se existir */}
        {messageParam && (
          <div className="flex items-center gap-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <AlertCircle size={20} />
            <p>{messageParam}</p>
          </div>
        )}
        
        {/* Mensagem de sucesso */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md animate-fadeIn">
            <CheckCircle2 size={20} />
            <p>{success}</p>
          </div>
        )}
        
        {/* Componente de erro aprimorado */}
        <ErrorMessage 
          error={error} 
          onDismiss={() => setError(null)}
          showAction={error?.suggestedAction !== undefined}
          actionText={error?.code === 'auth/wrong-password' ? 'Esqueci minha senha' : 'Tentar novamente'}
          onAction={() => {
            if (error?.code === 'auth/wrong-password') {
              router.push('/auth/forgot-password');
            } else {
              setError(null);
            }
          }}
        />

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="email-error"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-error"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink px-3 text-gray-500 dark:text-gray-400 text-sm">ou</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <img
              className="h-5 w-5 mr-2"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Entrar com Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Registre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
