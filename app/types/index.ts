// Tipos básicos compartilhados
export type Categoria = 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer' | 'nenhuma';

// Tipos para o módulo de Tarefas
export namespace TarefaTypes {
  export type Tarefa = {
    id: string;
    texto: string;
    concluida: boolean;
    categoria: Categoria;
    data: string; // formato YYYY-MM-DD
    prioridade?: 'baixa' | 'media' | 'alta';
    criado_em: string; // ISO timestamp
  };
}

// Tipos para o módulo de Organização do Tempo
export namespace TempoTypes {
  export type BlocoTempo = {
    id: string;
    hora: string;
    atividade: string;
    categoria: Categoria;
    data: string; // formato YYYY-MM-DD
    duracao: number; // em minutos
  };

  export type ConfiguracaoPomodoro = {
    tempoFoco: number; // em minutos
    tempoPausa: number; // em minutos
    tempoLongaPausa: number; // em minutos
    ciclosAntesLongaPausa: number;
  };
}

// Tipos para o módulo de Alimentação
export namespace AlimentacaoTypes {
  export type Refeicao = {
    id: string;
    hora: string;
    descricao: string;
    foto?: string;
    data: string; // formato YYYY-MM-DD
    categoria?: 'cafe' | 'almoco' | 'jantar' | 'lanche';
    sentimento?: 'bom' | 'neutro' | 'ruim';
  };

  export type RegistroHidratacao = {
    id: string;
    data: string; // formato YYYY-MM-DD
    quantidadeCopos: number;
  };
}

// Tipos para o módulo de Saúde
export namespace SaudeTypes {
  export type Medicacao = {
    id: string;
    nome: string;
    horarios: string[];
    tomada: Record<string, boolean>; // chave: data-horario, valor: tomada ou não
    observacoes?: string;
  };

  export type RegistroHumor = {
    id: string;
    data: string; // formato YYYY-MM-DD
    hora: string;
    humor: 'otimo' | 'bom' | 'neutro' | 'ruim' | 'pessimo';
    observacoes?: string;
  };
}

// Tipos para configurações do usuário
export namespace ConfigTypes {
  export type ConfiguracaoUsuario = {
    tempoFoco: number; // em minutos
    tempoPausa: number; // em minutos
    temaEscuro: boolean;
    reducaoEstimulos: boolean;
    notificacoesAtivas: boolean;
    intervalosNotificacaoHidratacao: number; // em minutos
  };
}

// Opções de humor para o monitor de humor
export type OpcaoHumor = 'otimo' | 'bom' | 'neutro' | 'baixo' | 'ruim'

// Interface para atividades de lazer
export type AtividadeLazer = {
  id: string
  nome: string
  descricao: string
  duracao: number // em minutos
  categoria: 'ativo' | 'passivo' | 'criativo' | 'social'
}

// Interface para materiais de estudo
export type MaterialEstudo = {
  id: string
  titulo: string
  tipo: 'livro' | 'video' | 'artigo' | 'exercicio' | 'outro'
  url?: string
  progresso: number // 0-100
  notas?: string
}

// Interface para registro de humor
export type RegistroHumor = {
  id: string
  data: string // formato YYYY-MM-DD
  humor: OpcaoHumor
  notas?: string
}

// Interface para lembretes
export type Lembrete = {
  id: string
  titulo: string
  descricao?: string
  data: string // formato YYYY-MM-DD
  hora: string // formato HH:MM
  recorrente: boolean
  diasRecorrencia?: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom')[]
  categoria: Categoria
  completado: boolean
}

// Interface para registro de hidratação
export type RegistroHidratacao = {
  id: string
  data: string // formato YYYY-MM-DD
  quantidade: number // em ml
  hora: string // formato HH:MM
}

// Interface para sessão de estudo
export type SessaoEstudo = {
  id: string
  data: string // formato YYYY-MM-DD
  inicio: string // formato HH:MM
  fim: string // formato HH:MM
  materia: string
  tecnica: 'pomodoro' | 'blocos' | 'livre'
  produtividade: 1 | 2 | 3 | 4 | 5 // escala de 1 a 5
  notas?: string
}
