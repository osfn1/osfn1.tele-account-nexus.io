import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 relative overflow-hidden group"
    >
      <Sun 
        className={`
          absolute inset-0 m-auto w-5 h-5 transition-all duration-500 transform
          ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}
        `} 
      />
      <Moon 
        className={`
          absolute inset-0 m-auto w-5 h-5 transition-all duration-500 transform
          ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}
        `} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};