import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useTranslation } from '@/hooks/useTranslation';
import { Country } from '@/types';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

export const CountryCard: React.FC<CountryCardProps> = ({ 
  country, 
  onSelect, 
  disabled = false 
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (!disabled && country.available > 0) {
      onSelect(country);
    }
  };

  return (
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 cursor-pointer
        ${disabled || country.available === 0 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg hover:scale-105 hover:shadow-primary/20'
        }
        ${country.available > 0 ? 'animate-scale-in' : ''}
        glass backdrop-blur-md border-white/20
      `}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl country-flag animate-bounce-in">
              {country.flag}
            </span>
            <div>
              <h3 className="font-semibold text-lg">{country.name}</h3>
              <p className="text-sm text-muted-foreground">
                {country.phonePrefix}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">
              ${country.price}
            </div>
            <Badge 
              variant={country.available > 0 ? "default" : "destructive"}
              className="mt-1"
            >
              {country.available > 0 
                ? `${country.available} ${t('countries.available')}`
                : t('countries.noAccounts')
              }
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            {country.available === 0 && (
              <>
                <AlertCircle className="w-4 h-4 mr-1 text-destructive" />
                <span>{t('countries.noAccounts')}</span>
              </>
            )}
          </div>
          
          {country.available > 0 && (
            <AnimatedButton
              variant="primary"
              size="sm"
              animation="glow"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('menu.buySingle')}
            </AnimatedButton>
          )}
        </div>
      </CardContent>
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
};