export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName: string;
  lastName?: string;
  language: string;
  theme: 'light' | 'dark';
  balance: number;
  totalPurchases: number;
  totalSpent: number;
  joinedAt: Date;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  phonePrefix: string;
  price: number;
  available: number;
  isActive: boolean;
}

export interface Account {
  id: string;
  countryCode: string;
  phoneNumber: string;
  sessionData?: string;
  tdataData?: string;
  twoFactorPassword?: string;
  status: 'active' | 'inactive' | 'sold' | 'reserved';
  verified: boolean;
  addedAt: Date;
  addedBy: string;
}

export interface Purchase {
  id: string;
  userId: string;
  countryCode: string;
  accountId?: string;
  accountIds?: string[];
  type: 'single' | 'bulk';
  quantity: number;
  price: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export type Language = 'ar' | 'en' | 'zh' | 'ru' | 'ko';

export interface Translation {
  [key: string]: string;
}