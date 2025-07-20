import { useState, useEffect } from 'react';
import { Language, Translation } from '@/types';

const translations: Record<Language, Translation> = {
  ar: {
    // Header & Navigation
    'app.title': 'تليجرام نكسس',
    'app.subtitle': 'منصة بيع حسابات التليجرام المتقدمة',
    'nav.home': 'الرئيسية',
    'nav.accounts': 'الحسابات',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',
    
    // User Info
    'user.balance': 'رصيدك',
    'user.id': 'معرف المستخدم',
    'user.username': 'اسم المستخدم',
    'user.purchases': 'مشترياتك',
    'user.spent': 'إجمالي الإنفاق',
    'user.memberSince': 'عضو منذ',
    
    // Main Menu
    'menu.buySingle': 'شراء حساب فردي',
    'menu.buyBulk': 'شراء بالجملة',
    'menu.myAccounts': 'حساباتي',
    'menu.recharge': 'شحن الرصيد',
    
    // Countries
    'countries.title': 'اختر الدولة',
    'countries.available': 'متوفر',
    'countries.accounts': 'حساب',
    'countries.price': 'السعر',
    'countries.noAccounts': 'لا توجد حسابات متاحة',
    
    // Purchase
    'purchase.confirm': 'تأكيد الشراء',
    'purchase.cancel': 'إلغاء',
    'purchase.success': 'تمت العملية بنجاح!',
    'purchase.failed': 'فشلت العملية',
    'purchase.insufficientBalance': 'رصيد غير كافي',
    'purchase.selectQuantity': 'اختر الكمية',
    'purchase.total': 'المجموع',
    'purchase.downloadFile': 'تحميل الملف',
    
    // Account Details
    'account.phone': 'رقم الهاتف',
    'account.country': 'الدولة',
    'account.price': 'السعر',
    'account.status': 'الحالة',
    'account.requestCode': 'طلب الكود',
    'account.enterCode': 'إدخال الكود',
    'account.verificationCode': 'كود التحقق',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.darkMode': 'الوضع الليلي',
    'settings.lightMode': 'الوضع النهاري',
    'settings.notifications': 'الإشعارات',
    
    // Common
    'common.back': 'العودة',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    
    // Languages
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ru': 'Русский',
    'lang.ko': '한국어'
  },
  
  en: {
    // Header & Navigation
    'app.title': 'Telegram Nexus',
    'app.subtitle': 'Advanced Telegram Accounts Trading Platform',
    'nav.home': 'Home',
    'nav.accounts': 'Accounts',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    
    // User Info
    'user.balance': 'Your Balance',
    'user.id': 'User ID',
    'user.username': 'Username',
    'user.purchases': 'Your Purchases',
    'user.spent': 'Total Spent',
    'user.memberSince': 'Member Since',
    
    // Main Menu
    'menu.buySingle': 'Buy Single Account',
    'menu.buyBulk': 'Buy in Bulk',
    'menu.myAccounts': 'My Accounts',
    'menu.recharge': 'Recharge Balance',
    
    // Countries
    'countries.title': 'Select Country',
    'countries.available': 'Available',
    'countries.accounts': 'accounts',
    'countries.price': 'Price',
    'countries.noAccounts': 'No accounts available',
    
    // Purchase
    'purchase.confirm': 'Confirm Purchase',
    'purchase.cancel': 'Cancel',
    'purchase.success': 'Purchase Successful!',
    'purchase.failed': 'Purchase Failed',
    'purchase.insufficientBalance': 'Insufficient Balance',
    'purchase.selectQuantity': 'Select Quantity',
    'purchase.total': 'Total',
    'purchase.downloadFile': 'Download File',
    
    // Account Details
    'account.phone': 'Phone Number',
    'account.country': 'Country',
    'account.price': 'Price',
    'account.status': 'Status',
    'account.requestCode': 'Request Code',
    'account.enterCode': 'Enter Code',
    'account.verificationCode': 'Verification Code',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.notifications': 'Notifications',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    
    // Languages
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ru': 'Русский',
    'lang.ko': '한국어'
  },
  
  zh: {
    // Header & Navigation
    'app.title': '电报账户交易',
    'app.subtitle': '高级电报账户交易平台',
    'nav.home': '首页',
    'nav.accounts': '账户',
    'nav.settings': '设置',
    'nav.profile': '个人资料',
    
    // User Info
    'user.balance': '您的余额',
    'user.id': '用户ID',
    'user.username': '用户名',
    'user.purchases': '您的购买',
    'user.spent': '总支出',
    'user.memberSince': '注册时间',
    
    // Main Menu
    'menu.buySingle': '购买单个账户',
    'menu.buyBulk': '批量购买',
    'menu.myAccounts': '我的账户',
    'menu.recharge': '充值余额',
    
    // Countries
    'countries.title': '选择国家',
    'countries.available': '可用',
    'countries.accounts': '账户',
    'countries.price': '价格',
    'countries.noAccounts': '没有可用账户',
    
    // Purchase
    'purchase.confirm': '确认购买',
    'purchase.cancel': '取消',
    'purchase.success': '购买成功！',
    'purchase.failed': '购买失败',
    'purchase.insufficientBalance': '余额不足',
    'purchase.selectQuantity': '选择数量',
    'purchase.total': '总计',
    'purchase.downloadFile': '下载文件',
    
    // Account Details
    'account.phone': '电话号码',
    'account.country': '国家',
    'account.price': '价格',
    'account.status': '状态',
    'account.requestCode': '请求验证码',
    'account.enterCode': '输入验证码',
    'account.verificationCode': '验证码',
    
    // Settings
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.darkMode': '深色模式',
    'settings.lightMode': '浅色模式',
    'settings.notifications': '通知',
    
    // Common
    'common.back': '返回',
    'common.next': '下一个',
    'common.previous': '上一个',
    'common.close': '关闭',
    'common.save': '保存',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.warning': '警告',
    
    // Languages
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ru': 'Русский',
    'lang.ko': '한국어'
  },
  
  ru: {
    // Header & Navigation
    'app.title': 'Телеграм Нексус',
    'app.subtitle': 'Продвинутая платформа торговли аккаунтами Telegram',
    'nav.home': 'Главная',
    'nav.accounts': 'Аккаунты',
    'nav.settings': 'Настройки',
    'nav.profile': 'Профиль',
    
    // User Info
    'user.balance': 'Ваш баланс',
    'user.id': 'ID пользователя',
    'user.username': 'Имя пользователя',
    'user.purchases': 'Ваши покупки',
    'user.spent': 'Общая сумма',
    'user.memberSince': 'Участник с',
    
    // Main Menu
    'menu.buySingle': 'Купить один аккаунт',
    'menu.buyBulk': 'Купить оптом',
    'menu.myAccounts': 'Мои аккаунты',
    'menu.recharge': 'Пополнить баланс',
    
    // Countries
    'countries.title': 'Выберите страну',
    'countries.available': 'Доступно',
    'countries.accounts': 'аккаунтов',
    'countries.price': 'Цена',
    'countries.noAccounts': 'Нет доступных аккаунтов',
    
    // Purchase
    'purchase.confirm': 'Подтвердить покупку',
    'purchase.cancel': 'Отмена',
    'purchase.success': 'Покупка успешна!',
    'purchase.failed': 'Покупка не удалась',
    'purchase.insufficientBalance': 'Недостаточно средств',
    'purchase.selectQuantity': 'Выберите количество',
    'purchase.total': 'Итого',
    'purchase.downloadFile': 'Скачать файл',
    
    // Account Details
    'account.phone': 'Номер телефона',
    'account.country': 'Страна',
    'account.price': 'Цена',
    'account.status': 'Статус',
    'account.requestCode': 'Запросить код',
    'account.enterCode': 'Ввести код',
    'account.verificationCode': 'Код подтверждения',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.theme': 'Тема',
    'settings.darkMode': 'Тёмная тема',
    'settings.lightMode': 'Светлая тема',
    'settings.notifications': 'Уведомления',
    
    // Common
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Предыдущий',
    'common.close': 'Закрыть',
    'common.save': 'Сохранить',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.warning': 'Предупреждение',
    
    // Languages
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ru': 'Русский',
    'lang.ko': '한국어'
  },
  
  ko: {
    // Header & Navigation
    'app.title': '텔레그램 넥서스',
    'app.subtitle': '고급 텔레그램 계정 거래 플랫폼',
    'nav.home': '홈',
    'nav.accounts': '계정',
    'nav.settings': '설정',
    'nav.profile': '프로필',
    
    // User Info
    'user.balance': '잔액',
    'user.id': '사용자 ID',
    'user.username': '사용자명',
    'user.purchases': '구매 내역',
    'user.spent': '총 지출',
    'user.memberSince': '가입일',
    
    // Main Menu
    'menu.buySingle': '단일 계정 구매',
    'menu.buyBulk': '대량 구매',
    'menu.myAccounts': '내 계정',
    'menu.recharge': '잔액 충전',
    
    // Countries
    'countries.title': '국가 선택',
    'countries.available': '사용 가능',
    'countries.accounts': '계정',
    'countries.price': '가격',
    'countries.noAccounts': '사용 가능한 계정 없음',
    
    // Purchase
    'purchase.confirm': '구매 확인',
    'purchase.cancel': '취소',
    'purchase.success': '구매 성공!',
    'purchase.failed': '구매 실패',
    'purchase.insufficientBalance': '잔액 부족',
    'purchase.selectQuantity': '수량 선택',
    'purchase.total': '총액',
    'purchase.downloadFile': '파일 다운로드',
    
    // Account Details
    'account.phone': '전화번호',
    'account.country': '국가',
    'account.price': '가격',
    'account.status': '상태',
    'account.requestCode': '코드 요청',
    'account.enterCode': '코드 입력',
    'account.verificationCode': '인증 코드',
    
    // Settings
    'settings.title': '설정',
    'settings.language': '언어',
    'settings.theme': '테마',
    'settings.darkMode': '다크 모드',
    'settings.lightMode': '라이트 모드',
    'settings.notifications': '알림',
    
    // Common
    'common.back': '뒤로',
    'common.next': '다음',
    'common.previous': '이전',
    'common.close': '닫기',
    'common.save': '저장',
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.warning': '경고',
    
    // Languages
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ru': 'Русский',
    'lang.ko': '한국어'
  }
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

  return {
    t,
    language,
    setLanguage,
    isRTL: language === 'ar'
  };
};