import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AnimatedButton } from '@/components/AnimatedButton';
import { MessageCircle, Settings, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              {t('app.title')}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {t('nav.home')}
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.accounts')}
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.settings')}
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center space-x-2 ml-4">
            <AnimatedButton variant="outline" size="sm" animation="scale">
              <Settings className="w-4 h-4 mr-2" />
              {t('nav.settings')}
            </AnimatedButton>
            
            <AnimatedButton variant="primary" size="sm" animation="glow">
              <User className="w-4 h-4 mr-2" />
              {t('nav.profile')}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </header>
  );
};