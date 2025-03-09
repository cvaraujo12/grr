'use client';

import React, { useState } from 'react';
import { Home, Users, Settings, FileText, Folder, Calendar, BarChart2, Activity } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import SidebarMelhorada from '@/app/components/ui/SidebarMelhorada';
import { ContentGrid, ContentCard } from '@/app/components/ui/ContentGrid';
import ContentBox from '@/app/components/ui/ContentBox';
import FormField from '@/app/components/ui/FormField';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';

const ComponentesV2Page = () => {
  const { toggleHighContrast, toggleLargerText, toggleDenseContent, highContrast, largerText, denseContent } = useUIPreferences();
  const [formValues, setFormValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
  });

  // Dados de exemplo para o Breadcrumbs
  const breadcrumbItems = [
    { label: 'Início', href: '/', icon: <Home size={16} /> },
    { label: 'UI Melhorias', href: '/ui-melhorias' },
    { label: 'Componentes V2', href: '/ui-melhorias/componentes-v2', current: true },
  ];

  // Dados de exemplo para o Sidebar
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home size={18} />,
    },
    {
      id: 'usuarios',
      label: 'Usuários',
      icon: <Users size={18} />,
      items: [
        { id: 'lista-usuarios', label: 'Lista de Usuários', href: '/usuarios/lista' },
        { id: 'perfis', label: 'Perfis', href: '/usuarios/perfis' },
        { id: 'permissoes', label: 'Permissões', href: '/usuarios/permissoes' },
      ],
      description: 'Gerenciamento de usuários, perfis e permissões'
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: <FileText size={18} />,
      items: [
        { id: 'relatorios-diarios', label: 'Diários', href: '/relatorios/diarios' },
        { id: 'relatorios-semanais', label: 'Semanais', href: '/relatorios/semanais' },
        { id: 'relatorios-mensais', label: 'Mensais', href: '/relatorios/mensais' },
      ],
      description: 'Relatórios e análises de desempenho'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      href: '/configuracoes',
      icon: <Settings size={18} />,
    },
  ];

  // Regras de validação para os campos
  const emailRules = [
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Email inválido',
    },
  ];

  const senhaRules = [
    {
      test: (value: string) => value.length >= 8,
      message: 'A senha deve ter pelo menos 8 caracteres',
    },
    {
      test: (value: string) => /[A-Z]/.test(value),
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    },
    {
      test: (value: string) => /[0-9]/.test(value),
      message: 'A senha deve conter pelo menos um número',
    },
  ];

  const telefoneRules = [
    {
      test: (value: string) => /^\(?[0-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/.test(value),
      message: 'Telefone inválido (ex: (99) 99999-9999)',
    },
  ];

  // Handler para atualizar os valores do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className={`${largerText ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 dark:text-white`}>
          Demonstração de Componentes V2
        </h1>
        <div className="mt-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <SidebarMelhorada items={menuItems} />
        
        {/* Conteúdo Principal */}
        <main className="flex-grow p-4 md:p-6 ml-0 md:ml-64 bg-gray-50 dark:bg-gray-900">
          {/* Painel de Controle */}
          <ContentBox 
            title="Painel de Controle"
            description="Ajustes de acessibilidade para personalizar a experiência"
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleHighContrast}
                className={`px-4 py-2 rounded-md ${highContrast 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
              </button>
              
              <button
                onClick={toggleLargerText}
                className={`px-4 py-2 rounded-md ${highContrast 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {largerText ? 'Texto Normal' : 'Texto Maior'}
              </button>
              
              <button
                onClick={toggleDenseContent}
                className={`px-4 py-2 rounded-md ${highContrast 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {denseContent ? 'Espaçamento Normal' : 'Conteúdo Compacto'}
              </button>
            </div>
          </ContentBox>
          
          {/* Grid de Cards */}
          <ContentBox 
            title="Grid Responsivo"
            description="Sistema de grid com espaçamento consistente"
            className="mb-6"
          >
            <ContentGrid columns={3} gap="medium">
              <ContentCard 
                title="Estatísticas" 
                subtitle="Resumo de atividades"
                onClick={() => alert('Card Estatísticas clicado')}
              >
                <div className="flex items-center mt-2">
                  <BarChart2 size={24} className="text-purple-500 mr-2" />
                  <span>Visualização de dados simplificada</span>
                </div>
              </ContentCard>
              
              <ContentCard 
                title="Documentos" 
                subtitle="Arquivos recentes"
              >
                <div className="flex items-center mt-2">
                  <Folder size={24} className="text-blue-500 mr-2" />
                  <span>Organização clara de arquivos</span>
                </div>
              </ContentCard>
              
              <ContentCard 
                title="Agenda" 
                subtitle="Próximos eventos"
              >
                <div className="flex items-center mt-2">
                  <Calendar size={24} className="text-green-500 mr-2" />
                  <span>Planejamento visual simplificado</span>
                </div>
              </ContentCard>
              
              <ContentCard 
                title="Progresso" 
                subtitle="Metas e objetivos"
              >
                <div className="flex items-center mt-2">
                  <Activity size={24} className="text-red-500 mr-2" />
                  <span>Acompanhamento visual de metas</span>
                </div>
              </ContentCard>
            </ContentGrid>
          </ContentBox>
          
          {/* Formulário com Validação */}
          <ContentBox 
            title="Formulário com Validação"
            description="Validação em tempo real com feedback visual claro"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Nome Completo"
                name="nome"
                value={formValues.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
                helperText="Por favor, digite seu nome completo"
              />
              
              <FormField 
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                rules={emailRules}
                required
                helperText="Usamos para enviar notificações"
              />
              
              <FormField 
                label="Telefone"
                name="telefone"
                value={formValues.telefone}
                onChange={handleChange}
                placeholder="(99) 99999-9999"
                rules={telefoneRules}
                helperText="Formato: (99) 99999-9999"
              />
              
              <FormField 
                label="Senha"
                name="senha"
                type="password"
                value={formValues.senha}
                onChange={handleChange}
                placeholder="********"
                rules={senhaRules}
                required
                helperText="Mínimo 8 caracteres, 1 letra maiúscula e 1 número"
              />
              
              <div className="md:col-span-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${highContrast 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  Enviar Formulário
                </button>
              </div>
            </form>
          </ContentBox>
        </main>
      </div>
    </div>
  );
};

export default ComponentesV2Page; 