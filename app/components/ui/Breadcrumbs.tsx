'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useUIPreferences } from '@/app/stores/uiPreferencesStore';

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({
  items,
  className = '',
}: BreadcrumbsProps) => {
  const { highContrast, largerText } = useUIPreferences();

  // Aplicar classes condicionais baseadas nas preferências do usuário
  const getContainerClasses = () => {
    return `flex items-center space-x-1 py-2 overflow-x-auto w-full scrollbar-thin 
    ${highContrast ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'} 
    ${largerText ? 'text-base' : 'text-sm'}
    ${className}`;
  };

  const getItemClasses = (item: BreadcrumbItem) => {
    const baseClasses = 'flex items-center transition-colors duration-200';
    const currentClasses = item.current 
      ? `font-semibold ${highContrast ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'}`
      : `${highContrast ? 'hover:text-black dark:hover:text-white' : 'hover:text-gray-900 dark:hover:text-gray-100'}`;
    
    return `${baseClasses} ${currentClasses}`;
  };

  return (
    <nav aria-label="Navegação estrutural" className={getContainerClasses()}>
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className={`mx-1 ${highContrast ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} 
                size={16} 
                aria-hidden="true" 
              />
            )}
            <Link
              href={item.href}
              className={getItemClasses(item)}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.icon && (
                <span className="mr-1" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 