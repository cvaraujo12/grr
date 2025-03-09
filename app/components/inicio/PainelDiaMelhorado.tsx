'use client'

import { useState } from 'react'
import { Edit2, Check, X, Trash2, Plus, Clock } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { usePainelDiaStore, BlocoTempo } from '@/app/stores/painelDiaStore'

// Constantes para melhorar legibilidade e consistência
const CATEGORIA_CORES = {
  inicio: {
    bg: 'bg-opacity-20 bg-inicio-light',
    border: 'border-inicio-primary',
    text: 'text-inicio-primary',
  },
  alimentacao: {
    bg: 'bg-opacity-20 bg-alimentacao-light',
    border: 'border-alimentacao-primary',
    text: 'text-alimentacao-primary',
  },
  estudos: {
    bg: 'bg-opacity-20 bg-estudos-light',
    border: 'border-estudos-primary',
    text: 'text-estudos-primary',
  },
  saude: {
    bg: 'bg-opacity-20 bg-saude-light',
    border: 'border-saude-primary',
    text: 'text-saude-primary',
  },
  lazer: {
    bg: 'bg-opacity-20 bg-lazer-light',
    border: 'border-lazer-primary',
    text: 'text-lazer-primary',
  },
  financas: {
    bg: 'bg-opacity-20 bg-financas-light',
    border: 'border-financas-primary',
    text: 'text-financas-primary',
  },
  hiperfocos: {
    bg: 'bg-opacity-20 bg-hiperfocos-light',
    border: 'border-hiperfocos-primary',
    text: 'text-hiperfocos-primary',
  },
  nenhuma: {
    bg: 'bg-gray-100 dark:bg-gray-700 bg-opacity-30',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-600 dark:text-gray-300',
  },
}

// Componente para Item de Categoria - isola a lógica de renderização das categorias
function CategoriaItem({ 
  nome, 
  categoria, 
  blocoCategoria, 
  onClick 
}: { 
  nome: string, 
  categoria: string, 
  blocoCategoria: string, 
  onClick: () => void 
}) {
  const cores = CATEGORIA_CORES[categoria as keyof typeof CATEGORIA_CORES]
  const isSelected = blocoCategoria === categoria
  
  return (
    <Button
      size="sm"
      variant={isSelected ? 'default' : 'outline'}
      className={`py-0 px-2 h-6 text-xs ${cores.bg} ${cores.text} ${cores.border} focus:ring-2 focus:ring-offset-1`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {nome}
    </Button>
  )
}

// Componente para Bloco de Tempo - isola a lógica de renderização de cada bloco
function BlocoTempoItem({
  bloco,
  isEditing,
  atividadeEditando,
  onAtividadeChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onCategoriaChange,
}: {
  bloco: BlocoTempo,
  isEditing: boolean,
  atividadeEditando: string,
  onAtividadeChange: (valor: string) => void,
  onStartEdit: () => void,
  onSaveEdit: () => void,
  onCancelEdit: () => void,
  onRemove: () => void,
  onCategoriaChange: (categoria: string) => void,
}) {
  const cores = CATEGORIA_CORES[bloco.categoria as keyof typeof CATEGORIA_CORES]
  
  return (
    <div
      className={`p-3 rounded-lg border-l-4 ${cores.bg} ${cores.border} transition-all duration-200 backdrop-blur-sm group hover:border-l-6 focus-within:ring-2 focus-within:ring-offset-2`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-14 shrink-0">
          <Clock className={`h-4 w-4 mr-1 ${cores.text}`} aria-hidden="true" />
          <span className={`font-medium ${cores.text} text-sm`}>
            {bloco.hora}
          </span>
        </div>
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={atividadeEditando}
              onChange={(e) => onAtividadeChange(e.target.value)}
              className="flex-1 border-2"
              placeholder="O que você planeja fazer neste horário?"
              aria-label="Editar atividade"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onSaveEdit}
                aria-label="Salvar edição"
                className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
              >
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEdit}
                aria-label="Cancelar edição"
                className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              >
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <span className="flex-1 text-gray-900 dark:text-white font-medium">
              {bloco.atividade}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={onStartEdit}
                aria-label="Editar este horário"
                className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
                aria-label="Remover este horário"
                className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      {isEditing && (
        <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
            Categoria:
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoriaItem 
              nome="Alimentação" 
              categoria="alimentacao" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('alimentacao')} 
            />
            <CategoriaItem 
              nome="Estudos" 
              categoria="estudos" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('estudos')} 
            />
            <CategoriaItem 
              nome="Saúde" 
              categoria="saude" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('saude')} 
            />
            <CategoriaItem 
              nome="Lazer" 
              categoria="lazer" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('lazer')} 
            />
            <CategoriaItem 
              nome="Finanças" 
              categoria="financas" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('financas')} 
            />
            <CategoriaItem 
              nome="Hiperfocos" 
              categoria="hiperfocos" 
              blocoCategoria={bloco.categoria} 
              onClick={() => onCategoriaChange('hiperfocos')} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para Adição de Novo Bloco
