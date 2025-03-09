import { useConfigStore } from '@/app/store/modules/configStore';

describe('ConfigStore', () => {
  // Antes de cada teste, limpa o estado da store
  beforeEach(() => {
    useConfigStore.setState({
      configuracao: {
        tempoFoco: 25,
        tempoPausa: 5,
        temaEscuro: false,
        reducaoEstimulos: false,
        notificacoesAtivas: true,
        intervalosNotificacaoHidratacao: 60,
      }
    });
  });

  describe('atualizarConfiguracao', () => {
    it('deve atualizar múltiplas configurações de uma vez', () => {
      // Act
      useConfigStore.getState().atualizarConfiguracao({
        tempoFoco: 30,
        tempoPausa: 10,
        temaEscuro: true
      });
      
      // Assert
      const config = useConfigStore.getState().configuracao;
      expect(config.tempoFoco).toBe(30);
      expect(config.tempoPausa).toBe(10);
      expect(config.temaEscuro).toBe(true);
      
      // Verifica que outros campos permanecem inalterados
      expect(config.reducaoEstimulos).toBe(false);
      expect(config.notificacoesAtivas).toBe(true);
    });
  });

  describe('toggleTemaEscuro', () => {
    it('deve alternar o tema entre claro e escuro', () => {
      // Act - Ativar tema escuro
      useConfigStore.getState().toggleTemaEscuro();
      
      // Assert
      expect(useConfigStore.getState().configuracao.temaEscuro).toBe(true);
      
      // Act - Desativar tema escuro
      useConfigStore.getState().toggleTemaEscuro();
      
      // Assert
      expect(useConfigStore.getState().configuracao.temaEscuro).toBe(false);
    });
  });

  describe('toggleReducaoEstimulos', () => {
    it('deve alternar o modo de redução de estímulos', () => {
      // Act - Ativar redução
      useConfigStore.getState().toggleReducaoEstimulos();
      
      // Assert
      expect(useConfigStore.getState().configuracao.reducaoEstimulos).toBe(true);
      
      // Act - Desativar redução
      useConfigStore.getState().toggleReducaoEstimulos();
      
      // Assert
      expect(useConfigStore.getState().configuracao.reducaoEstimulos).toBe(false);
    });
  });

  describe('toggleNotificacoes', () => {
    it('deve alternar o estado das notificações', () => {
      // Act - Desativar notificações
      useConfigStore.getState().toggleNotificacoes();
      
      // Assert
      expect(useConfigStore.getState().configuracao.notificacoesAtivas).toBe(false);
      
      // Act - Reativar notificações
      useConfigStore.getState().toggleNotificacoes();
      
      // Assert
      expect(useConfigStore.getState().configuracao.notificacoesAtivas).toBe(true);
    });
  });

  describe('configurações de tempo', () => {
    it('definirTempoFoco deve atualizar o tempo de foco', () => {
      // Act
      useConfigStore.getState().definirTempoFoco(45);
      
      // Assert
      expect(useConfigStore.getState().configuracao.tempoFoco).toBe(45);
    });

    it('definirTempoPausa deve atualizar o tempo de pausa', () => {
      // Act
      useConfigStore.getState().definirTempoPausa(8);
      
      // Assert
      expect(useConfigStore.getState().configuracao.tempoPausa).toBe(8);
    });

    it('definirIntervaloHidratacao deve atualizar o intervalo de notificações', () => {
      // Act
      useConfigStore.getState().definirIntervaloHidratacao(30);
      
      // Assert
      expect(useConfigStore.getState().configuracao.intervalosNotificacaoHidratacao).toBe(30);
    });
  });
}); 