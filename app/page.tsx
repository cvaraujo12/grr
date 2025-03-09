import { Card } from '@/app/components/ui/Card'
import { PainelDia } from '@/app/components/inicio/PainelDia'
import { ListaPrioridades } from '@/app/components/inicio/ListaPrioridades'
import { LembretePausas } from '@/app/components/inicio/LembretePausas'
import { ChecklistMedicamentos } from '@/app/components/inicio/ChecklistMedicamentos'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Início</h1>
      
      {/* Banner informativo sobre melhorias de UI/UX */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300">Melhorias de Interface</h2>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Implementamos melhorias na interface para torná-la mais acessível para usuários neurodivergentes.
          </p>
        </div>
        <Link href="/ui-melhorias">
          <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Ver demonstração
          </div>
        </Link>
      </div>
      
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
