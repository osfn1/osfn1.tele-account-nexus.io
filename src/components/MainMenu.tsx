import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useTranslation } from '@/hooks/useTranslation';
import { User } from '@/types';
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  History,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';

interface MainMenuProps {
  user: User;
  onBuySingle: () => void;
  onBuyBulk: () => void;
  onMyAccounts: () => void;
  onRecharge: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  user,
  onBuySingle,
  onBuyBulk,
  onMyAccounts,
  onRecharge
}) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('menu.buySingle'),
      description: 'Purchase individual accounts with instant delivery',
      icon: ShoppingCart,
      onClick: onBuySingle,
      variant: 'primary' as const,
      animation: 'glow' as const
    },
    {
      title: t('menu.buyBulk'),
      description: 'Buy multiple accounts at discounted rates',
      icon: Package,
      onClick: onBuyBulk,
      variant: 'secondary' as const,
      animation: 'scale' as const
    },
    {
      title: t('menu.myAccounts'),
      description: 'View your purchased accounts and history',
      icon: History,
      onClick: onMyAccounts,
      variant: 'outline' as const,
      animation: 'slide' as const
    },
    {
      title: t('menu.recharge'),
      description: 'Add funds to your account balance',
      icon: CreditCard,
      onClick: onRecharge,
      variant: 'outline' as const,
      animation: 'bounce' as const
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <Card className="glass backdrop-blur-md border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl gradient-text">
            Welcome back, {user.firstName}! 👋
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="p-2 bg-success/20 rounded-lg">
                <Wallet className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('user.balance')}</p>
                <p className="text-xl font-bold text-success">${user.balance.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('user.purchases')}</p>
                <p className="text-xl font-bold">{user.totalPurchases}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telegram ID</p>
                <p className="text-xl font-bold">{user.telegramId}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <Card 
            key={item.title}
            className={`
              group relative overflow-hidden transition-all duration-300 cursor-pointer
              hover:shadow-xl hover:scale-105 glass backdrop-blur-md border-white/20
              animate-slide-in-up
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={item.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`
                  p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${item.variant === 'primary' ? 'bg-primary/10 text-primary' : 
                    item.variant === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    'bg-muted/10 text-foreground'}
                `}>
                  <item.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:gradient-text transition-all">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  
                  <AnimatedButton
                    variant={item.variant}
                    size="sm"
                    animation={item.animation}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Get Started
                  </AnimatedButton>
                </div>
              </div>
            </CardContent>
            
            {/* Animated background */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              ${item.variant === 'primary' ? 'bg-gradient-primary' :
                item.variant === 'secondary' ? 'bg-gradient-secondary' :
                'bg-gradient-to-br from-primary/5 to-secondary/5'}
            `} style={{ mixBlendMode: 'multiply' }} />
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="glass backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold gradient-text">100+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold gradient-text">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-card">
              <div className="text-2xl font-bold gradient-text">5min</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};