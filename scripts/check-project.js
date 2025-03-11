#!/usr/bin/env node

/**
 * Script para verificar a integridade do projeto
 * Verifica arquivos importantes, dependências e configurações
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Cores para saída no console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Estrutura esperada de diretórios e arquivos críticos
const expectedStructure = [
  'app/lib/firebase.ts',
  'app/contexts/AuthContext.tsx',
  'app/auth/login/page.tsx',
  'app/auth/signup/page.tsx',
  'app/hooks/useFirebaseSync.ts',
  'app/middleware.ts',
  '.env.local',
  'firebase.json',
  'firestore.rules'
];

// Dependências essenciais
const criticalDependencies = [
  'next', 
  'react', 
  'react-dom', 
  'firebase',
  'zod',
  'zustand'
];

// Função para verificar arquivos críticos
async function checkCriticalFiles() {
  console.log(`${colors.blue}Verificando arquivos críticos...${colors.reset}`);
  
  const missingFiles = [];
  
  for (const file of expectedStructure) {
    try {
      await stat(path.join(process.cwd(), file));
      console.log(`${colors.green}✓ ${file}${colors.reset}`);
    } catch (error) {
      missingFiles.push(file);
      console.log(`${colors.red}✗ ${file} (não encontrado)${colors.reset}`);
    }
  }
  
  return missingFiles;
}

// Verificar as variáveis de ambiente do Firebase
async function checkEnvVariables() {
  console.log(`\n${colors.blue}Verificando variáveis de ambiente...${colors.reset}`);
  
  const envFile = path.join(process.cwd(), '.env.local');
  let envContent;
  
  try {
    envContent = await readFile(envFile, 'utf8');
  } catch (error) {
    console.log(`${colors.red}✗ Arquivo .env.local não encontrado${colors.reset}`);
    return false;
  }
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingVars = [];
  const invalidVars = [];
  
  for (const envVar of requiredEnvVars) {
    const regex = new RegExp(`^${envVar}=(.+)$`, 'm');
    const match = envContent.match(regex);
    
    if (!match) {
      missingVars.push(envVar);
      console.log(`${colors.red}✗ ${envVar} (ausente)${colors.reset}`);
      continue;
    }
    
    const value = match[1];
    
    // Verificação específica para API_KEY (deve começar com AIza)
    if (envVar === 'NEXT_PUBLIC_FIREBASE_API_KEY' && !value.startsWith('AIza')) {
      invalidVars.push(envVar);
      console.log(`${colors.yellow}⚠ ${envVar} (formato inválido: ${value})${colors.reset}`);
      continue;
    }
    
    if (value.includes('your_') || value === '') {
      invalidVars.push(envVar);
      console.log(`${colors.yellow}⚠ ${envVar} (placeholder: ${value})${colors.reset}`);
      continue;
    }
    
    console.log(`${colors.green}✓ ${envVar}${colors.reset}`);
  }
  
  return missingVars.length === 0 && invalidVars.length === 0;
}

// Verificar dependências
async function checkDependencies() {
  console.log(`\n${colors.blue}Verificando dependências...${colors.reset}`);
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  let packageJson;
  
  try {
    packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  } catch (error) {
    console.log(`${colors.red}✗ Arquivo package.json não encontrado${colors.reset}`);
    return false;
  }
  
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const missingDeps = [];
  
  for (const dep of criticalDependencies) {
    if (!dependencies[dep]) {
      missingDeps.push(dep);
      console.log(`${colors.red}✗ ${dep} (não instalado)${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ ${dep} (${dependencies[dep]})${colors.reset}`);
    }
  }
  
  return missingDeps.length === 0;
}

// Verificar a configuração do Firebase
async function checkFirebaseConfig() {
  console.log(`\n${colors.blue}Verificando configuração do Firebase...${colors.reset}`);
  
  const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
  let firebaseJson;
  
  try {
    firebaseJson = JSON.parse(await readFile(firebaseJsonPath, 'utf8'));
  } catch (error) {
    console.log(`${colors.red}✗ Arquivo firebase.json não encontrado${colors.reset}`);
    return false;
  }
  
  // Verificar configurações críticas
  let hasIssues = false;
  
  if (!firebaseJson.hosting) {
    console.log(`${colors.red}✗ Configuração de hosting ausente${colors.reset}`);
    hasIssues = true;
  } else {
    console.log(`${colors.green}✓ Configuração de hosting presente${colors.reset}`);
  }
  
  if (!firebaseJson.firestore) {
    console.log(`${colors.red}✗ Configuração do Firestore ausente${colors.reset}`);
    hasIssues = true;
  } else {
    console.log(`${colors.green}✓ Configuração do Firestore presente${colors.reset}`);
  }
  
  // Verificar se usa função nextServer
  const hasNextServerFunction = 
    firebaseJson.hosting && 
    firebaseJson.hosting.rewrites && 
    firebaseJson.hosting.rewrites.some(
      rule => rule.function === "nextServer"
    );
  
  if (!hasNextServerFunction) {
    console.log(`${colors.yellow}⚠ Configuração não está usando nextServer para SSR${colors.reset}`);
    hasIssues = true;
  } else {
    console.log(`${colors.green}✓ Configuração usa nextServer para SSR${colors.reset}`);
  }
  
  return !hasIssues;
}

// Verificar a integridade dos imports
async function checkImports() {
  console.log(`\n${colors.blue}Verificando importações de stores...${colors.reset}`);
  
  try {
    console.log(`${colors.cyan}Executando grep para encontrar importações antigas...${colors.reset}`);
    const command = 'grep -r --include="*.tsx" --include="*.ts" "from \'\\.\\.\/store" ./app';
    
    try {
      const output = execSync(command, { encoding: 'utf8' });
      console.log(`${colors.yellow}⚠ Encontradas importações antigas:${colors.reset}`);
      console.log(output);
      return false;
    } catch (error) {
      // Se o grep não encontrar nada, retorna código 1
      if (error.status === 1 && !error.stdout) {
        console.log(`${colors.green}✓ Não foram encontradas importações antigas${colors.reset}`);
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Erro ao verificar importações: ${error.message}${colors.reset}`);
    return false;
  }
}

// Função principal
async function main() {
  console.log(`${colors.magenta}=== Verificação de Integridade do Projeto ===${colors.reset}\n`);
  
  // Armazenar resultados
  const results = {
    criticalFiles: await checkCriticalFiles(),
    envVariables: await checkEnvVariables(),
    dependencies: await checkDependencies(),
    firebaseConfig: await checkFirebaseConfig(),
    imports: await checkImports()
  };
  
  // Resumo final
  console.log(`\n${colors.magenta}=== Resumo da Verificação ===${colors.reset}`);
  
  const allPassed = Object.values(results).every(result => 
    result === true || (Array.isArray(result) && result.length === 0)
  );
  
  if (allPassed) {
    console.log(`${colors.green}✓ Todas as verificações passaram com sucesso!${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Foram encontrados problemas que precisam ser corrigidos${colors.reset}`);
    
    if (Array.isArray(results.criticalFiles) && results.criticalFiles.length > 0) {
      console.log(`${colors.red}  - Arquivos críticos ausentes: ${results.criticalFiles.length}${colors.reset}`);
    }
    
    if (results.envVariables === false) {
      console.log(`${colors.red}  - Problemas com variáveis de ambiente${colors.reset}`);
    }
    
    if (results.dependencies === false) {
      console.log(`${colors.red}  - Dependências ausentes${colors.reset}`);
    }
    
    if (results.firebaseConfig === false) {
      console.log(`${colors.red}  - Problemas na configuração do Firebase${colors.reset}`);
    }
    
    if (results.imports === false) {
      console.log(`${colors.red}  - Importações desatualizadas encontradas${colors.reset}`);
    }
  }
}

// Executar
main().catch(error => {
  console.error(`${colors.red}Erro ao executar verificação: ${error.message}${colors.reset}`);
  process.exit(1);
}); 