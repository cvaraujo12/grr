import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Validação completa das variáveis de ambiente do Firebase
 * Fornece feedback detalhado e sugestões para resolução de problemas
 */
const validateEnvVariables = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );
  
  const invalidEnvVars = [];
  const suggestions = [];
  
  // Verificações específicas de formato
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')) {
      invalidEnvVars.push(`NEXT_PUBLIC_FIREBASE_API_KEY (formato inválido: deve começar com 'AIza')`);
      suggestions.push('Verifique se você copiou corretamente a API Key do console do Firebase');
    }
  }
  
  if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.endsWith('.firebaseapp.com')) {
      invalidEnvVars.push(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (formato inválido: deve terminar com '.firebaseapp.com')`);
      suggestions.push('O Auth Domain geralmente segue o formato: seu-projeto-id.firebaseapp.com');
    }
  }
  
  if (process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
    if (!/^1:\d+:web:[a-zA-Z0-9]+$/.test(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)) {
      invalidEnvVars.push(`NEXT_PUBLIC_FIREBASE_APP_ID (formato inválido: deve seguir o padrão '1:number:web:id')`);
      suggestions.push('Verifique o App ID nas configurações da Web App no console do Firebase');
    }
  }

  // Verificação de Messaging Sender ID (deve ser apenas números)
  if (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
    if (!/^\d+$/.test(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)) {
      invalidEnvVars.push(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (formato inválido: deve conter apenas números)`);
      suggestions.push('O Messaging Sender ID deve ser um número encontrado nas configurações do Firebase');
    }
  }
  
  // Se existem variáveis ausentes ou inválidas, lança um erro detalhado com sugestões
  if (missingEnvVars.length > 0 || invalidEnvVars.length > 0) {
    let errorMessage = '⛔ Erro na configuração do Firebase:\n\n';
    
    if (missingEnvVars.length > 0) {
      errorMessage += `🔍 Variáveis de ambiente ausentes:\n  ${missingEnvVars.join('\n  ')}\n\n`;
      errorMessage += `💡 Sugestão: Copie o arquivo .env.local.example para .env.local e preencha as variáveis.\n`;
      errorMessage += `   Você pode encontrar essas informações no console do Firebase (https://console.firebase.google.com).\n\n`;
    }
    
    if (invalidEnvVars.length > 0) {
      errorMessage += `🚫 Variáveis de ambiente com formato inválido:\n  ${invalidEnvVars.join('\n  ')}\n\n`;
      errorMessage += `💡 Sugestões para correção:\n  • ${suggestions.join('\n  • ')}\n\n`;
    }
    
    errorMessage += `📝 Para mais informações, consulte a documentação do Firebase: https://firebase.google.com/docs/web/setup\n`;
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Se chegou aqui, todas as variáveis estão corretas
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Configuração do Firebase validada com sucesso!');
  }
};

// Validar variáveis antes de inicializar
validateEnvVariables();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase apenas uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
