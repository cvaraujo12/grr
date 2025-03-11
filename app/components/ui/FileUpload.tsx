'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { storageUtils } from '@/app/lib/storage';

interface FileUploadProps {
  folder: string;
  onUploadComplete?: (result: { url: string; path: string }) => void;
  onError?: (error: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // em bytes
}

export function FileUpload({
  folder,
  onUploadComplete,
  onError,
  acceptedTypes = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB padrão
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.match(acceptedTypes)) {
      return 'Tipo de arquivo não permitido';
    }
    if (file.size > maxSize) {
      return `Arquivo muito grande. Máximo permitido: ${maxSize / 1024 / 1024}MB`;
    }
    return null;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setStatus('error');
      setStatusMessage(error);
      onError?.(error);
      return;
    }

    try {
      setIsUploading(true);
      setStatus('idle');
      setStatusMessage('Enviando arquivo...');

      if (!user) throw new Error('Usuário não autenticado');

      const result = await storageUtils.uploadFile(file, user.uid, folder);
      
      setStatus('success');
      setStatusMessage('Arquivo enviado com sucesso!');
      onUploadComplete?.(result);
    } catch (error: any) {
      setStatus('error');
      setStatusMessage(error.message);
      onError?.(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${status === 'error' ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={handleButtonClick}
        onKeyPress={(e) => e.key === 'Enter' && handleButtonClick()}
        aria-label="Área de upload de arquivo"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={acceptedTypes}
          aria-label="Selecionar arquivo"
        />

        <div className="flex flex-col items-center gap-2">
          {status === 'idle' && !isUploading && (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                Arraste um arquivo ou clique para selecionar
              </p>
            </>
          )}

          {isUploading && (
            <div className="animate-pulse">
              <p className="text-sm text-indigo-500">Enviando arquivo...</p>
            </div>
          )}

          {status === 'success' && !isUploading && (
            <div className="flex items-center gap-2 text-green-500">
              <Check className="w-5 h-5" />
              <p className="text-sm">{statusMessage}</p>
            </div>
          )}

          {status === 'error' && !isUploading && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{statusMessage}</p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500 text-center">
        Tamanho máximo: {maxSize / 1024 / 1024}MB. 
        Tipos permitidos: {acceptedTypes.replace('/*', '')}
      </p>
    </div>
  );
}
