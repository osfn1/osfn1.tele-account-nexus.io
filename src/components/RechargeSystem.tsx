import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import {
  CreditCard,
  Wallet,
  Gift,
  History,
  Zap,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  QrCode,
  Smartphone,
  Building2,
  Globe
} from 'lucide-react';

interface RechargeOption {
  id: string;
  amount: number;
  bonus: number;
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fees: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
}

interface RechargeTransaction {
  id: string;
  amount: number;
  bonus: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  transactionId: string;
}

const rechargeOptions: RechargeOption[] = [
  { id: '1', amount: 10, bonus: 0 },
  { id: '2', amount: 25, bonus: 2 },
  { id: '3', amount: 50, bonus: 5, popular: true },
  { id: '4', amount: 100, bonus: 15, popular: true },
  { id: '5', amount: 250, bonus: 40 },
  { id: '6', amount: 500, bonus: 100 }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'بطاقة ائتمان',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Visa, Mastercard, American Express',
    fees: 2.9,
    minAmount: 5,
    maxAmount: 10000,
    processingTime: 'فوري'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <Wallet className="w-5 h-5" />,
    description: 'الدفع الآمن عبر PayPal',
    fees: 3.4,
    minAmount: 5,
    maxAmount: 5000,
    processingTime: 'فوري'
  },
  {
    id: 'bank',
    name: 'تحويل بنكي',
    icon: <Building2 className="w-5 h-5" />,
    description: 'تحويل مباشر من البنك',
    fees: 0,
    minAmount: 20,
    maxAmount: 50000,
    processingTime: '1-3 أيام عمل'
  },
  {
    id: 'crypto',
    name: 'عملة رقمية',
    icon: <Globe className="w-5 h-5" />,
    description: 'Bitcoin, Ethereum, USDT',
    fees: 1,
    minAmount: 10,
    maxAmount: 25000,
    processingTime: '10-30 دقيقة'
  }
];

const mockTransactions: RechargeTransaction[] = [
  {
    id: '1',
    amount: 50,
    bonus: 5,
    method: 'بطاقة ائتمان',
    status: 'completed',
    date: new Date('2024-01-20'),
    transactionId: 'TXN001'
  },
  {
    id: '2',
    amount: 100,
    bonus: 15,
    method: 'PayPal',
    status: 'pending',
    date: new Date('2024-01-18'),
    transactionId: 'TXN002'
  }
];

interface RechargeSystemProps {
  user: User;
  onBalanceUpdate: (newBalance: number) => void;
  className?: string;
}

