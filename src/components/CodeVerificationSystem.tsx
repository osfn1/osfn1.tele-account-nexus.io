import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Smartphone,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Copy,
  MessageCircle,
  Phone
} from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  icon: React.ReactNode;
}

interface CodeVerificationSystemProps {
  phoneNumber: string;
  onVerificationComplete: (success: boolean, data?: any) => void;
  className?: string;
}

export const CodeVerificationSystem: React.FC<CodeVerificationSystemProps> = ({
  phoneNumber,
  onVerificationComplete,
  className
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [sessionData, setSessionData] = useState<string>('');
  const [tdataData, setTdataData] = useState<string>('');

  const steps: VerificationStep[] = [
    {
      id: 'phone',
      title: 'إرسال كود التحقق',
      description: 'سيتم إرسال كود التحقق إلى رقم الهاتف',
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : 'pending',
      icon: <Send className="w-5 h-5" />
    },
    {
      id: 'verify',
      title: 'التحقق من الكود',
      description: 'أدخل كود التحقق المرسل إلى هاتفك',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'twofa',
      title: 'التحقق الثنائي',
      description: 'أدخل كلمة مرور التحقق الثنائي إذا كانت مفعلة',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 'complete',
      title: 'اكتمال العملية',
      description: 'تم التحقق بنجاح وجلب بيانات الحساب',
      status: currentStep === 3 ? 'completed' : 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم إرسال الكود",
        description: `تم إرسال كود التحقق إلى ${phoneNumber}`,
      });
      
      setCurrentStep(1);
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال كود التحقق",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 5) {
      toast({
        title: "كود غير صحيح",
        description: "يجب أن يكون كود التحقق مكون من 5 أرقام",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure
      const isValid = verificationCode === '12345'; // Mock validation
      
      if (isValid) {
        toast({
          title: "تم التحقق",
          description: "تم التحقق من الكود بنجاح",
        });
        setCurrentStep(2);
        
        // Generate mock session data
        setSessionData('1BVtsOHoBBgbAA+uBOKEO8CGKGAsEKLLFBE0ZUIgAkkgoERGPAk5rAo=');
      } else {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= maxAttempts) {
          toast({
            title: "تم تجاوز المحاولات",
            description: "تم تجاوز العدد المسموح من المحاولات",
            variant: "destructive",
          });
          onVerificationComplete(false);
          return;
        }
        
        toast({
          title: "كود خاطئ",
          description: `كود التحقق غير صحيح. المحاولات المتبقية: ${maxAttempts - attempts - 1}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الكود",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerify = async () => {
    setIsLoading(true);
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock tdata
      setTdataData('AgABAAAAAABeStGSRH8LhGe...');
      
      toast({
        title: "اكتمل التحقق",
        description: "تم التحقق من جميع الخطوات بنجاح",
      });
      
      setCurrentStep(3);
      
      // Complete verification with account data
      setTimeout(() => {
        onVerificationComplete(true, {
          sessionData,
          tdataData: 'AgABAAAAAABeStGSRH8LhGe...',
          twoFactorPassword: twoFactorCode
        });
      }, 1000);
      
    } catch (error) {
      toast({
        title: "خطأ في التحقق الثنائي",
        description: "فشل في التحقق الثنائي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTwoFactor = () => {
    setCurrentStep(3);
    setTimeout(() => {
      onVerificationComplete(true, {
        sessionData,
        tdataData: null,
        twoFactorPassword: null
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    setCountdown(60);
    setCanResend(false);
    await handleSendCode();
  };

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

  const getStepStatus = (step: VerificationStep) => {
    switch (step.status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            عملية التحقق من الحساب
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            رقم الهاتف: {phoneNumber}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(currentStep / 3) * 100} className="w-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    step.status === 'active' ? 'border-primary bg-primary/10' :
                    step.status === 'completed' ? 'border-success bg-success/10' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Badge className={getStepStatus(step)}>
                      {step.icon}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              إرسال كود التحقق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Smartphone className="w-4 h-4" />
              <AlertDescription>
                سيتم إرسال كود تحقق مكون من 5 أرقام إلى رقم الهاتف {phoneNumber}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleSendCode} 
              disabled={isLoading}
              className="w-full bg-gradient-primary text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  إرسال كود التحقق
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              أدخل كود التحقق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                أدخل كود التحقق المرسل إلى {phoneNumber}
              </p>
              
              <div className="flex justify-center mb-4">
                <InputOTP
                  maxLength={5}
                  value={verificationCode}
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {attempts > 0 && (
                <Alert className="mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    محاولات خاطئة: {attempts}/{maxAttempts}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 5}
                  className="flex-1 bg-gradient-primary text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      تحقق من الكود
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                  className="flex-1"
                >
                  {canResend ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      إعادة إرسال
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      إعادة الإرسال ({countdown}s)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              التحقق الثنائي (اختياري)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                إذا كان التحقق الثنائي مفعلاً على هذا الحساب، أدخل كلمة المرور
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Label htmlFor="two-factor">كلمة مرور التحقق الثنائي</Label>
              <Input
                id="two-factor"
                type="password"
                placeholder="أدخل كلمة مرور التحقق الثنائي"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />
            </div>

            <div className="flex space-x-4 rtl:space-x-reverse">
              <Button 
                onClick={handleTwoFactorVerify}
                disabled={isLoading || !twoFactorCode}
                className="flex-1 bg-gradient-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    تحقق
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSkipTwoFactor}
                disabled={isLoading}
                className="flex-1"
              >
                تخطي
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-success">
              <CheckCircle className="w-5 h-5 mr-2" />
              تم التحقق بنجاح
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                تم التحقق من الحساب بنجاح وجلب جميع البيانات المطلوبة
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Session Data</Label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <Input
                    value={sessionData}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sessionData, 'Session Data')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {tdataData && (
                <div>
                  <Label>TData</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <Input
                      value={tdataData}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(tdataData, 'TData')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {twoFactorCode && (
                <div>
                  <Label>2FA Password</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    <Input
                      value={twoFactorCode}
                      readOnly
                      type="password"
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(twoFactorCode, '2FA Password')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                تم حفظ بيانات الحساب بنجاح. يمكنك الآن استخدامها لتسجيل الدخول إلى تيليجرام.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};