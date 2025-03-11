#!/usr/bin/env node

/**
 * Script para atualizar importações de stores nas páginas e componentes
 * Este script busca por padrões de importação antigos e os substitui
 * pelos novos caminhos após a reorganização dos stores
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Diretório raiz do projeto
const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'app');

// Extensões de arquivo a serem processadas
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// Padrões de importação a serem atualizados
const importPatterns = [
  {
    from: /from ['"]@\/app\/store(s)?\/([^'"]+)['"]/g,
    to: "from '@/app/lib/stores/$2'"
  },
  {
    from: /from ['"]@\/app\/(store|stores)['"]\/?\)?/g,
    to: "from '@/app/lib/stores'"
  },
  {
    from: /from ['"]\.\.\/\.\.\/store(s)?\/([^'"]+)['"]/g,
    to: "from '../../lib/stores/$2'"
  },
  {
    from: /from ['"]\.\.\/store(s)?\/([^'"]+)['"]/g,
    to: "from '../lib/stores/$2'"
  },
  {
    from: /from ['"]\.\/store(s)?\/([^'"]+)['"]/g,
    to: "from './lib/stores/$2'"
  }
];

// Função para verificar se um arquivo deve ser processado
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return extensions.includes(ext);
};

// Função para processar um arquivo
const processFile = async (filePath) => {
  try {
    // Ler o conteúdo do arquivo
    const content = await readFile(filePath, 'utf8');
    
    // Aplicar substituições
    let updatedContent = content;
    let hasChanged = false;
    
    importPatterns.forEach(pattern => {
      const newContent = updatedContent.replace(pattern.from, pattern.to);
      if (newContent !== updatedContent) {
        updatedContent = newContent;
        hasChanged = true;
      }
    });
    
    // Se houve mudanças, salvar o arquivo
    if (hasChanged) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Atualizado: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error);
    return 0;
  }
};

// Função para percorrer diretórios recursivamente
const walkDir = async (dir) => {
  let updatedCount = 0;
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      // Ignorar node_modules e outros diretórios de build
      if (entry === 'node_modules' || entry === '.next' || entry === '.git') {
        continue;
      }
      
      const fullPath = path.join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recursivamente processar subdiretórios
        updatedCount += await walkDir(fullPath);
      } else if (stats.isFile() && shouldProcessFile(fullPath)) {
        // Processar arquivo individual
        updatedCount += await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao listar diretório ${dir}:`, error);
  }
  
  return updatedCount;
};

// Função principal
const main = async () => {
  console.log('🔄 Iniciando atualização de importações...');
  
  try {
    const updatedCount = await walkDir(appDir);
    console.log(`✅ Concluído! ${updatedCount} arquivos foram atualizados.`);
  } catch (error) {
    console.error('❌ Erro durante a execução:', error);
    process.exit(1);
  }
};

// Executar script
main(); 