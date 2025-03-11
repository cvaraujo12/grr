import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

// Função para lembrar usuários de fazer pausas programadas
export const lembretesPausas = onSchedule("every 1 hours", async (event) => {
  try {
    logger.info("Verificando lembretes de pausas", { timestamp: event.timestamp });
    // Aqui será implementada a lógica de notificação
    // para usuários que ativaram os lembretes
  } catch (error) {
    logger.error("Erro ao processar lembretes de pausas", error);
  }
});

// Função para processar novos registros de sono
export const processarRegistroSono = onDocumentCreated(
  "users/{userId}/sono/{registroId}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) return;

      const dados = snapshot.data();
      logger.info("Novo registro de sono criado", {
        userId: event.params.userId,
        registroId: event.params.registroId,
      });

      // Aqui será implementada a lógica de processamento
      // e análise dos padrões de sono
    } catch (error) {
      logger.error("Erro ao processar registro de sono", error);
    }
  }
);

