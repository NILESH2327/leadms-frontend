import React, { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export const AppProviders = ({ children }) => {
  const { theme } = useUIStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};
