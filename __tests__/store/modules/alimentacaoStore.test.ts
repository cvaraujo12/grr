import { useAlimentacaoStore } from '@/app/store/modules/alimentacaoStore';
import { generateId, getCurrentDate, getCurrentTime } from '@/app/store/utils';

// Mock das funções de utilitário
jest.mock('@/app/store/utils', () => ({
  generateId: jest.fn().mockReturnValue('mocked-id'),
  getCurrentDate: jest.fn().mockReturnValue('2023-10-10'),
  getCurrentTime: jest.fn().mockReturnValue('12:30'),
}));

describe('AlimentacaoStore', () => {
  // Antes de cada teste, limpa o estado da store
  beforeEach(() => {
    useAlimentacaoStore.setState({
      refeicoes: [],
      hidratacao: [],
    });
    jest.clearAllMocks();
  });

  describe('Gerenciamento de Refeições', () => {
    it('deve adicionar uma nova refeição com os dados corretos', () => {
      // Act
      useAlimentacaoStore.getState().adicionarRefeicao('Salada com frango grelhado', 'almoco');
      const refeicoes = useAlimentacaoStore.getState().refeicoes;

      // Assert
      expect(refeicoes.length).toBe(1);
      expect(refeicoes[0]).toEqual({
        id: 'mocked-id',
        descricao: 'Salada com frango grelhado',
        categoria: 'almoco',
        data: '2023-10-10',
        hora: '12:30',
        foto: undefined,
      });
    });

    it('deve remover uma refeição existente', () => {
      // Arrange
      useAlimentacaoStore.setState({
        refeicoes: [
          {
            id: 'refeicao-1',
            descricao: 'Café da manhã',
            categoria: 'cafe',
            data: '2023-10-10',
            hora: '08:00',
          },
          {
            id: 'refeicao-2',
            descricao: 'Almoço',
            categoria: 'almoco',
            data: '2023-10-10',
            hora: '12:00',
          }
        ],
        hidratacao: [],
      });

      // Act
      useAlimentacaoStore.getState().removerRefeicao('refeicao-1');
      const refeicoes = useAlimentacaoStore.getState().refeicoes;

      // Assert
      expect(refeicoes.length).toBe(1);
      expect(refeicoes[0].id).toBe('refeicao-2');
    });

    it('deve atualizar os dados de uma refeição existente', () => {
      // Arrange
      useAlimentacaoStore.setState({
        refeicoes: [
          {
            id: 'refeicao-1',
            descricao: 'Descrição antiga',
            categoria: 'cafe',
            data: '2023-10-10',
            hora: '08:00',
          }
        ],
        hidratacao: [],
      });

      // Act
      useAlimentacaoStore.getState().atualizarRefeicao('refeicao-1', {
        descricao: 'Nova descrição',
        categoria: 'jantar',
        foto: 'nova-foto.jpg'
      });
      
      const refeicao = useAlimentacaoStore.getState().refeicoes[0];
      
      // Assert
      expect(refeicao.descricao).toBe('Nova descrição');
      expect(refeicao.categoria).toBe('jantar');
      expect(refeicao.foto).toBe('nova-foto.jpg');
      // Campos não modificados permanecem iguais
      expect(refeicao.data).toBe('2023-10-10');
      expect(refeicao.hora).toBe('08:00');
    });
  });

  describe('Gerenciamento de Hidratação', () => {
    it('deve registrar um copo de água', () => {
      // Act
      useAlimentacaoStore.getState().registrarCopo();
      const hidratacao = useAlimentacaoStore.getState().hidratacao;

      // Assert
      expect(hidratacao.length).toBe(1);
      expect(hidratacao[0]).toEqual({
        id: 'mocked-id',
        data: '2023-10-10',
        quantidadeCopos: 1,
      });
    });

    it('deve aumentar a contagem de copos ao registrar mais de um', () => {
      // Arrange - Primeiro registro
      useAlimentacaoStore.getState().registrarCopo();
      
      // Arrange - Simular nova ID para o segundo registro
      jest.mocked(generateId).mockReturnValueOnce('mocked-id-2');
      
      // Act - Segundo registro
      useAlimentacaoStore.getState().registrarCopo();
      
      // Assert
      expect(useAlimentacaoStore.getState().getCoposHoje()).toBe(2);
    });

    it('deve remover um copo da contagem diária', () => {
      // Arrange - Adicionar dois copos
      useAlimentacaoStore.getState().registrarCopo();
      jest.mocked(generateId).mockReturnValueOnce('mocked-id-2');
      useAlimentacaoStore.getState().registrarCopo();
      
      // Act - Remover um copo
      useAlimentacaoStore.getState().removerCopo();
      
      // Assert
      expect(useAlimentacaoStore.getState().getCoposHoje()).toBe(1);
    });

    it('deve definir a quantidade exata de copos', () => {
      // Act
      useAlimentacaoStore.getState().definirCopos(5);
      
      // Assert
      expect(useAlimentacaoStore.getState().getCoposHoje()).toBe(5);
    });
  });

  describe('Seletores', () => {
    beforeEach(() => {
      // Preparar dados para teste dos seletores
      useAlimentacaoStore.setState({
        refeicoes: [
          {
            id: 'refeicao-1',
            descricao: 'Café da manhã hoje',
            categoria: 'cafe',
            data: '2023-10-10', // data atual mockada
            hora: '08:00',
          },
          {
            id: 'refeicao-2',
            descricao: 'Almoço hoje',
            categoria: 'almoco',
            data: '2023-10-10', // data atual mockada
            hora: '12:00',
          },
          {
            id: 'refeicao-3',
            descricao: 'Jantar ontem',
            categoria: 'jantar',
            data: '2023-10-09', // data anterior
            hora: '20:00',
          }
        ],
        hidratacao: [
          {
            id: 'hidratacao-1',
            data: '2023-10-10', // data atual mockada
            quantidadeCopos: 3,
          },
          {
            id: 'hidratacao-2',
            data: '2023-10-09', // data anterior
            quantidadeCopos: 5,
          }
        ],
      });
    });

    it('getRefeicoesHoje - deve retornar apenas refeições de hoje', () => {
      // Act
      const refeicoesHoje = useAlimentacaoStore.getState().getRefeicoesHoje();
      
      // Assert
      expect(refeicoesHoje.length).toBe(2);
      expect(refeicoesHoje.map(r => r.id)).toEqual(['refeicao-1', 'refeicao-2']);
    });

    it('getRefeicoesData - deve retornar refeições de uma data específica', () => {
      // Act
      const refeicoesOntem = useAlimentacaoStore.getState().getRefeicoesData('2023-10-09');
      
      // Assert
      expect(refeicoesOntem.length).toBe(1);
      expect(refeicoesOntem[0].id).toBe('refeicao-3');
    });

    it('getCoposHoje - deve retornar a quantidade de copos bebidos hoje', () => {
      // Act
      const coposHoje = useAlimentacaoStore.getState().getCoposHoje();
      
      // Assert
      expect(coposHoje).toBe(3);
    });
  });
}); 