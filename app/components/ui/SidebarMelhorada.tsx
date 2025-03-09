'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Home, Menu, X } from 'lucide-react';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';

// Tipos para os itens de menu
interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  description?: string;
}

interface SidebarProps {
  items: MenuItem[];
  className?: string;
}

export const SidebarMelhorada = ({
  items,
  className = '',
}: SidebarProps) => {
  const pathname = usePathname();
  const { highContrast, largerText, reduceMotion } = useUIPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Controla a expansão/colapso de grupos de menu
  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Verifica se um item está na rota atual
  const isActive = (href: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Classes condicionais baseadas nas preferências do usuário
  const getMainContainerClasses = () => {
    return `${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    fixed top-0 left-0 z-40 h-screen transition-transform 
    ${reduceMotion ? 'transition-none' : 'duration-300 ease-in-out'}
    p-4 overflow-y-auto bg-white w-64 dark:bg-gray-800 
    ${highContrast ? 'border-r-2 border-black dark:border-white' : 'border-r border-gray-200 dark:border-gray-700'}
    md:translate-x-0 
    ${className}`;
  };

  const getItemClasses = (isItemActive: boolean, hasChildren: boolean) => {
    const baseClasses = `flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors 
      ${largerText ? 'text-base' : 'text-sm'} 
      ${reduceMotion ? 'transition-none' : 'duration-200'}`;
    
    if (isItemActive) {
      return `${baseClasses} ${highContrast 
        ? 'bg-black text-white dark:bg-white dark:text-black' 
        : 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'}`;
    }
    
    return `${baseClasses} ${highContrast 
      ? 'text-black hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700' 
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
      ${hasChildren ? 'justify-between' : ''}`;
  };

  // Renderiza um único item do menu
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = Boolean(item.items?.length);
    const isItemActive = item.href ? isActive(item.href) : false;
    const isExpanded = expandedGroups[item.id];
    
    const paddingLeft = depth > 0 ? `pl-${(depth + 1) * 2}` : '';
    
    return (
      <li key={item.id}>
        {item.href && !hasChildren ? (
          <Link 
            href={item.href}
            className={`${getItemClasses(isItemActive, hasChildren)} ${paddingLeft}`}
            aria-current={isItemActive ? 'page' : undefined}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ) : (
          <button 
            type="button"
            onClick={() => toggleGroup(item.id)}
            className={`${getItemClasses(false, hasChildren)} ${paddingLeft}`}
            aria-expanded={isExpanded}
          >
            <span className="flex items-center">
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
            {hasChildren && (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>
        )}
        
        {hasChildren && isExpanded && (
          <ul className={`mt-1 space-y-1 ${reduceMotion ? '' : 'animate-fadeIn'}`}>
            {item.items?.map(subItem => renderMenuItem(subItem, depth + 1))}
          </ul>
        )}
        
        {/* Descrição opcional para itens - ajuda contextual */}
        {item.description && isExpanded && (
          <p className={`mt-1 ${paddingLeft} text-xs text-gray-500 dark:text-gray-400 ml-8`}>
            {item.description}
          </p>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Botão de toggle para mobile */}
      <button 
        type="button"
        className="fixed top-4 left-4 z-50 p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Overlay de fundo quando o menu está aberto em dispositivos móveis */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar principal */}
      <aside className={getMainContainerClasses()}>
        <nav aria-label="Navegação principal">
          <ul className="space-y-2">
            {items.map(item => renderMenuItem(item))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarMelhorada; 