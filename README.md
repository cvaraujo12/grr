# Painel ND - Next.js com Firebase

Aplicação para gerenciamento de tarefas e organização pessoal, projetada especificamente para pessoas neurodivergentes, utilizando Next.js e Firebase.

## Estrutura do Projeto

```
app/
├── auth/              # Páginas de autenticação (login, signup)
├── components/        # Componentes reutilizáveis
├── contexts/          # Contextos React (AuthContext)
├── hooks/             # Hooks personalizados
├── lib/               # Utilitários e configurações
│   ├── firebase.ts    # Configuração do Firebase
│   └── stores/        # Stores Zustand organizados por domínio
├── providers/         # Providers para a aplicação
├── [feature]/         # Páginas organizadas por funcionalidade
└── types/             # Definições de tipos TypeScript
```

## Integração com Firebase

### Autenticação

O sistema utiliza Firebase Authentication para gerenciar usuários:
- Email/senha
- Google OAuth

Para gerenciar a autenticação, usamos:
- `AuthContext.tsx`: Gerencia o estado de autenticação e tokens
- `middleware.ts`: Protege rotas com base no estado de autenticação

### Armazenamento de Dados

Utilizamos Firestore para armazenar dados dos usuários:
- Cada usuário tem documentos específicos em coleções organizadas por domínio
- A sincronização é feita através do hook `useFirebaseSync`

### Configuração

Para configurar o Firebase em desenvolvimento:
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Copie o arquivo `.env.example` para `.env.local`
3. Preencha as variáveis de ambiente com os dados do seu projeto

## Executando o Projeto

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Emuladores Firebase

Para desenvolvimento local com emuladores Firebase:

```bash
# Iniciar emuladores
firebase emulators:start
```

### Deploy

Para fazer deploy da aplicação:

```bash
# Build e deploy
npm run deploy
```

## Padrões de Desenvolvimento

### Gerenciamento de Estado

- Utilizamos Zustand para gerenciamento de estado
- Cada domínio tem seu próprio store em `app/lib/stores/`
- A sincronização com o Firebase é feita via `useFirebaseSync`

### Componentes

- Componentes seguem o padrão atômico
- Utilizamos ARIA e foco em acessibilidade
- Estilização via Tailwind CSS

### Rotas e Navegação

- Rotas protegidas via middleware
- Armazenamento do último caminho para redirecionamento após login

## Solução de Problemas

### Autenticação

- Verificar variáveis de ambiente do Firebase
- Limpar cookies e localStorage em caso de problemas persistentes
- Verificar regras de segurança do Firestore

### Dados

- Verificar console para erros de sincronização
- Verificar regras de acesso ao Firestore
- Usar emuladores para desenvolvimento local seguro
