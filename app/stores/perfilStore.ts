import { StateCreator, create } from 'zustand'
import { PersistOptions, createJSONStorage, persist, devtools } from 'zustand/middleware'

// Interfaces para melhor tipagem e documentação
export interface PreferenciasVisuais {
  altoContraste: boolean    // Modo de alto contraste para melhor legibilidade
  reducaoEstimulos: boolean // Reduz animações e elementos distrativos
  textoGrande: boolean      // Aumenta o tamanho do texto para melhor leitura
  temaEscuro: boolean       // Modo escuro para redução de luz
  espacamentoLinhas: boolean // Maior espaçamento entre linhas de texto
  fonteAlternativa: boolean // Fonte mais legível para dislexia
}

export interface MetasDiarias {
  horasSono: number         // Horas ideais de sono por dia
  tarefasPrioritarias: number // Número de tarefas prioritárias por dia
  coposAgua: number         // Meta de copos de água por dia
  pausasProgramadas: number // Número de pausas programadas por dia
  duracaoPausa: number     // Duração de cada pausa em minutos
  intervaloPausas: number  // Intervalo entre pausas em minutos
}

export interface PerfilState {
  // Estado
  nome: string
  preferenciasVisuais: PreferenciasVisuais
  metasDiarias: MetasDiarias
  notificacoesAtivas: boolean
  pausasAtivas: boolean
  ultimaAtualizacao: string // Data da última atualização do perfil
  feedbackSonoro: boolean  // Feedback sonoro para ações importantes
  
  // Ações com tipos explícitos
  atualizarNome: (nome: string) => void
  atualizarPreferenciasVisuais: (preferencias: Partial<PreferenciasVisuais>) => void
  atualizarMetasDiarias: (metas: Partial<MetasDiarias>) => void
  alternarNotificacoes: () => void
  alternarPausas: () => void
  resetarPerfil: () => void
}

// Estado padrão com valores iniciais adequados para neurodivergentes
const defaultState: Omit<PerfilState, keyof Pick<PerfilState, 
  'atualizarNome' | 'atualizarPreferenciasVisuais' | 'atualizarMetasDiarias' | 
  'alternarNotificacoes' | 'alternarPausas' | 'resetarPerfil'
>> = {
  nome: 'Usuário',
  preferenciasVisuais: {
    altoContraste: false,
    reducaoEstimulos: true, // Ativado por padrão para reduzir sobrecarga sensorial
    textoGrande: false,
    temaEscuro: false,
    espacamentoLinhas: true, // Ativado por padrão para melhor legibilidade
    fonteAlternativa: false
  },
  metasDiarias: {
    horasSono: 8,
    tarefasPrioritarias: 3, // Número gerenciável de tarefas
    coposAgua: 8,
    pausasProgramadas: 4,   // Pausas regulares para evitar burnout
    duracaoPausa: 15,      // 15 minutos por pausa
    intervaloPausas: 120   // 2 horas entre pausas
  },
  notificacoesAtivas: true,
  pausasAtivas: true,
  ultimaAtualizacao: new Date().toISOString(),
  feedbackSonoro: true
}

// Tipos para persistência e devtools
type PerfilPersist = StateCreator<
  PerfilState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  PerfilState
>

// Store com persistência local e tipagem forte
export const usePerfilStore = create<PerfilState>()(
  persist(
    devtools(
      (set, get) => ({
      ...defaultState,
      
      atualizarNome: (nome: string) => 
        set(
          { nome },
          false,
          'perfil/atualizarNome'
        ),
      
      atualizarPreferenciasVisuais: (preferencias: Partial<PreferenciasVisuais>) => {
        const state = get()
        const novasPreferencias = {
          ...state.preferenciasVisuais,
          ...preferencias
        }
        
        // Aplica classes CSS globais baseadas nas preferências
        document.documentElement.classList.toggle('alto-contraste', novasPreferencias.altoContraste)
        document.documentElement.classList.toggle('reducao-estimulos', novasPreferencias.reducaoEstimulos)
        document.documentElement.classList.toggle('texto-grande', novasPreferencias.textoGrande)
        document.documentElement.classList.toggle('dark', novasPreferencias.temaEscuro)
        document.documentElement.classList.toggle('espacamento-linhas', novasPreferencias.espacamentoLinhas)
        document.documentElement.classList.toggle('fonte-alternativa', novasPreferencias.fonteAlternativa)
        
        set(
          {
            preferenciasVisuais: novasPreferencias,
            ultimaAtualizacao: new Date().toISOString()
          },
          false,
          'perfil/atualizarPreferenciasVisuais'
        )
      },
      
      atualizarMetasDiarias: (metas: Partial<MetasDiarias>) => {
        const state = get()
        const novasMetas = {
          ...state.metasDiarias,
          ...metas
        }
        
        // Validação de valores mínimos e máximos
        novasMetas.horasSono = Math.min(Math.max(novasMetas.horasSono, 4), 12)
        novasMetas.tarefasPrioritarias = Math.min(Math.max(novasMetas.tarefasPrioritarias, 1), 5)
        novasMetas.coposAgua = Math.min(Math.max(novasMetas.coposAgua, 4), 12)
        novasMetas.pausasProgramadas = Math.min(Math.max(novasMetas.pausasProgramadas, 2), 8)
        novasMetas.duracaoPausa = Math.min(Math.max(novasMetas.duracaoPausa, 5), 30)
        novasMetas.intervaloPausas = Math.min(Math.max(novasMetas.intervaloPausas, 60), 240)
        
        set(
          {
            metasDiarias: novasMetas,
            ultimaAtualizacao: new Date().toISOString()
          },
          false,
          'perfil/atualizarMetasDiarias'
        )
      },
      
      alternarNotificacoes: () => {
        const state = get()
        
        set(
          { 
            notificacoesAtivas: !state.notificacoesAtivas 
          },
          false,
          'perfil/alternarNotificacoes'
        )
      },
      
      alternarPausas: () => {
        const state = get()
        
        set(
          { 
            pausasAtivas: !state.pausasAtivas 
          },
          false,
          'perfil/alternarPausas'
        )
      },
      
      resetarPerfil: () => 
        set(
          defaultState,
          false,
          'perfil/resetar'
        )
    }),
      { name: 'perfil-store' }
    ),
    {
      name: 'perfil-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nome: state.nome,
        preferenciasVisuais: state.preferenciasVisuais,
        metasDiarias: state.metasDiarias,
        notificacoesAtivas: state.notificacoesAtivas,
        pausasAtivas: state.pausasAtivas
      }) as Partial<PerfilState>
    }
  )
)
