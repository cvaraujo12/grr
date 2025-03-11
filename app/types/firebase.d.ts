declare module '@/app/contexts/AuthContext' {
  import { User } from 'firebase/auth'

  interface AuthContextType {
    user: User | null
    loading: boolean
  }

  export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element
  export function useAuth(): AuthContextType
}
