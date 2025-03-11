'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshToken: () => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshToken: async () => null,
  logout: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Função para renovar o token
  const refreshToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      // Force token refresh
      await auth.currentUser?.getIdToken(true);
      const newToken = await user.getIdToken();
      document.cookie = `__session=${newToken}; path=/; max-age=3600; secure; samesite=strict`;
      return newToken;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return null;
    }
  };

  // Função para logout
  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      document.cookie = `__session=; path=/; max-age=0`;
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    // Feedback visual claro durante carregamento
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Atualiza o cookie de sessão para o middleware
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          document.cookie = `__session=${token}; path=/; max-age=3600; secure; samesite=strict`;
          
          // Configurar renovação automática do token a cada 50 minutos (antes dos 60 minutos de expiração)
          const tokenRefreshInterval = setInterval(() => {
            refreshToken();
          }, 50 * 60 * 1000);
          
          return () => clearInterval(tokenRefreshInterval);
        } catch (error) {
          console.error('Erro ao obter token:', error);
        }
      } else {
        document.cookie = `__session=; path=/; max-age=0`;
      }
    });

    return () => unsubscribe();
  }, []);

  // Não renderiza nada durante o carregamento inicial
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-2xl font-semibold text-primary">
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
