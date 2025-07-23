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
  // المنطقة العربية
  { id: '1', code: 'SA', name: 'السعودية', flag: '🇸🇦', phonePrefix: '+966', price: 2.50, available: 25, isActive: true },
  { id: '2', code: 'AE', name: 'الإمارات', flag: '🇦🇪', phonePrefix: '+971', price: 2.30, available: 28, isActive: true },
  { id: '3', code: 'EG', name: 'مصر', flag: '🇪🇬', phonePrefix: '+20', price: 1.20, available: 60, isActive: true },
  { id: '4', code: 'QA', name: 'قطر', flag: '🇶🇦', phonePrefix: '+974', price: 2.80, available: 15, isActive: true },
  { id: '5', code: 'KW', name: 'الكويت', flag: '🇰🇼', phonePrefix: '+965', price: 2.40, available: 22, isActive: true },
  { id: '6', code: 'BH', name: 'البحرين', flag: '🇧🇭', phonePrefix: '+973', price: 2.20, available: 18, isActive: true },
  { id: '7', code: 'OM', name: 'عمان', flag: '🇴🇲', phonePrefix: '+968', price: 2.10, available: 20, isActive: true },
  { id: '8', code: 'JO', name: 'الأردن', flag: '🇯🇴', phonePrefix: '+962', price: 1.80, available: 35, isActive: true },
  { id: '9', code: 'LB', name: 'لبنان', flag: '🇱🇧', phonePrefix: '+961', price: 1.70, available: 30, isActive: true },
  { id: '10', code: 'SY', name: 'سوريا', flag: '🇸🇾', phonePrefix: '+963', price: 1.50, available: 25, isActive: true },

  // أوروبا
  { id: '11', code: 'US', name: 'United States', flag: '🇺🇸', phonePrefix: '+1', price: 1.80, available: 50, isActive: true },
  { id: '12', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44', price: 2.20, available: 30, isActive: true },
  { id: '13', code: 'DE', name: 'Germany', flag: '🇩🇪', phonePrefix: '+49', price: 2.00, available: 40, isActive: true },
  { id: '14', code: 'FR', name: 'France', flag: '🇫🇷', phonePrefix: '+33', price: 1.90, available: 35, isActive: true },
  { id: '15', code: 'IT', name: 'Italy', flag: '🇮🇹', phonePrefix: '+39', price: 1.85, available: 32, isActive: true },
  { id: '16', code: 'ES', name: 'Spain', flag: '🇪🇸', phonePrefix: '+34', price: 1.75, available: 38, isActive: true },
  { id: '17', code: 'NL', name: 'Netherlands', flag: '🇳🇱', phonePrefix: '+31', price: 2.10, available: 25, isActive: true },
  { id: '18', code: 'CH', name: 'Switzerland', flag: '🇨🇭', phonePrefix: '+41', price: 3.20, available: 12, isActive: true },
  { id: '19', code: 'AT', name: 'Austria', flag: '🇦🇹', phonePrefix: '+43', price: 2.30, available: 20, isActive: true },
  { id: '20', code: 'BE', name: 'Belgium', flag: '🇧🇪', phonePrefix: '+32', price: 2.00, available: 22, isActive: true },

  // آسيا
  { id: '21', code: 'CN', name: '中国', flag: '🇨🇳', phonePrefix: '+86', price: 3.00, available: 20, isActive: true },
  { id: '22', code: 'JP', name: '日本', flag: '🇯🇵', phonePrefix: '+81', price: 3.50, available: 10, isActive: true },
  { id: '23', code: 'KR', name: '대한민국', flag: '🇰🇷', phonePrefix: '+82', price: 2.80, available: 15, isActive: true },
  { id: '24', code: 'IN', name: 'India', flag: '🇮🇳', phonePrefix: '+91', price: 1.30, available: 80, isActive: true },
  { id: '25', code: 'TH', name: 'Thailand', flag: '🇹🇭', phonePrefix: '+66', price: 1.60, available: 45, isActive: true },
  { id: '26', code: 'SG', name: 'Singapore', flag: '🇸🇬', phonePrefix: '+65', price: 2.90, available: 18, isActive: true },
  { id: '27', code: 'MY', name: 'Malaysia', flag: '🇲🇾', phonePrefix: '+60', price: 1.70, available: 40, isActive: true },
  { id: '28', code: 'PH', name: 'Philippines', flag: '🇵🇭', phonePrefix: '+63', price: 1.50, available: 50, isActive: true },
  { id: '29', code: 'VN', name: 'Vietnam', flag: '🇻🇳', phonePrefix: '+84', price: 1.40, available: 55, isActive: true },
  { id: '30', code: 'ID', name: 'Indonesia', flag: '🇮🇩', phonePrefix: '+62', price: 1.35, available: 60, isActive: true },

  // روسيا وآسيا الوسطى
  { id: '31', code: 'RU', name: 'Россия', flag: '🇷🇺', phonePrefix: '+7', price: 1.50, available: 45, isActive: true },
  { id: '32', code: 'TR', name: 'Türkiye', flag: '🇹🇷', phonePrefix: '+90', price: 1.40, available: 55, isActive: true },
  { id: '33', code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', phonePrefix: '+7', price: 1.30, available: 35, isActive: true },
  { id: '34', code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', phonePrefix: '+998', price: 1.20, available: 40, isActive: true },
  { id: '35', code: 'GE', name: 'Georgia', flag: '🇬🇪', phonePrefix: '+995', price: 1.60, available: 25, isActive: true },
  { id: '36', code: 'AM', name: 'Armenia', flag: '🇦🇲', phonePrefix: '+374', price: 1.70, available: 20, isActive: true },
  { id: '37', code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', phonePrefix: '+994', price: 1.65, available: 22, isActive: true },
  { id: '38', code: 'BY', name: 'Belarus', flag: '🇧🇾', phonePrefix: '+375', price: 1.55, available: 30, isActive: true },
  { id: '39', code: 'UA', name: 'Ukraine', flag: '🇺🇦', phonePrefix: '+380', price: 1.45, available: 35, isActive: true },
  { id: '40', code: 'MD', name: 'Moldova', flag: '🇲🇩', phonePrefix: '+373', price: 1.40, available: 25, isActive: true },

  // أفريقيا
  { id: '41', code: 'ZA', name: 'South Africa', flag: '🇿🇦', phonePrefix: '+27', price: 1.60, available: 30, isActive: true },
  { id: '42', code: 'NG', name: 'Nigeria', flag: '🇳🇬', phonePrefix: '+234', price: 1.30, available: 50, isActive: true },
  { id: '43', code: 'KE', name: 'Kenya', flag: '🇰🇪', phonePrefix: '+254', price: 1.25, available: 45, isActive: true },
  { id: '44', code: 'GH', name: 'Ghana', flag: '🇬🇭', phonePrefix: '+233', price: 1.35, available: 40, isActive: true },
  { id: '45', code: 'ET', name: 'Ethiopia', flag: '🇪🇹', phonePrefix: '+251', price: 1.20, available: 35, isActive: true },
  { id: '46', code: 'MA', name: 'Morocco', flag: '🇲🇦', phonePrefix: '+212', price: 1.50, available: 30, isActive: true },
  { id: '47', code: 'TN', name: 'Tunisia', flag: '🇹🇳', phonePrefix: '+216', price: 1.40, available: 25, isActive: true },
  { id: '48', code: 'DZ', name: 'Algeria', flag: '🇩🇿', phonePrefix: '+213', price: 1.45, available: 28, isActive: true },
  { id: '49', code: 'LY', name: 'Libya', flag: '🇱🇾', phonePrefix: '+218', price: 1.55, available: 20, isActive: true },
  { id: '50', code: 'SD', name: 'Sudan', flag: '🇸🇩', phonePrefix: '+249', price: 1.30, available: 25, isActive: true },

  // أمريكا الشمالية وكندا
  { id: '51', code: 'CA', name: 'Canada', flag: '🇨🇦', phonePrefix: '+1', price: 1.85, available: 40, isActive: true },
  { id: '52', code: 'MX', name: 'Mexico', flag: '🇲🇽', phonePrefix: '+52', price: 1.50, available: 45, isActive: true },
  { id: '53', code: 'GT', name: 'Guatemala', flag: '🇬🇹', phonePrefix: '+502', price: 1.40, available: 25, isActive: true },
  { id: '54', code: 'HN', name: 'Honduras', flag: '🇭🇳', phonePrefix: '+504', price: 1.35, available: 20, isActive: true },
  { id: '55', code: 'SV', name: 'El Salvador', flag: '🇸🇻', phonePrefix: '+503', price: 1.45, available: 18, isActive: true },
  { id: '56', code: 'NI', name: 'Nicaragua', flag: '🇳🇮', phonePrefix: '+505', price: 1.40, available: 15, isActive: true },
  { id: '57', code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phonePrefix: '+506', price: 1.65, available: 22, isActive: true },
  { id: '58', code: 'PA', name: 'Panama', flag: '🇵🇦', phonePrefix: '+507', price: 1.70, available: 20, isActive: true },
  { id: '59', code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', phonePrefix: '+1', price: 1.55, available: 25, isActive: true },
  { id: '60', code: 'CU', name: 'Cuba', flag: '🇨🇺', phonePrefix: '+53', price: 1.80, available: 15, isActive: true },

  // أمريكا الجنوبية
  { id: '61', code: 'BR', name: 'Brazil', flag: '🇧🇷', phonePrefix: '+55', price: 1.60, available: 50, isActive: true },
  { id: '62', code: 'AR', name: 'Argentina', flag: '🇦🇷', phonePrefix: '+54', price: 1.70, available: 35, isActive: true },
  { id: '63', code: 'CL', name: 'Chile', flag: '🇨🇱', phonePrefix: '+56', price: 1.80, available: 30, isActive: true },
  { id: '64', code: 'CO', name: 'Colombia', flag: '🇨🇴', phonePrefix: '+57', price: 1.50, available: 40, isActive: true },
  { id: '65', code: 'PE', name: 'Peru', flag: '🇵🇪', phonePrefix: '+51', price: 1.45, available: 35, isActive: true },
  { id: '66', code: 'VE', name: 'Venezuela', flag: '🇻🇪', phonePrefix: '+58', price: 1.40, available: 30, isActive: true },
  { id: '67', code: 'EC', name: 'Ecuador', flag: '🇪🇨', phonePrefix: '+593', price: 1.50, available: 25, isActive: true },
  { id: '68', code: 'BO', name: 'Bolivia', flag: '🇧🇴', phonePrefix: '+591', price: 1.35, available: 20, isActive: true },
  { id: '69', code: 'PY', name: 'Paraguay', flag: '🇵🇾', phonePrefix: '+595', price: 1.40, available: 18, isActive: true },
  { id: '70', code: 'UY', name: 'Uruguay', flag: '🇺🇾', phonePrefix: '+598', price: 1.75, available: 15, isActive: true },

  // أوروبا الشرقية
  { id: '71', code: 'PL', name: 'Poland', flag: '🇵🇱', phonePrefix: '+48', price: 1.80, available: 35, isActive: true },
  { id: '72', code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', phonePrefix: '+420', price: 1.90, available: 25, isActive: true },
  { id: '73', code: 'SK', name: 'Slovakia', flag: '🇸🇰', phonePrefix: '+421', price: 1.85, available: 20, isActive: true },
  { id: '74', code: 'HU', name: 'Hungary', flag: '🇭🇺', phonePrefix: '+36', price: 1.95, available: 22, isActive: true },
  { id: '75', code: 'RO', name: 'Romania', flag: '🇷🇴', phonePrefix: '+40', price: 1.70, available: 30, isActive: true },
  { id: '76', code: 'BG', name: 'Bulgaria', flag: '🇧🇬', phonePrefix: '+359', price: 1.65, available: 25, isActive: true },
  { id: '77', code: 'HR', name: 'Croatia', flag: '🇭🇷', phonePrefix: '+385', price: 1.90, available: 18, isActive: true },
  { id: '78', code: 'RS', name: 'Serbia', flag: '🇷🇸', phonePrefix: '+381', price: 1.60, available: 22, isActive: true },
  { id: '79', code: 'SI', name: 'Slovenia', flag: '🇸🇮', phonePrefix: '+386', price: 2.00, available: 15, isActive: true },
  { id: '80', code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', phonePrefix: '+387', price: 1.75, available: 20, isActive: true },

  // دول الشمال
  { id: '81', code: 'SE', name: 'Sweden', flag: '🇸🇪', phonePrefix: '+46', price: 2.40, available: 25, isActive: true },
  { id: '82', code: 'NO', name: 'Norway', flag: '🇳🇴', phonePrefix: '+47', price: 2.80, available: 18, isActive: true },
  { id: '83', code: 'DK', name: 'Denmark', flag: '🇩🇰', phonePrefix: '+45', price: 2.50, available: 20, isActive: true },
  { id: '84', code: 'FI', name: 'Finland', flag: '🇫🇮', phonePrefix: '+358', price: 2.30, available: 22, isActive: true },
  { id: '85', code: 'IS', name: 'Iceland', flag: '🇮🇸', phonePrefix: '+354', price: 3.00, available: 8, isActive: true },
  { id: '86', code: 'IE', name: 'Ireland', flag: '🇮🇪', phonePrefix: '+353', price: 2.20, available: 25, isActive: true },
  { id: '87', code: 'PT', name: 'Portugal', flag: '🇵🇹', phonePrefix: '+351', price: 1.80, available: 30, isActive: true },
  { id: '88', code: 'GR', name: 'Greece', flag: '🇬🇷', phonePrefix: '+30', price: 1.85, available: 28, isActive: true },
  { id: '89', code: 'CY', name: 'Cyprus', flag: '🇨🇾', phonePrefix: '+357', price: 2.10, available: 15, isActive: true },
  { id: '90', code: 'MT', name: 'Malta', flag: '🇲🇹', phonePrefix: '+356', price: 2.50, available: 10, isActive: true },

  // دول أخرى
  { id: '91', code: 'AU', name: 'Australia', flag: '🇦🇺', phonePrefix: '+61', price: 2.60, available: 30, isActive: true },
  { id: '92', code: 'NZ', name: 'New Zealand', flag: '🇳🇿', phonePrefix: '+64', price: 2.70, available: 18, isActive: true },
  { id: '93', code: 'IL', name: 'Israel', flag: '🇮🇱', phonePrefix: '+972', price: 2.20, available: 20, isActive: true },
  { id: '94', code: 'IR', name: 'Iran', flag: '🇮🇷', phonePrefix: '+98', price: 1.60, available: 25, isActive: true },
  { id: '95', code: 'PK', name: 'Pakistan', flag: '🇵🇰', phonePrefix: '+92', price: 1.25, available: 45, isActive: true },
  { id: '96', code: 'BD', name: 'Bangladesh', flag: '🇧🇩', phonePrefix: '+880', price: 1.20, available: 50, isActive: true },
  { id: '97', code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', phonePrefix: '+94', price: 1.40, available: 35, isActive: true },
  { id: '98', code: 'NP', name: 'Nepal', flag: '🇳🇵', phonePrefix: '+977', price: 1.30, available: 30, isActive: true },
  { id: '99', code: 'AF', name: 'Afghanistan', flag: '🇦🇫', phonePrefix: '+93', price: 1.15, available: 25, isActive: true },
  { id: '100', code: 'IQ', name: 'العراق', flag: '🇮🇶', phonePrefix: '+964', price: 1.50, available: 30, isActive: true }
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
  const [currentPage, setCurrentPage] = useState(0);
  
  const COUNTRIES_PER_PAGE = 20;
  const COUNTRIES_PER_ROW = 2;

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPurchaseType(currentView === 'singlePurchase' ? 'single' : 'bulk');
    setIsPurchaseModalOpen(true);
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  const totalPages = Math.ceil(mockCountries.length / COUNTRIES_PER_PAGE);
  const startIndex = currentPage * COUNTRIES_PER_PAGE;
  const currentCountries = mockCountries.slice(startIndex, startIndex + COUNTRIES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
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
            
            {/* Countries Grid - 2 columns per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCountries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  onSelect={handleCountrySelect}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-8">
              <AnimatedButton
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                animation="scale"
                className="flex items-center gap-2"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                السابق
              </AnimatedButton>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  الصفحة {currentPage + 1} من {totalPages}
                </span>
              </div>

              <AnimatedButton
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                animation="scale"
                className="flex items-center gap-2"
              >
                التالي
                <ArrowLeft className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
              </AnimatedButton>
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