export const RechargeSystem: React.FC<RechargeSystemProps> = ({ user, onBalanceUpdate, className }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedAmount, setSelectedAmount] = useState<RechargeOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [transactions] = useState<RechargeTransaction[]>(mockTransactions);
  const [promoCode, setPromoCode] = useState('');

  const handleAmountSelect = (option: RechargeOption) => {
    setSelectedAmount(option);
    setCustomAmount('');
  };

  const handleCustomAmount = (amount: string) => {
    setCustomAmount(amount);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    const baseAmount = selectedAmount ? selectedAmount.amount : parseFloat(customAmount) || 0;
    const bonus = selectedAmount ? selectedAmount.bonus : Math.floor(baseAmount * 0.05); // 5% bonus for custom amounts
    return baseAmount + bonus;
  };

  const getBaseAmount = () => {
    return selectedAmount ? selectedAmount.amount : parseFloat(customAmount) || 0;
  };

  const getBonus = () => {
    return selectedAmount ? selectedAmount.bonus : Math.floor((parseFloat(customAmount) || 0) * 0.05);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || getBaseAmount() === 0) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBalance = user.balance + getFinalAmount();
      onBalanceUpdate(newBalance);
      
      toast({
        title: "تم الشحن بنجاح",
        description: `تم إضافة ${getFinalAmount()} دولار إلى رصيدك`,
      });
      
      setShowPaymentDialog(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedPaymentMethod(null);
    } catch (error) {
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفعة. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: RechargeTransaction['status']) => {
    const variants = {
      completed: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      failed: 'bg-destructive text-destructive-foreground'
    };

    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />
    };

    const labels = {
      completed: 'مكتمل',
      pending: 'معلق',
      failed: 'فاشل'
    };

    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1">{labels[status]}</span>
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">شحن الرصيد</h2>
          <p className="text-muted-foreground mt-1">أضف أموال إلى حسابك بطرق دفع متنوعة</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">رصيدك الحالي</p>
          <p className="text-2xl font-bold text-primary">${user.balance.toFixed(2)}</p>
        </div>
      </div>

      <Tabs defaultValue="recharge" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recharge">شحن جديد</TabsTrigger>
          <TabsTrigger value="history">تاريخ المعاملات</TabsTrigger>
        </TabsList>

        <TabsContent value="recharge" className="space-y-6">
          {/* Quick Recharge Options */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                خيارات الشحن السريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {rechargeOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleAmountSelect(option)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedAmount?.id === option.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                        الأكثر شعبية
                      </Badge>
                    )}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">${option.amount}</p>
                      {option.bonus > 0 && (
                        <p className="text-sm text-success">+${option.bonus} مكافأة</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        المجموع: ${option.amount + option.bonus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Custom Amount */}
              <div className="space-y-4">
                <Label htmlFor="custom-amount">مبلغ مخصص</Label>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="flex-1">
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="أدخل المبلغ"
                      value={customAmount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      min="1"
                      max="10000"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="كود الخصم (اختياري)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                </div>
                {customAmount && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">
                      المبلغ الأساسي: ${parseFloat(customAmount).toFixed(2)}
                    </p>
                    <p className="text-sm text-success">
                      مكافأة (5%): +${(parseFloat(customAmount) * 0.05).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold">
                      المجموع: ${(parseFloat(customAmount) * 1.05).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {(selectedAmount || customAmount) && (
            <Card className="bg-gradient-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  طرق الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>رسوم: {method.fees}%</span>
                            <span>المعالجة: {method.processingTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPaymentMethod && (
                  <div className="mt-6">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">ملخص الدفعة</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>المبلغ الأساسي:</span>
                            <span>${getBaseAmount().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-success">
                            <span>المكافأة:</span>
                            <span>+${getBonus().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>رسوم المعالجة:</span>
                            <span>${(getBaseAmount() * selectedPaymentMethod.fees / 100).toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>المجموع المطلوب:</span>
                            <span>${(getBaseAmount() * (1 + selectedPaymentMethod.fees / 100)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-primary">
                            <span>سيضاف إلى رصيدك:</span>
                            <span>${getFinalAmount().toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90">
                          <CreditCard className="w-4 h-4 mr-2" />
                          متابعة الدفع
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إتمام الدفع</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {isProcessing ? (
                            <div className="text-center py-8">
                              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p>جاري معالجة الدفعة...</p>
                              <Progress value={66} className="mt-4" />
                            </div>
                          ) : (
                            <>
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">تفاصيل الدفعة</h4>
                                <p>الطريقة: {selectedPaymentMethod.name}</p>
                                <p>المبلغ: ${getFinalAmount().toFixed(2)}</p>
                              </div>
                              
                              {selectedPaymentMethod.id === 'card' && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="card-number">رقم البطاقة</Label>
                                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                                      <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                      <Label htmlFor="cvv">CVV</Label>
                                      <Input id="cvv" placeholder="123" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedPaymentMethod.id === 'crypto' && (
                                <div className="text-center space-y-4">
                                  <QrCode className="w-32 h-32 mx-auto text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    امسح الكود QR أو انسخ عنوان المحفظة
                                  </p>
                                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Input value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" readOnly />
                                    <Button variant="outline" size="sm">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={isProcessing}>
                            إلغاء
                          </Button>
                          <Button onClick={handlePayment} disabled={isProcessing}>
                            {isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                تاريخ المعاملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          ${transaction.amount} + ${transaction.bonus} مكافأة
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.method} • {formatDate(transaction.date)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          معرف المعاملة: {transaction.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(transaction.status)}
                      <p className="text-sm font-semibold text-primary mt-1">
                        +${transaction.amount + transaction.bonus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-20">
                  <History className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    لا توجد معاملات
                  </h3>
                  <p className="text-muted-foreground">
                    ستظهر معاملات الشحن هنا بعد إجراء أول عملية شحن
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};