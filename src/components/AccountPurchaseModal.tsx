import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedButton } from '@/components/AnimatedButton';
import { CodeVerificationSystem } from '@/components/CodeVerificationSystem';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { Country, User } from '@/types';
import { 
  Shield, 
  Phone, 
  Globe, 
  DollarSign, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  FileText
} from 'lucide-react';

interface AccountPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: Country;
  user: User;
  purchaseType: 'single' | 'bulk';
}

export const AccountPurchaseModal: React.FC<AccountPurchaseModalProps> = ({
  isOpen,
  onClose,
  country,
  user,
  purchaseType
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'confirm' | 'quantity' | 'dataType' | 'processing' | 'code' | 'success'>('confirm');
  const [quantity, setQuantity] = useState(1);
  const [dataType, setDataType] = useState<'sessions' | 'tdata'>('sessions');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState('');
  const [purchasedAccount, setPurchasedAccount] = useState<any>(null);

  const handleConfirmPurchase = () => {
    if (purchaseType === 'bulk') {
      setStep('quantity');
    } else {
      setStep('processing');
      // Simulate purchase process
      setTimeout(() => {
        setStep('code');
        setPurchasedAccount({
          phoneNumber: '+966501234567',
          sessionData: 'session_data_here',
          verificationCode: null
        });
      }, 2000);
    }
  };

  const handleQuantitySelect = (qty: number) => {
    setQuantity(qty);
    setStep('dataType');
  };

  const handleDataTypeSelect = (type: 'sessions' | 'tdata') => {
    setDataType(type);
    setStep('processing');
    // Simulate bulk purchase
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleRequestCode = () => {
    // Simulate code request
    setTimeout(() => {
      setPurchasedAccount(prev => ({
        ...prev,
        verificationCode: '54821'
      }));
      toast({
        title: "تم استلام الكود",
        description: "تم استلام كود التحقق بنجاح"
      });
    }, 1500);
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${type} إلى الحافظة`
    });
  };

  const handleDownloadFile = () => {
    const accounts = Array.from({ length: quantity }, (_, i) => {
      const baseAccount = {
        phoneNumber: `${country.phonePrefix}50${(1234567 + i).toString()}`,
        status: 'active',
        verificationCode: `${Math.floor(10000 + Math.random() * 90000)}`,
        twoFactorPassword: `auth_pass_${i + 1}`
      };

      if (dataType === 'sessions') {
        return {
          ...baseAccount,
          sessionData: `session_data_${i + 1}_${Date.now()}`,
          sessionString: `1BJWap1aBBNRXx-O_${i + 1}_session_string`
        };
      } else {
        return {
          ...baseAccount,
          tdataFile: `tdata_${i + 1}.zip`,
          tdataPath: `/accounts/tdata/account_${i + 1}/`
        };
      }
    });

    const jsonData = JSON.stringify(accounts, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${country.name}_${dataType}_${quantity}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "تم التحميل",
      description: `تم تحميل ${quantity} حساب من نوع ${dataType === 'sessions' ? 'Sessions' : 'TData'} بنجاح`
    });
  };

  const renderStep = () => {
    switch (step) {
      case 'confirm':
        return (
          <div className="space-y-6">
            <Card className="glass backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <CardTitle>{country.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{country.phonePrefix}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="text-sm">{t('account.price')}: ${country.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm">{country.available} {t('countries.available')}</span>
                  </div>
                </div>
                
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">Important Notice</p>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>• Account is 100% fresh and verified</li>
                        <li>• No refunds after account delivery</li>
                        <li>• Session valid for 3 months</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between">
              <div className="text-lg">
                <span className="text-muted-foreground">{t('purchase.total')}: </span>
                <span className="font-bold text-success">${country.price}</span>
              </div>
              <div className="space-x-2">
                <AnimatedButton variant="outline" onClick={onClose}>
                  {t('purchase.cancel')}
                </AnimatedButton>
                <AnimatedButton 
                  variant="primary" 
                  animation="glow"
                  onClick={handleConfirmPurchase}
                  disabled={user.balance < country.price}
                >
                  {user.balance < country.price ? t('purchase.insufficientBalance') : t('purchase.confirm')}
                </AnimatedButton>
              </div>
            </div>
          </div>
        );

      case 'quantity':
        const quantities = [10, 20, 50, 100];
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('purchase.selectQuantity')}</h3>
              <p className="text-muted-foreground">Choose how many accounts you want to purchase</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {quantities.map((qty) => (
                <Card 
                  key={qty}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleQuantitySelect(qty)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold gradient-text">{qty}</div>
                    <div className="text-sm text-muted-foreground">accounts</div>
                    <div className="text-lg font-semibold mt-2">${(qty * country.price).toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'dataType':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">اختر نوع البيانات</h3>
              <p className="text-muted-foreground">اختر نوع البيانات التي تريد الحصول عليها</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20"
                onClick={() => handleDataTypeSelect('sessions')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-bold gradient-text">Sessions</div>
                  <div className="text-sm text-muted-foreground mt-2">بيانات الجلسة الآمنة</div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-secondary/20"
                onClick={() => handleDataTypeSelect('tdata')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-bold gradient-text">TData</div>
                  <div className="text-sm text-muted-foreground mt-2">ملفات البيانات المضغوطة</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Processing Your Purchase</h3>
              <p className="text-muted-foreground">Please wait while we prepare your account(s)...</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-6">
            <Card className="glass backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Account Ready!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{t('account.phone')}:</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono">{purchasedAccount?.phoneNumber}</code>
                      <AnimatedButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyToClipboard(purchasedAccount?.phoneNumber, 'رقم الهاتف')}
                      >
                        <Copy className="w-4 h-4" />
                      </AnimatedButton>
                    </div>
                  </div>
                  
                  {purchasedAccount?.verificationCode ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-success" />
                          <span className="text-sm">كود التحقق:</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-lg font-mono font-bold text-success">{purchasedAccount.verificationCode}</code>
                          <AnimatedButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyToClipboard(purchasedAccount.verificationCode, 'كود التحقق')}
                          >
                            <Copy className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-secondary" />
                          <span className="text-sm">التحقق الثنائي:</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-lg font-mono font-bold text-secondary">auth_pass_123</code>
                          <AnimatedButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyToClipboard('auth_pass_123', 'كلمة مرور التحقق الثنائي')}
                          >
                            <Copy className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <AnimatedButton 
                      variant="primary" 
                      className="w-full"
                      onClick={handleRequestCode}
                      animation="glow"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t('account.requestCode')}
                    </AnimatedButton>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('purchase.success')}</h3>
              <p className="text-muted-foreground">
                {purchaseType === 'bulk' 
                  ? `${quantity} accounts have been prepared and will be downloaded automatically.`
                  : 'Your account is ready to use!'
                }
              </p>
            </div>
            
            {purchaseType === 'bulk' && (
              <AnimatedButton 
                variant="primary" 
                animation="glow" 
                className="w-full"
                onClick={handleDownloadFile}
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل الملف
              </AnimatedButton>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">
            {purchaseType === 'single' ? 'Single Account Purchase' : 'Bulk Account Purchase'}
          </DialogTitle>
          <DialogDescription>
            {country.name} • Balance: ${user.balance.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};