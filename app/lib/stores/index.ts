import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos para o estado global
export type Tarefa = {
  id: string
  texto: string
  concluida: boolean
  categoria: 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer'
  data: string // formato YYYY-MM-DD
}

export type BlocoTempo = {
  id: string
  hora: string
  atividade: string
  categoria: 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer' | 'nenhuma'
  data: string // formato YYYY-MM-DD
}

export type Refeicao = {
  id: string
  hora: string
  descricao: string
  foto?: string
  data: string // formato YYYY-MM-DD
}

export type Medicacao = {
  id: string
  nome: string
  horarios: string[]
  tomada: Record<string, boolean> // chave: data-horario, valor: tomada ou não
}

// Novo tipo para medicamentos refatorado
export type Medicamento = {
  id: string
  nome: string
  dosagem: string
  frequencia: string
  horarios: string[]
  observacoes: string
  dataInicio: string
  ultimaTomada: string | null
  intervalo?: number // tempo em minutos entre doses
}

// Novo tipo para registros de humor
export type RegistroHumor = {
  id: string
  data: string
  nivel: number
  fatores: string[]
  notas: string
}

export type ConfiguracaoUsuario = {
  tempoFoco: number // em minutos
  tempoPausa: number // em minutos
  temaEscuro: boolean
  reducaoEstimulos: boolean
}

// Interface do estado global
interface AppState {
  tarefas: Tarefa[]
  blocosTempo: BlocoTempo[]
  refeicoes: Refeicao[]
  medicacoes: Medicacao[]
  configuracao: ConfiguracaoUsuario
  
  // Novos estados para medicamentos e humor refatorados
  medicamentos: Medicamento[]
  registrosHumor: RegistroHumor[]
  
  // Ações para tarefas
  adicionarTarefa: (tarefa: Omit<Tarefa, 'id'>) => void
  removerTarefa: (id: string) => void
  toggleTarefaConcluida: (id: string) => void
  
  // Ações para blocos de tempo
  adicionarBlocoTempo: (bloco: Omit<BlocoTempo, 'id'>) => void
  atualizarBlocoTempo: (id: string, bloco: Partial<BlocoTempo>) => void
  removerBlocoTempo: (id: string) => void
  
  // Ações para refeições
  adicionarRefeicao: (refeicao: Omit<Refeicao, 'id'>) => void
  removerRefeicao: (id: string) => void
  
  // Ações para medicações
  adicionarMedicacao: (medicacao: Omit<Medicacao, 'id'>) => void
  marcarMedicacaoTomada: (id: string, data: string, horario: string, tomada: boolean) => void
  
  // Novas ações para medicamentos refatorados
  adicionarMedicamento: (medicamento: Omit<Medicamento, 'id'>) => void
  atualizarMedicamento: (id: string, medicamento: Partial<Omit<Medicamento, 'id'>>) => void
  removerMedicamento: (id: string) => void
  registrarTomadaMedicamento: (id: string, dataHora: string) => void
  
  // Novas ações para registros de humor
  adicionarRegistroHumor: (registro: Omit<RegistroHumor, 'id'>) => void
  atualizarRegistroHumor: (id: string, registro: Partial<Omit<RegistroHumor, 'id'>>) => void
  removerRegistroHumor: (id: string) => void
  
  // Ações para configurações
  atualizarConfiguracao: (config: Partial<ConfiguracaoUsuario>) => void
}

