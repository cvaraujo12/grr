'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/app/components/ui/Card'
import { PainelDia } from '@/app/components/inicio/PainelDia'
import { ListaPrioridades } from '@/app/components/inicio/ListaPrioridades'
import { LembretePausas } from '@/app/components/inicio/LembretePausas'
import { ChecklistMedicamentos } from '@/app/components/inicio/ChecklistMedicamentos'
import { useAuth } from '@/app/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Carregando seu painel...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Olá, {user.displayName || 'Visitante'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Visual do Dia */}
        <div className="md:col-span-2">
          <Card title="Painel do Dia">
            <PainelDia />
          </Card>
        </div>
        
        {/* Lista de Prioridades */}
        <div>
          <Card title="Prioridades do Dia">
            <div className="space-y-6">
              <ListaPrioridades />
              
              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              {/* Checklist de Medicamentos Diários */}
              <ChecklistMedicamentos />
            </div>
          </Card>
        </div>
      </div>
      
      {/* Lembretes de Pausas */}
      <Card title="Lembretes de Pausas">
        <LembretePausas />
      </Card>
    </div>
  )
}
