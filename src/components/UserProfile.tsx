import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { User } from '@/types';
import { User as UserIcon, Wallet, ShoppingCart, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: User;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, className }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);

  return (
    <Card className={`glass backdrop-blur-md border-white/20 animate-scale-in ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`} />
            <AvatarFallback className="bg-gradient-primary text-white text-lg">
              {user.firstName[0]}{user.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl gradient-text">{user.firstName} {user.lastName}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">ID: {user.telegramId}</span>
            </div>
            {user.username && (
              <Badge variant="outline" className="mt-2">
                @{user.username}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-card">
            <div className="p-2 bg-success/10 rounded-lg">
              <Wallet className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('user.balance')}</p>
              <p className="text-lg font-semibold text-success">{formatCurrency(user.balance)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-card">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('user.purchases')}</p>
              <p className="text-lg font-semibold">{user.totalPurchases}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-card">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('user.memberSince')}</p>
              <p className="text-lg font-semibold">{formatDate(user.joinedAt)}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('user.spent')}</span>
            <span className="text-lg font-semibold">{formatCurrency(user.totalSpent)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};