function NovoBloco({
  novaHora,
  novaAtividade,
  onHoraChange,
  onAtividadeChange,
  onSave,
  onCancel,
}: {
  novaHora: string,
  novaAtividade: string,
  onHoraChange: (valor: string) => void,
  onAtividadeChange: (valor: string) => void,
  onSave: () => void,
  onCancel: () => void,
}) {
  return (
    <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 bg-gray-50 dark:bg-gray-800/50">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Novo Horário</h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <div>
            <label htmlFor="nova-hora" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Horário
            </label>
            <Input
              id="nova-hora"
              type="time"
              value={novaHora}
              onChange={(e) => onHoraChange(e.target.value)}
              className="w-24 text-sm"
              placeholder="Hora"
              aria-label="Nova hora"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="nova-atividade" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Atividade
            </label>
            <Input
              id="nova-atividade"
              value={novaAtividade}
              onChange={(e) => onAtividadeChange(e.target.value)}
              className="flex-1 text-sm"
              placeholder="O que você planeja fazer neste horário?"
              aria-label="Nova atividade"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="text-sm"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={!novaHora || !novaAtividade}
            className="text-sm"
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PainelDiaMelhorado() {
  const { blocos, editarAtividade, editarCategoria, adicionarBloco, removerBloco } = usePainelDiaStore()
  const [blocoEditando, setBlocoEditando] = useState<string | null>(null)
  const [atividadeEditando, setAtividadeEditando] = useState('')
  const [novoBloco, setNovoBloco] = useState(false)
  const [novaHora, setNovaHora] = useState('')
  const [novaAtividade, setNovaAtividade] = useState('')
  
  // Iniciar edição de um bloco
  const iniciarEdicao = (bloco: BlocoTempo) => {
    setBlocoEditando(bloco.id)
    setAtividadeEditando(bloco.atividade)
  }

  // Salvar a edição de um bloco
  const salvarEdicao = () => {
    if (blocoEditando) {
      editarAtividade(blocoEditando, atividadeEditando)
      cancelarEdicao()
    }
  }

  // Cancelar a edição
  const cancelarEdicao = () => {
    setBlocoEditando(null)
    setAtividadeEditando('')
  }

  // Função para mostrar o formulário de novo bloco
  const mostrarNovoBloco = () => {
    setNovoBloco(true)
    setNovaHora('')
    setNovaAtividade('')
  }

  // Função para adicionar um novo bloco
  const adicionarNovoBloco = () => {
    if (novaHora && novaAtividade) {
      const id = `${Date.now()}`
      adicionarBloco({
        id,
        hora: novaHora,
        atividade: novaAtividade,
        categoria: 'nenhuma'
      })
      setNovoBloco(false)
      setNovaHora('')
      setNovaAtividade('')
    }
  }

  // Função para cancelar a adição de novo bloco
  const cancelarNovoBloco = () => {
    setNovoBloco(false)
    setNovaHora('')
    setNovaAtividade('')
  }

  // Ordenar blocos por hora
  const blocosOrdenados = [...blocos].sort((a, b) => {
    const horaA = a.hora.split(':').map(Number);
    const horaB = b.hora.split(':').map(Number);
    
    if (horaA[0] !== horaB[0]) {
      return horaA[0] - horaB[0];
    }
    return horaA[1] - horaB[1];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          Planejamento do Dia
        </h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={mostrarNovoBloco}
          className="flex items-center gap-1 text-xs"
          aria-label="Adicionar novo horário"
        >
          <Plus className="h-3 w-3" /> Novo Horário
        </Button>
      </div>

      {novoBloco && (
        <NovoBloco
          novaHora={novaHora}
          novaAtividade={novaAtividade}
          onHoraChange={setNovaHora}
          onAtividadeChange={setNovaAtividade}
          onSave={adicionarNovoBloco}
          onCancel={cancelarNovoBloco}
        />
      )}

      {blocosOrdenados.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Adicione horários para planejar seu dia
          </p>
          <Button 
            size="sm" 
            onClick={mostrarNovoBloco}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Horário
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {blocosOrdenados.map((bloco) => (
            <BlocoTempoItem
              key={bloco.id}
              bloco={bloco}
              isEditing={blocoEditando === bloco.id}
              atividadeEditando={atividadeEditando}
              onAtividadeChange={setAtividadeEditando}
              onStartEdit={() => iniciarEdicao(bloco)}
              onSaveEdit={salvarEdicao}
              onCancelEdit={cancelarEdicao}
              onRemove={() => removerBloco(bloco.id)}
              onCategoriaChange={(categoria) => editarCategoria(bloco.id, categoria)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 