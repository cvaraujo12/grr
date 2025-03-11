import { StateCreator, create } from 'zustand'
import { createJSONStorage, persist, devtools } from 'zustand/middleware'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Interfaces para melhor tipagem e documentação
export interface RegistroSono {
  id: string
  inicio: string           // ISO date string
  fim: string | null       // ISO date string ou null se ainda dormindo
  qualidade: number | null // 1-5, onde 5 é excelente
  notas: string           // Observações sobre o sono
  duracaoMinutos: number | null  // Calculado automaticamente quando fim é definido
}

export interface ConfiguracaoLembrete {
  id: string
  tipo: 'dormir' | 'acordar'
  horario: string         // Formato HH:mm
  diasSemana: number[]    // 0-6, onde 0 é domingo
  ativo: boolean
  mensagem?: string       // Mensagem personalizada do lembrete
}

export interface SonoState {
  // Estado
  registros: RegistroSono[]
  lembretes: ConfiguracaoLembrete[]
  ultimaAtualizacao: string | null // Data da última modificação
  
  // Ações com feedback visual
  adicionarRegistroSono: (inicio: string, fim?: string | null, qualidade?: number | null, notas?: string) => string // Retorna ID
  atualizarRegistroSono: (id: string, dados: Partial<Omit<RegistroSono, 'id'>>) => boolean // Retorna sucesso
  removerRegistroSono: (id: string) => boolean // Retorna sucesso
  
  adicionarLembrete: (tipo: 'dormir' | 'acordar', horario: string, diasSemana: number[], mensagem?: string) => string // Retorna ID
  atualizarLembrete: (id: string, dados: Partial<Omit<ConfiguracaoLembrete, 'id'>>) => boolean // Retorna sucesso
  removerLembrete: (id: string) => boolean // Retorna sucesso
  alternarAtivoLembrete: (id: string) => boolean // Retorna novo estado
  
  // Utilitários
  calcularDuracaoSono: (registro: RegistroSono) => number | null
  formatarHorario: (data: string) => string
}

// Funções utilitárias
const calcularDuracao = (inicio: string, fim: string | null): number | null => {
  if (!fim) return null
  const inicioDate = new Date(inicio)
  const fimDate = new Date(fim)
  return Math.round((fimDate.getTime() - inicioDate.getTime()) / (1000 * 60))
}

const formatarHorario = (data: string): string => {
  return format(new Date(data), 'HH:mm', { locale: ptBR })
}

// Store com persistência local e feedback visual
// Tipos para persistência e devtools
type SonoPersist = StateCreator<
  SonoState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SonoState
>

// Store com persistência local e feedback visual
export const useSonoStore = create<SonoState>()(
  persist(
    devtools(
      (set, get) => ({
      registros: [],
      lembretes: [],
      ultimaAtualizacao: null,
      
      adicionarRegistroSono: (inicio, fim = null, qualidade = null, notas = '') => {
        const id = Date.now().toString()
        const duracao = fim ? calcularDuracao(inicio, fim) : null
        
        set(
          { 
            registros: [
              ...get().registros,
              {
                id,
                inicio,
                fim,
                qualidade,
                notas,
                duracaoMinutos: duracao
              }
            ],
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/adicionarRegistro' }
        )
        
        return id
      },
      
      atualizarRegistroSono: (id, dados) => {
        let sucesso = false
        const state = get()
        const registro = state.registros.find(r => r.id === id)
        
        if (!registro) return false
        
        const duracao = dados.fim 
          ? calcularDuracao(dados.inicio || registro.inicio, dados.fim)
          : registro.duracaoMinutos
        
        set(
          {
            registros: state.registros.map((r) => 
              r.id === id 
                ? { ...r, ...dados, duracaoMinutos: duracao } 
                : r
            ),
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/atualizarRegistro' }
        )
        
        return true
      },
      
      removerRegistroSono: (id) => {
        const state = get()
        const registroExiste = state.registros.some(r => r.id === id)
        
        if (!registroExiste) return false
        
        set(
          {
            registros: state.registros.filter(r => r.id !== id),
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/removerRegistro' }
        )
        
        return true
      },
      
      adicionarLembrete: (tipo, horario, diasSemana, mensagem = '') => {
        const id = Date.now().toString()
        
        set(
          {
            lembretes: [
              ...get().lembretes,
              {
                id,
                tipo,
                horario,
                diasSemana,
                mensagem,
                ativo: true
              }
            ],
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/adicionarLembrete' }
        )
        
        return id
      },
      
      atualizarLembrete: (id, dados) => {
        const state = get()
        const lembreteExiste = state.lembretes.some(l => l.id === id)
        
        if (!lembreteExiste) return false
        
        set(
          {
            lembretes: state.lembretes.map((l) => 
              l.id === id 
                ? { ...l, ...dados } 
                : l
            ),
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/atualizarLembrete' }
        )
        
        return true
      },
      
      removerLembrete: (id) => {
        const state = get()
        const lembreteExiste = state.lembretes.some(l => l.id === id)
        
        if (!lembreteExiste) return false
        
        set(
          {
            lembretes: state.lembretes.filter(l => l.id !== id),
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/removerLembrete' }
        )
        
        return true
      },
      
      alternarAtivoLembrete: (id) => {
        const state = get()
        const lembrete = state.lembretes.find(l => l.id === id)
        
        if (!lembrete) return false
        
        const novoEstado = !lembrete.ativo
        
        set(
          {
            lembretes: state.lembretes.map((l) =>
              l.id === id
                ? { ...l, ativo: novoEstado }
                : l
            ),
            ultimaAtualizacao: new Date().toISOString()
          },
          true,
          { type: 'sono/alternarLembrete' }
        )
        
        return novoEstado
      },
      
      // Utilitários
      calcularDuracaoSono: (registro) => calcularDuracao(registro.inicio, registro.fim),
      formatarHorario
    }),
      { name: 'sono-store' }
    ),
    {
      name: 'sono-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        registros: state.registros,
        lembretes: state.lembretes,
        ultimaAtualizacao: state.ultimaAtualizacao
      }) as Partial<SonoState>
    }
  )
)
