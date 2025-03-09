'use client'

import { useState, useCallback, useMemo } from 'react'
import { Pill, Plus, X, Edit, Trash, Check, Clock, Calendar } from 'lucide-react'
import { useMedicacao } from '@/app/hooks/useMedicacao'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { Alert } from '../ui/Alert'
import { MedicamentosList } from './MedicamentosList'
import { StatCard } from './StatCard'

export function RegistroMedicamentos() {
  // Usar o hook personalizado para medicações
  const { 
    medicacoes, 
    medicacoesPendentes,
    adicionarMedicacao, 
    removerMedicacao, 
    atualizarMedicacao, 
    registrarMedicacaoTomada,
    verificarHorarioTomado
  } = useMedicacao()
  
  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    horarios: ['08:00'],
    observacoes: '',
  })
  
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [novoHorario, setNovoHorario] = useState('08:00')
  const [erro, setErro] = useState('')

  // Usar useCallback para funções que são passadas como props ou dependências
  const handleAdicionarMedicamento = useCallback(() => {
    if (!novoMedicamento.nome) {
      setErro('O nome do medicamento é obrigatório')
      return
    }

    if (novoMedicamento.horarios.length === 0) {
      setErro('Adicione pelo menos um horário')
      return
    }

    // Adicionar medicação usando o hook
    adicionarMedicacao(
      novoMedicamento.nome,
      novoMedicamento.horarios,
      novoMedicamento.observacoes
    )

    // Resetar o formulário
    setNovoMedicamento({
      nome: '',
      horarios: ['08:00'],
      observacoes: '',
    })
    
    setMostrarForm(false)
    setErro('')
  }, [novoMedicamento, adicionarMedicacao])

  // Função para editar medicação
  const handleEditarMedicamento = useCallback(() => {
    if (!editandoId) return
    
    if (!novoMedicamento.nome) {
      setErro('O nome do medicamento é obrigatório')
      return
    }

    if (novoMedicamento.horarios.length === 0) {
      setErro('Adicione pelo menos um horário')
      return
    }

    // Atualizar medicação usando o hook
    atualizarMedicacao(editandoId, {
      nome: novoMedicamento.nome,
      horarios: novoMedicamento.horarios,
      observacoes: novoMedicamento.observacoes
    })

    // Resetar o formulário
    setNovoMedicamento({
      nome: '',
      horarios: ['08:00'],
      observacoes: '',
    })
    
    setEditandoId(null)
    setMostrarForm(false)
    setErro('')
  }, [editandoId, novoMedicamento, atualizarMedicacao])

  // Função para marcar medicação como tomada
  const marcarComoTomada = useCallback((id: string, dataHorario: string, tomada: boolean) => {
    registrarMedicacaoTomada(id, dataHorario, tomada)
  }, [registrarMedicacaoTomada])

  // Função para iniciar edição
  const iniciarEdicao = useCallback((id: string) => {
    const medicacao = medicacoes.find(m => m.id === id)
    if (!medicacao) return

    setNovoMedicamento({
      nome: medicacao.nome,
      horarios: [...medicacao.horarios],
      observacoes: medicacao.observacoes || '',
    })
    
    setEditandoId(id)
    setMostrarForm(true)
  }, [medicacoes])

  // Função para adicionar horário ao formulário
  const adicionarHorarioAoForm = useCallback(() => {
    if (!novoHorario) return
    
    setNovoMedicamento(prev => ({
      ...prev,
      horarios: [...prev.horarios, novoHorario],
    }))
    
    setNovoHorario('08:00')
  }, [novoHorario])

  // Função para remover horário do formulário
  const removerHorarioDoForm = useCallback((index: number) => {
    setNovoMedicamento(prev => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== index),
    }))
  }, [])

  // Obter data de hoje formatada
  const dataHoje = useMemo(() => new Date().toISOString().split('T')[0], [])
  
  // Estatísticas para exibição
  const estatisticas = useMemo(() => {
    const total = medicacoes.length
    const pendentes = medicacoesPendentes.length
    const tomadas = medicacoes.reduce((acc, med) => {
      const horariosTomadosHoje = med.horarios.filter(h => 
        verificarHorarioTomado(med.id, `${dataHoje}-${h}`)
      ).length
      return acc + horariosTomadosHoje
    }, 0)
    
    return { total, pendentes, tomadas }
  }, [medicacoes, medicacoesPendentes, verificarHorarioTomado, dataHoje])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          titulo="Total de Medicamentos" 
          valor={estatisticas.total} 
          icone={<Pill className="h-5 w-5" />} 
        />
        <StatCard 
          titulo="Doses Pendentes Hoje" 
          valor={estatisticas.pendentes} 
          icone={<Clock className="h-5 w-5" />} 
          alerta={estatisticas.pendentes > 0} 
        />
        <StatCard 
          titulo="Doses Tomadas Hoje" 
          valor={estatisticas.tomadas} 
          icone={<Check className="h-5 w-5" />} 
        />
      </div>

      <Card title="Seus Medicamentos">
        <div className="space-y-4">
          {medicacoes.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Você não tem medicamentos cadastrados
            </div>
          ) : (
            <MedicamentosList 
              medicamentos={medicacoes} 
              onEditar={iniciarEdicao}
              onRemover={removerMedicacao}
              onTomarMedicacao={marcarComoTomada}
              verificarTomado={verificarHorarioTomado}
            />
          )}
          
          <Button 
            onClick={() => {
              setMostrarForm(true)
              setEditandoId(null)
              setNovoMedicamento({
                nome: '',
                horarios: ['08:00'],
                observacoes: '',
              })
            }}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Medicamento
          </Button>
        </div>
      </Card>

      {/* Modal de formulário */}
      <Modal 
        isOpen={mostrarForm} 
        onClose={() => {
          setMostrarForm(false)
          setErro('')
        }}
        title={editandoId ? "Editar Medicamento" : "Novo Medicamento"}
      >
        <div className="space-y-4">
          {erro && <Alert variant="error">{erro}</Alert>}

          <div>
            <label className="block text-sm font-medium mb-1">Nome do Medicamento</label>
            <Input 
              value={novoMedicamento.nome}
              onChange={(e) => setNovoMedicamento(prev => ({...prev, nome: e.target.value}))}
              placeholder="Ex: Ritalina"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Horários</label>
            <div className="flex items-center gap-2 mb-2">
              <Input 
                type="time"
                value={novoHorario}
                onChange={(e) => setNovoHorario(e.target.value)}
                className="flex-1"
              />
              <Button onClick={adicionarHorarioAoForm} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {novoMedicamento.horarios.map((horario, index) => (
                <Badge key={index} className="flex items-center gap-1">
                  {horario}
                  <button 
                    onClick={() => removerHorarioDoForm(index)}
                    className="ml-1 rounded-full hover:bg-red-600 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Observações</label>
            <Textarea 
              value={novoMedicamento.observacoes}
              onChange={(e) => setNovoMedicamento(prev => ({...prev, observacoes: e.target.value}))}
              rows={3}
              placeholder="Informações adicionais, como: Tomar com alimentos, etc."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="secondary"
              onClick={() => {
                setMostrarForm(false)
                setErro('')
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={editandoId ? handleEditarMedicamento : handleAdicionarMedicamento}
            >
              {editandoId ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
