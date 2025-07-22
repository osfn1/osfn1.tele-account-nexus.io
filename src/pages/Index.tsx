import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { UserProfile } from '@/components/UserProfile';
import { MainMenu } from '@/components/MainMenu';
import { CountryCard } from '@/components/CountryCard';
import { AccountPurchaseModal } from '@/components/AccountPurchaseModal';
import { MyAccounts } from '@/components/MyAccounts';
import { RechargeSystem } from '@/components/RechargeSystem';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { User, Country } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { AnimatedButton } from '@/components/AnimatedButton';

// Mock data - في التطبيق الحقيقي، ستأتي من قاعدة البيانات
const mockUser: User = {
  id: '1',
  telegramId: '123456789',
  username: 'user_example',
  firstName: 'أحمد',
  lastName: 'محمد',
  language: 'ar',
  theme: 'light',
  balance: 125.50,
  totalPurchases: 15,
  totalSpent: 450.75,
  joinedAt: new Date('2024-01-15')
};

const mockCountries: Country[] = [
  { id: '1', code: 'SA', name: 'السعودية', flag: '🇸🇦', phonePrefix: '+966', price: 2.50, available: 25, isActive: true },
  { id: '2', code: 'US', name: 'United States', flag: '🇺🇸', phonePrefix: '+1', price: 1.80, available: 50, isActive: true },
  { id: '3', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44', price: 2.20, available: 30, isActive: true },
  { id: '4', code: 'DE', name: 'Germany', flag: '🇩🇪', phonePrefix: '+49', price: 2.00, available: 40, isActive: true },
  { id: '5', code: 'FR', name: 'France', flag: '🇫🇷', phonePrefix: '+33', price: 1.90, available: 35, isActive: true },
  { id: '6', code: 'CN', name: '中国', flag: '🇨🇳', phonePrefix: '+86', price: 3.00, available: 20, isActive: true },
  { id: '7', code: 'RU', name: 'Россия', flag: '🇷🇺', phonePrefix: '+7', price: 1.50, available: 45, isActive: true },
  { id: '8', code: 'KR', name: '대한민국', flag: '🇰🇷', phonePrefix: '+82', price: 2.80, available: 15, isActive: true },
  { id: '9', code: 'JP', name: '日本', flag: '🇯🇵', phonePrefix: '+81', price: 3.50, available: 10, isActive: true },
  { id: '10', code: 'AE', name: 'الإمارات', flag: '🇦🇪', phonePrefix: '+971', price: 2.30, available: 28, isActive: true },
  { id: '11', code: 'EG', name: 'مصر', flag: '🇪🇬', phonePrefix: '+20', price: 1.20, available: 60, isActive: true },
  { id: '12', code: 'TR', name: 'Türkiye', flag: '🇹🇷', phonePrefix: '+90', price: 1.40, available: 55, isActive: true }
];

type ViewType = 'main' | 'singlePurchase' | 'bulkPurchase' | 'myAccounts' | 'recharge';

const Index = () => {
  const { t, isRTL } = useTranslation();
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'single' | 'bulk'>('single');
  const [user, setUser] = useState<User>(mockUser);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPurchaseType(currentView === 'singlePurchase' ? 'single' : 'bulk');
    setIsPurchaseModalOpen(true);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'singlePurchase':
      case 'bulkPurchase':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  animation="scale"
                  onClick={() => setCurrentView('main')}
                  className={isRTL ? 'ml-4' : 'mr-4'}
                >
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </AnimatedButton>
                <h2 className="text-2xl font-bold gradient-text">
                  {currentView === 'singlePurchase' ? t('menu.buySingle') : t('menu.buyBulk')}
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  onSelect={handleCountrySelect}
                />
              ))}
            </div>
          </div>
        );

      case 'myAccounts':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <AnimatedButton
                variant="ghost"
                size="sm"
                animation="scale"
                onClick={() => setCurrentView('main')}
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </AnimatedButton>
            </div>
            
            <MyAccounts />
          </div>
        );

      case 'recharge':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <AnimatedButton
                variant="ghost"
                size="sm"
                animation="scale"
                onClick={() => setCurrentView('main')}
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </AnimatedButton>
            </div>
            
            <RechargeSystem 
              user={user} 
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <UserProfile user={user} />
            <MainMenu
              user={user}
              onBuySingle={() => setCurrentView('singlePurchase')}
              onBuyBulk={() => setCurrentView('bulkPurchase')}
              onMyAccounts={() => setCurrentView('myAccounts')}
              onRecharge={() => setCurrentView('recharge')}
            />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>

      {/* Purchase Modal */}
      {selectedCountry && (
        <AccountPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setSelectedCountry(null);
          }}
          country={selectedCountry}
          user={user}
          purchaseType={purchaseType}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 {t('app.title')}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
