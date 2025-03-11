import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

interface UploadResult {
  url: string;
  path: string;
}

export const storageUtils = {
  /**
   * Faz upload de um arquivo para o Storage
   * @param file Arquivo a ser enviado
   * @param userId ID do usuário
   * @param folder Pasta específica (profile, documents, mood)
   * @returns URL do arquivo e caminho no storage
   */
  async uploadFile(file: File, userId: string, folder: string): Promise<UploadResult> {
    try {
      // Gera um nome único para o arquivo
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const path = `users/${userId}/${folder}/${fileName}`;
      
      // Cria a referência e faz o upload
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      
      // Obtém a URL pública
      const url = await getDownloadURL(fileRef);
      
      return { url, path };
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error.message);
      throw new Error('Não foi possível fazer o upload do arquivo. Tente novamente.');
    }
  },

  /**
   * Remove um arquivo do Storage
   * @param path Caminho completo do arquivo no storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (error: any) {
      console.error('Erro ao deletar arquivo:', error.message);
      throw new Error('Não foi possível remover o arquivo. Tente novamente.');
    }
  },

  /**
   * Obtém a URL pública de um arquivo
   * @param path Caminho do arquivo no storage
   * @returns URL pública do arquivo
   */
  async getFileUrl(path: string): Promise<string> {
    try {
      const fileRef = ref(storage, path);
      return await getDownloadURL(fileRef);
    } catch (error: any) {
      console.error('Erro ao obter URL:', error.message);
      throw new Error('Não foi possível obter o link do arquivo. Tente novamente.');
    }
  }
};
