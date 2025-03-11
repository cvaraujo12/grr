import { useEffect, useState } from 'react';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { debounce } from 'lodash';
import { handleError, logError, HandledError } from '../lib/utils/errorHandling';
import { isValidObject } from '../lib/utils/validation';

// Tipo para as opções do hook
interface FirebaseSyncOptions<T> {
  debounceMs?: number;
  syncAllFields?: boolean;
  validateData?: (data: any) => boolean;
  includeFields?: (keyof T)[];
  excludeFields?: (keyof T)[];
  onSyncError?: (error: HandledError) => void;
  onSyncSuccess?: () => void;
}

/**
 * Hook personalizado para sincronizar um store Zustand com o Firestore
 * @param store O store Zustand para sincronizar
 * @param collectionName Nome da coleção no Firestore
 * @param options Opções de configuração para o hook
 */
export const useFirebaseSync = <T extends Record<string, any>>(
  store: any,
  collectionName: string,
  options: FirebaseSyncOptions<T> = {}
) => {
  const [user] = useAuthState(auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncError, setSyncError] = useState<HandledError | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Valores padrão para as opções
  const {
    debounceMs = 1000,
    syncAllFields = false,
    validateData = isValidObject,
    includeFields = [],
    excludeFields = [],
    onSyncError,
    onSyncSuccess
  } = options;

  useEffect(() => {
    if (!user) return;

    // Referência do documento do usuário
    const docRef = doc(db, collectionName, user.uid);

    // Flag para evitar loops de sincronização
    let isSyncingFromFirestore = false;
    
    // Função para lidar com erros
    const handleSyncError = (error: unknown, context: string) => {
      const processedError = handleError(error);
      setSyncError(processedError);
      logError(error, { context, collection: collectionName, userId: user.uid });
      
      if (onSyncError) {
        onSyncError(processedError);
      }
      
      return processedError;
    };

    // Carregar dados iniciais
    const loadInitialData = async () => {
      try {
        setIsSyncing(true);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (validateData(data)) {
            isSyncingFromFirestore = true;
            store.setState(data);
            isSyncingFromFirestore = false;
            setLastSyncTime(new Date());
            
            if (onSyncSuccess) {
              onSyncSuccess();
            }
          } else {
            console.warn(`Dados inválidos recebidos do Firestore (${collectionName})`);
            setSyncError({
              code: 'invalid-data',
              message: `Dados inválidos recebidos da coleção ${collectionName}`,
              severity: 'warning',
              userMessage: 'Alguns dados carregados podem estar incorretos ou incompletos.'
            });
          }
        }
        
        setIsInitialized(true);
        setIsSyncing(false);
      } catch (error) {
        setIsSyncing(false);
        handleSyncError(error, 'load-initial-data');
      }
    };

    // Carregar dados iniciais
    loadInitialData();

    // Sincroniza mudanças do Firestore para o Zustand
    const unsubscribe = onSnapshot(
      docRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (validateData(data)) {
            isSyncingFromFirestore = true;
            store.setState(data);
            isSyncingFromFirestore = false;
            setLastSyncTime(new Date());
            setSyncError(null);
            
            if (onSyncSuccess) {
              onSyncSuccess();
            }
          } else {
            const error = {
              code: 'invalid-data',
              message: `Dados inválidos recebidos durante sincronização da coleção ${collectionName}`,
              severity: 'warning' as const,
              userMessage: 'Alguns dados sincronizados podem estar incorretos ou incompletos.'
            };
            setSyncError(error);
            console.warn(error.message);
          }
        }
      },
      (error) => {
        handleSyncError(error, 'firestore-snapshot-error');
      }
    );

    // Função para filtrar campos a serem sincronizados
    const filterFieldsToSync = (state: T): Partial<T> => {
      if (syncAllFields) {
        return state;
      }
      
      // Filtrar campos baseado nas opções
      return Object.entries(state).reduce((result, [key, value]) => {
        // Ignorar campos privados, funções e campos excluídos explicitamente
        const shouldExclude = 
          key.startsWith('_') || 
          typeof value === 'function' || 
          (excludeFields.length > 0 && excludeFields.includes(key as keyof T));
          
        // Incluir apenas campos específicos se fornecidos
        const shouldInclude = 
          includeFields.length === 0 || 
          includeFields.includes(key as keyof T);
          
        if (!shouldExclude && shouldInclude) {
          result[key as keyof T] = value;
        }
        
        return result;
      }, {} as Partial<T>);
    };

    // Função debounce para enviar atualizações para o Firestore
    const debouncedUpdate = debounce(async (state: T) => {
      if (isSyncingFromFirestore || !isInitialized) return;
      
      try {
        setIsSyncing(true);
        const dataToSync = filterFieldsToSync(state);
              
        await setDoc(docRef, dataToSync, { merge: true });
        setLastSyncTime(new Date());
        setSyncError(null);
        setIsSyncing(false);
        
        if (onSyncSuccess) {
          onSyncSuccess();
        }
      } catch (error) {
        setIsSyncing(false);
        handleSyncError(error, 'save-to-firestore');
      }
    }, debounceMs);

    // Sincroniza mudanças do Zustand para o Firestore
    const unsubscribeStore = store.subscribe((state: T) => {
      debouncedUpdate(state);
    });

    return () => {
      unsubscribe();
      unsubscribeStore();
      debouncedUpdate.cancel();
    };
  }, [
    user, 
    store, 
    collectionName, 
    debounceMs, 
    syncAllFields, 
    validateData, 
    includeFields, 
    excludeFields,
    onSyncError,
    onSyncSuccess
  ]);

  return { 
    isInitialized, 
    syncError, 
    clearError: () => setSyncError(null),
    isSyncing,
    lastSyncTime
  };
};
