import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Inicializa o app
initializeApp();

// Interface para dados do usuário
interface UserData {
  sleepGoal?: number;
  waterGoal?: number;
  focusGoal?: number;
  breakGoal?: number;
}

// Função para sincronizar metas diárias
export const syncDailyGoals = onSchedule({
  schedule: '0 0 * * *',
  timeZone: 'America/Sao_Paulo',
  retryCount: 3,
  memory: '256MiB'
}, async () => {
  const db = getFirestore();
  
  try {
    // Busca todos os usuários com metas configuradas
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const batch = db.batch();
    const today = new Date().toISOString().split('T')[0];
    
    snapshot.docs.forEach(doc => {
      const userData = doc.data() as UserData;
      const dailyGoalRef = db.collection('dailyGoals').doc(`${doc.id}_${today}`);
      
      batch.set(dailyGoalRef, {
        userId: doc.id,
        date: FieldValue.serverTimestamp(),
        sleepGoal: userData.sleepGoal ?? 8,
        waterGoal: userData.waterGoal ?? 2000,
        focusGoal: userData.focusGoal ?? 4,
        breakGoal: userData.breakGoal ?? 15,
        completed: false
      });
    });
    
    await batch.commit();
    console.log(`Metas diárias sincronizadas com sucesso para ${snapshot.size} usuários`);
  } catch (error) {
    console.error('Erro ao sincronizar metas diárias:', error);
    throw error; // Permite retry automático
  }
});

// Interface para metadados do arquivo
interface FileMetadata {
  name?: string;
  contentType?: string;
  size?: number;
  metadata?: Record<string, string>;
}

// Função para processar upload de arquivos
export const processFileUpload = onObjectFinalized('*', async (event) => {
  const { name: filePath, contentType, size, metadata } = event.data as FileMetadata;
  const userId = filePath?.split('/')[1];
  
  if (!filePath || !userId) {
    console.log('Arquivo ignorado: caminho ou usuário inválido');
    return;
  }
  
  try {
    const db = getFirestore();
    
    await db.collection('files').add({
      userId,
      filePath,
      type: contentType,
      size,
      createdAt: FieldValue.serverTimestamp(),
      metadata
    });
    
    console.log('Arquivo processado com sucesso:', filePath);
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    throw error; // Permite retry automático
  }
});
