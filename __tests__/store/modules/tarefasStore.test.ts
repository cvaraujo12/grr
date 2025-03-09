import { useTarefasStore } from '@/app/store/modules/tarefasStore';
import { generateId, getCurrentDate } from '@/app/store/utils';

// Mock para as funções de utilidade
jest.mock('@/app/store/utils', () => ({
  generateId: jest.fn().mockReturnValue('mocked-id'),
  getCurrentDate: jest.fn().mockReturnValue('2023-10-10'),
}));

describe('TarefasStore', () => {
  // Antes de cada teste, limpa o estado da store
  beforeEach(() => {
    const store = useTarefasStore.getState();
    useTarefasStore.setState({ tarefas: [] });
    jest.clearAllMocks();
  });

  describe('adicionarTarefa', () => {
    it('deve adicionar uma nova tarefa com os dados corretos', () => {
      // Arrange
      const texto = 'Teste de tarefa';
      const categoria = 'estudos';

      // Act
      useTarefasStore.getState().adicionarTarefa(texto, categoria);
      const tarefas = useTarefasStore.getState().tarefas;

      // Assert
      expect(tarefas.length).toBe(1);
      expect(tarefas[0]).toEqual({
        id: 'mocked-id',
        texto: 'Teste de tarefa',
        categoria: 'estudos',
        concluida: false,
        data: '2023-10-10',
        prioridade: 'media',
        criado_em: expect.any(String)
      });
      expect(generateId).toHaveBeenCalledTimes(1);
      expect(getCurrentDate).toHaveBeenCalledTimes(1);
    });

    it('deve adicionar tarefa com prioridade personalizada', () => {
      // Act
      useTarefasStore.getState().adicionarTarefa('Tarefa prioritária', 'estudos', 'alta');
      const tarefas = useTarefasStore.getState().tarefas;

      // Assert
      expect(tarefas[0].prioridade).toBe('alta');
    });
  });

  describe('removerTarefa', () => {
    it('deve remover uma tarefa existente pelo ID', () => {
      // Arrange
      useTarefasStore.setState({
        tarefas: [
          {
            id: 'tarefa-1', 
            texto: 'Tarefa 1', 
            categoria: 'estudos', 
            concluida: false,
            data: '2023-10-10',
            prioridade: 'media',
            criado_em: new Date().toISOString()
          },
          {
            id: 'tarefa-2', 
            texto: 'Tarefa 2', 
            categoria: 'lazer', 
            concluida: false,
            data: '2023-10-10',
            prioridade: 'media',
            criado_em: new Date().toISOString()
          }
        ]
      });

      // Act
      useTarefasStore.getState().removerTarefa('tarefa-1');
      const tarefas = useTarefasStore.getState().tarefas;

      // Assert
      expect(tarefas.length).toBe(1);
      expect(tarefas[0].id).toBe('tarefa-2');
    });
  });

  describe('toggleTarefaConcluida', () => {
    it('deve alternar o estado de conclusão de uma tarefa', () => {
      // Arrange
      useTarefasStore.setState({
        tarefas: [
          {
            id: 'tarefa-1', 
            texto: 'Tarefa 1', 
            categoria: 'estudos', 
            concluida: false,
            data: '2023-10-10',
            prioridade: 'media',
            criado_em: new Date().toISOString()
          }
        ]
      });

      // Act - Marcar como concluída
      useTarefasStore.getState().toggleTarefaConcluida('tarefa-1');
      
      // Assert
      expect(useTarefasStore.getState().tarefas[0].concluida).toBe(true);
      
      // Act - Desmarcar
      useTarefasStore.getState().toggleTarefaConcluida('tarefa-1');
      
      // Assert
      expect(useTarefasStore.getState().tarefas[0].concluida).toBe(false);
    });
  });

  describe('atualizarTarefa', () => {
    it('deve atualizar os dados de uma tarefa existente', () => {
      // Arrange
      useTarefasStore.setState({
        tarefas: [
          {
            id: 'tarefa-1', 
            texto: 'Tarefa Antiga', 
            categoria: 'estudos', 
            concluida: false,
            data: '2023-10-10',
            prioridade: 'media',
            criado_em: new Date().toISOString()
          }
        ]
      });

      // Act
      useTarefasStore.getState().atualizarTarefa('tarefa-1', {
        texto: 'Tarefa Atualizada',
        categoria: 'saude',
        prioridade: 'alta'
      });
      
      const tarefa = useTarefasStore.getState().tarefas[0];
      
      // Assert
      expect(tarefa.texto).toBe('Tarefa Atualizada');
      expect(tarefa.categoria).toBe('saude');
      expect(tarefa.prioridade).toBe('alta');
      // Verifica que outros campos não foram alterados
      expect(tarefa.concluida).toBe(false);
      expect(tarefa.data).toBe('2023-10-10');
    });
  });

  describe('seletores', () => {
    beforeEach(() => {
      // Arrange - configurar algumas tarefas para testar os seletores
      useTarefasStore.setState({
        tarefas: [
          {
            id: 'tarefa-1', 
            texto: 'Tarefa Estudos', 
            categoria: 'estudos', 
            concluida: false,
            data: '2023-10-10', // data atual mockada
            prioridade: 'alta',
            criado_em: new Date().toISOString()
          },
          {
            id: 'tarefa-2', 
            texto: 'Tarefa Saúde', 
            categoria: 'saude', 
            concluida: true,
            data: '2023-10-10', // data atual mockada
            prioridade: 'media',
            criado_em: new Date().toISOString()
          },
          {
            id: 'tarefa-3', 
            texto: 'Tarefa Passada', 
            categoria: 'estudos', 
            concluida: false,
            data: '2023-10-09', // data anterior
            prioridade: 'baixa',
            criado_em: new Date().toISOString()
          }
        ]
      });
    });

    it('getTarefasHoje - deve retornar apenas tarefas de hoje', () => {
      // Act
      const tarefasHoje = useTarefasStore.getState().getTarefasHoje();
      
      // Assert
      expect(tarefasHoje.length).toBe(2);
      expect(tarefasHoje.map(t => t.id)).toEqual(['tarefa-1', 'tarefa-2']);
    });

    it('getTarefasPorCategoria - deve filtrar tarefas por categoria', () => {
      // Act
      const tarefasEstudos = useTarefasStore.getState().getTarefasPorCategoria('estudos');
      
      // Assert
      expect(tarefasEstudos.length).toBe(2);
      expect(tarefasEstudos.map(t => t.id)).toEqual(['tarefa-1', 'tarefa-3']);
    });

    it('getTarefasPendentes - deve retornar apenas tarefas não concluídas', () => {
      // Act
      const tarefasPendentes = useTarefasStore.getState().getTarefasPendentes();
      
      // Assert
      expect(tarefasPendentes.length).toBe(2);
      expect(tarefasPendentes.map(t => t.id)).toEqual(['tarefa-1', 'tarefa-3']);
    });
  });
}); 