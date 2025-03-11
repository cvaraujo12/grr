'use client';

import { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { create } from 'zustand';
import { useRouter } from 'next/navigation';

// Interface para o estado de autenticação
interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

// Store Zustand para autenticação
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Contexto para o AuthProvider
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Criar ou atualizar cookie de autenticação
      if (user) {
        document.cookie = `auth=${user.uid}; path=/; max-age=7200; SameSite=Strict`;
      } else {
        document.cookie = 'auth=; path=/; max-age=0';
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, router]);

  return (
    <AuthContext.Provider value={useAuthStore()}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
