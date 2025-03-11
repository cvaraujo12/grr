'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2, Info, CheckCircle2, Check, X } from 'lucide-react';
import Image from 'next/image';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';
import { handleError, logError, HandledError } from '@/app/lib/utils/errorHandling';
import { validateData } from '@/app/lib/utils/validation';
import { z } from 'zod';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<HandledError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  
  // Regras de senha
  const passwordRules = [
    { id: 'length', label: 'Pelo menos 6 caracteres', test: (p: string) => p.length >= 6 },
    { id: 'lowercase', label: 'Pelo menos uma letra minúscula', test: (p: string) => /[a-z]/.test(p) },
    { id: 'uppercase', label: 'Pelo menos uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
    { id: 'number', label: 'Pelo menos um número', test: (p: string) => /[0-9]/.test(p) },
    { id: 'match', label: 'Senhas coincidem', test: (p: string) => p === confirmPassword && p !== '' },
  ];

  // Schema de validação para o formulário de cadastro
  const signupSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  });

  // Efeito para limpar mensagens de sucesso após um tempo
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(null), 5000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validação do formulário
    const validationResult = validateData(
      { email, password, confirmPassword },
      { 
        schema: signupSchema,
        errorMessages: {
          'email': 'Por favor, forneça um email válido',
          'password': 'A senha deve atender aos requisitos de segurança',
          'confirmPassword': 'As senhas não coincidem'
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
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Conta criada com sucesso!');
      
      // Pequeno atraso para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      const processedError = handleError(err);
      setError(processedError);
      logError(err, { email, context: 'signup-page' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('Autenticado com Google com sucesso!');
      
      // Pequeno atraso para mostrar a mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push(returnTo);
      }, 1500);
    } catch (err) {
      const processedError = handleError(err);
      setError(processedError);
      logError(err, { context: 'google-signup' });
    } finally {
      setLoading(false);
    }
  };

  // Valida a força da senha
  const getPasswordStrength = () => {
    if (!password) return 0;
    const passedRules = passwordRules.filter(rule => rule.id !== 'match').filter(rule => rule.test(password));
    return (passedRules.length / (passwordRules.length - 1)) * 100;
  };

  const passwordStrength = getPasswordStrength();
  const passwordStrengthColor = 
    passwordStrength < 25 ? 'bg-red-500' : 
    passwordStrength < 50 ? 'bg-orange-500' : 
    passwordStrength < 75 ? 'bg-yellow-500' : 
    'bg-green-500';

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
            Criar Conta no Painel ND
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Seu assistente pessoal para organização e produtividade
          </p>
        </div>

        {/* Mensagem de erro usando o componente ErrorMessage */}
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

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-error"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmar Senha</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-describedby="confirm-password-error"
                disabled={loading}
              />
            </div>
          </div>

          {/* Indicador de força da senha */}
          {password && (
            <div className="mt-2">
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className={`h-full ${passwordStrengthColor} transition-all duration-300`} 
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Força da senha: {
                  passwordStrength < 25 ? 'Muito fraca' : 
                  passwordStrength < 50 ? 'Fraca' : 
                  passwordStrength < 75 ? 'Média' : 
                  'Forte'
                }
              </p>
            </div>
          )}

          {/* Regras de senha */}
          {(passwordFocus || password) && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Info size={16} />
                <p className="text-sm font-medium">
                  Requisitos de senha:
                </p>
              </div>
              <ul className="space-y-2 pl-2">
                {passwordRules.map(rule => (
                  <li key={rule.id} className="flex items-center text-sm gap-2">
                    {rule.test(password) ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-gray-400" />
                    )}
                    <span className={rule.test(password) ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
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
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <img
              className="h-5 w-5 mr-2"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            Cadastrar com Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