// Criação da store com persistência local
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado inicial
      tarefas: [],
      blocosTempo: [],
      refeicoes: [],
      medicacoes: [],
      configuracao: {
        tempoFoco: 25,
        tempoPausa: 5,
        temaEscuro: false,
        reducaoEstimulos: false,
      },
      
      // Novos estados iniciais para medicamentos e humor
      medicamentos: [],
      registrosHumor: [],

      // Implementações das ações para tarefas
      adicionarTarefa: (tarefa) =>
        set((state) => ({
          tarefas: [...state.tarefas, { ...tarefa, id: Date.now().toString() }],
        })),
      
      removerTarefa: (id) =>
        set((state) => ({
          tarefas: state.tarefas.filter((t) => t.id !== id),
        })),
      
      toggleTarefaConcluida: (id) =>
        set((state) => ({
          tarefas: state.tarefas.map((t) =>
            t.id === id ? { ...t, concluida: !t.concluida } : t
          ),
        })),

      // Implementações das ações para blocos de tempo
      adicionarBlocoTempo: (bloco) =>
        set((state) => ({
          blocosTempo: [...state.blocosTempo, { ...bloco, id: Date.now().toString() }],
        })),
      
      atualizarBlocoTempo: (id, bloco) =>
        set((state) => ({
          blocosTempo: state.blocosTempo.map((b) =>
            b.id === id ? { ...b, ...bloco } : b
          ),
        })),
      
      removerBlocoTempo: (id) =>
        set((state) => ({
          blocosTempo: state.blocosTempo.filter((b) => b.id !== id),
        })),

      // Implementações das ações para refeições
      adicionarRefeicao: (refeicao) =>
        set((state) => ({
          refeicoes: [...state.refeicoes, { ...refeicao, id: Date.now().toString() }],
        })),
      
      removerRefeicao: (id) =>
        set((state) => ({
          refeicoes: state.refeicoes.filter((r) => r.id !== id),
        })),

      // Implementações das ações para medicações
      adicionarMedicacao: (medicacao) =>
        set((state) => ({
          medicacoes: [
            ...state.medicacoes,
            { ...medicacao, id: Date.now().toString() },
          ],
        })),
      
      marcarMedicacaoTomada: (id, data, horario, tomada) =>
        set((state) => ({
          medicacoes: state.medicacoes.map((med) => {
            if (med.id === id) {
              return {
                ...med,
                tomada: {
                  ...med.tomada,
                  [`${data}-${horario}`]: tomada,
                },
              }
            }
            return med
          }),
        })),
        
      // Implementações das novas ações para medicamentos
      adicionarMedicamento: (medicamento) =>
        set((state) => ({
          medicamentos: [
            ...state.medicamentos,
            {
              ...medicamento,
              id: Date.now().toString(),
            },
          ],
        })),
        
      atualizarMedicamento: (id, medicamento) =>
        set((state) => ({
          medicamentos: state.medicamentos.map((med) =>
            med.id === id ? { ...med, ...medicamento } : med
          ),
        })),
        
      removerMedicamento: (id) =>
        set((state) => ({
          medicamentos: state.medicamentos.filter((med) => med.id !== id),
        })),
        
      registrarTomadaMedicamento: (id, dataHora) =>
        set((state) => ({
          medicamentos: state.medicamentos.map((med) =>
            med.id === id ? { ...med, ultimaTomada: dataHora } : med
          ),
        })),
        
      // Implementações das novas ações para registros de humor
      adicionarRegistroHumor: (registro) =>
        set((state) => ({
          registrosHumor: [
            ...state.registrosHumor,
            {
              ...registro,
              id: Date.now().toString(),
            },
          ],
        })),
        
      atualizarRegistroHumor: (id, registro) =>
        set((state) => ({
          registrosHumor: state.registrosHumor.map((reg) =>
            reg.id === id ? { ...reg, ...registro } : reg
          ),
        })),
        
      removerRegistroHumor: (id) =>
        set((state) => ({
          registrosHumor: state.registrosHumor.filter((reg) => reg.id !== id),
        })),

      // Implementações das ações para configurações
      atualizarConfiguracao: (config) =>
        set((state) => ({
          configuracao: {
            ...state.configuracao,
            ...config,
          },
        })),
    }),
    {
      name: 'painel-neurodivergentes-storage',
      partialize: (state) => ({
        tarefas: state.tarefas,
        blocosTempo: state.blocosTempo,
        refeicoes: state.refeicoes,
        medicacoes: state.medicacoes,
        configuracao: state.configuracao,
        medicamentos: state.medicamentos,
        registrosHumor: state.registrosHumor,
      }),
    }
  )
)

// Exportação centralizada de todos os stores
// Isso facilita as importações e mantém o código organizado

// Re-exportar tipos do store original
export * from './perfilStore';
export * from './sonoStore';
export * from './alimentacaoStore';
export * from './atividadesStore';
export * from './autoconhecimentoStore';
export * from './financasStore';
export * from './hiperfocosStore';
export * from './painelDiaStore';
export * from './pomodoroStore';
export * from './prioridadesStore';
export * from './registroEstudosStore';
export * from './sugestoesStore';

// Exportação dos stores para uso nos componentes
import { usePerfilStore } from './perfilStore';
import { useSonoStore } from './sonoStore';
import { useAlimentacaoStore } from './alimentacaoStore';
import { useAtividadesStore } from './atividadesStore';
import { useAutoconhecimentoStore } from './autoconhecimentoStore';
import { useFinancasStore } from './financasStore';
import { useHiperfocosStore } from './hiperfocosStore';
import { usePainelDiaStore } from './painelDiaStore';
import { usePomodoroStore } from './pomodoroStore';
import { usePrioridadesStore } from './prioridadesStore';
import { useRegistroEstudosStore } from './registroEstudosStore';
import { useSugestoesStore } from './sugestoesStore';

export {
  usePerfilStore,
  useSonoStore,
  useAlimentacaoStore,
  useAtividadesStore,
  useAutoconhecimentoStore,
  useFinancasStore,
  useHiperfocosStore,
  usePainelDiaStore,
  usePomodoroStore,
  usePrioridadesStore,
  useRegistroEstudosStore,
  useSugestoesStore
};
