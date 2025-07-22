import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Account } from '@/types';
import { 
  Phone, 
  Shield, 
  Copy, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  RefreshCw
} from 'lucide-react';

// Mock data for accounts
const mockAccounts: Account[] = [
  {
    id: '1',
    countryCode: 'SA',
    phoneNumber: '+966501234567',
    sessionData: 'encrypted_session_data_1',
    tdataData: 'encrypted_tdata_1',
    twoFactorPassword: '2fa_password_1',
    status: 'active',
    verified: true,
    addedAt: new Date('2024-01-15'),
    addedBy: 'admin'
  },
  {
    id: '2',
    countryCode: 'US',
    phoneNumber: '+1234567890',
    sessionData: 'encrypted_session_data_2',
    status: 'inactive',
    verified: false,
    addedAt: new Date('2024-01-10'),
    addedBy: 'admin'
  },
  {
    id: '3',
    countryCode: 'GB',
    phoneNumber: '+441234567890',
    sessionData: 'encrypted_session_data_3',
    tdataData: 'encrypted_tdata_3',
    status: 'sold',
    verified: true,
    addedAt: new Date('2024-01-05'),
    addedBy: 'admin'
  }
];

const countryFlags: { [key: string]: string } = {
  'SA': '🇸🇦',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'CN': '🇨🇳',
  'RU': '🇷🇺',
  'KR': '🇰🇷',
  'JP': '🇯🇵',
  'AE': '🇦🇪',
  'EG': '🇪🇬',
  'TR': '🇹🇷'
};

interface MyAccountsProps {
  className?: string;
}

export const MyAccounts: React.FC<MyAccountsProps> = ({ className }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [accounts] = useState<Account[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: Account['status']) => {
    const variants = {
      active: 'bg-success text-success-foreground',
      inactive: 'bg-muted text-muted-foreground',
      sold: 'bg-secondary text-secondary-foreground',
      reserved: 'bg-warning text-warning-foreground'
    };

    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      inactive: <XCircle className="w-3 h-3" />,
      sold: <AlertCircle className="w-3 h-3" />,
      reserved: <AlertCircle className="w-3 h-3" />
    };

    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1">
          {status === 'active' && 'نشط'}
          {status === 'inactive' && 'غير نشط'}
          {status === 'sold' && 'مباع'}
          {status === 'reserved' && 'محجوز'}
        </span>
      </Badge>
    );
  };

  const filteredAccounts = accounts.filter(account => {
    if (activeTab === 'all') return true;
    return account.status === activeTab;
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ",
        description: `تم نسخ ${label} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ البيانات",
        variant: "destructive",
      });
    }
  };

  const toggleSensitiveData = (accountId: string) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadData = (account: Account) => {
    const data = {
      phoneNumber: account.phoneNumber,
      sessionData: account.sessionData,
      tdataData: account.tdataData,
      twoFactorPassword: account.twoFactorPassword
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `account_${account.phoneNumber.replace(/\+/g, '')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "تم التحميل",
      description: "تم تحميل بيانات الحساب بنجاح",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">حساباتي</h2>
          <p className="text-muted-foreground mt-1">إدارة جميع حساباتك المشتراة</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          تحديث
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المجموع</p>
                <p className="text-2xl font-bold text-primary">{accounts.length}</p>
              </div>
              <Phone className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نشط</p>
                <p className="text-2xl font-bold text-success">
                  {accounts.filter(a => a.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مُحقق</p>
                <p className="text-2xl font-bold text-secondary">
                  {accounts.filter(a => a.verified).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مباع</p>
                <p className="text-2xl font-bold text-warning">
                  {accounts.filter(a => a.status === 'sold').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="active">نشط</TabsTrigger>
          <TabsTrigger value="inactive">غير نشط</TabsTrigger>
          <TabsTrigger value="sold">مباع</TabsTrigger>
          <TabsTrigger value="reserved">محجوز</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="group hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-2xl">{countryFlags[account.countryCode]}</span>
                      <div>
                        <CardTitle className="text-lg">{account.phoneNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {account.countryCode}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(account.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {account.verified ? (
                        <Shield className="w-4 h-4 text-success" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-warning" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {account.verified ? 'محقق' : 'غير محقق'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(account.addedAt)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Data */}
                  <div className="space-y-3">
                    {account.sessionData && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">Session Data</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSensitiveData(`${account.id}-session`)}
                            className="h-6 px-2"
                          >
                            {showSensitiveData[`${account.id}-session`] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            type={showSensitiveData[`${account.id}-session`] ? 'text' : 'password'}
                            value={account.sessionData}
                            readOnly
                            className="text-xs pr-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.sessionData!, 'Session Data')}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {account.tdataData && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">TData</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSensitiveData(`${account.id}-tdata`)}
                            className="h-6 px-2"
                          >
                            {showSensitiveData[`${account.id}-tdata`] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            type={showSensitiveData[`${account.id}-tdata`] ? 'text' : 'password'}
                            value={account.tdataData}
                            readOnly
                            className="text-xs pr-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.tdataData!, 'TData')}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {account.twoFactorPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">2FA Password</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSensitiveData(`${account.id}-2fa`)}
                            className="h-6 px-2"
                          >
                            {showSensitiveData[`${account.id}-2fa`] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            type={showSensitiveData[`${account.id}-2fa`] ? 'text' : 'password'}
                            value={account.twoFactorPassword}
                            readOnly
                            className="text-xs pr-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.twoFactorPassword!, '2FA Password')}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadData(account)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إعدادات الحساب</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>إعدادات متقدمة للحساب {account.phoneNumber}</p>
                          {/* Add more account settings here */}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف الحساب</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذا الحساب؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-20">
              <Phone className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                لا توجد حسابات
              </h3>
              <p className="text-muted-foreground">
                لم يتم العثور على حسابات في هذه الفئة
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};