import { createClient } from '@supabase/supabase-js';

// في التطبيق الحقيقي، ستأتي هذه من متغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DatabaseUser {
  id: string;
  telegram_id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  language: string;
  theme: string;
  balance: number;
  total_purchases: number;
  total_spent: number;
  is_premium: boolean;
  is_verified: boolean;
  is_admin: boolean;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCountry {
  id: string;
  code: string;
  name: string;
  name_ar: string;
  name_en: string;
  flag_emoji: string;
  phone_prefix: string;
  base_price: number;
  premium_price?: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  available_accounts?: number;
}

export interface DatabaseAccount {
  id: string;
  country_id: string;
  phone_number: string;
  session_data?: string;
  tdata_data?: any;
  two_factor_password?: string;
  verification_code?: string;
  status: 'active' | 'inactive' | 'sold' | 'reserved' | 'banned';
  quality_score: number;
  is_verified: boolean;
  is_premium: boolean;
  added_by?: string;
  sold_to?: string;
  reserved_until?: string;
  last_checked?: string;
  created_at: string;
  sold_at?: string;
  country?: DatabaseCountry;
}

export interface DatabasePurchase {
  id: string;
  user_id: string;
  country_id?: string;
  purchase_type: 'single' | 'bulk';
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_applied: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
  country?: DatabaseCountry;
  user?: DatabaseUser;
  purchase_items?: DatabaseAccount[];
}

export interface DatabaseChannel {
  id: string;
  name: string;
  description?: string;
  channel_type: 'public' | 'private' | 'support';
  avatar_url?: string;
  member_count: number;
  is_official: boolean;
  created_by?: string;
  created_at: string;
}

export interface DatabaseMessage {
  id: string;
  channel_id?: string;
  sender_id: string;
  reply_to?: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  content: string;
  media_url?: string;
  metadata?: any;
  is_pinned: boolean;
  edited_at?: string;
  created_at: string;
  sender?: DatabaseUser;
  channel?: DatabaseChannel;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export class DatabaseService {
  // Users
  static async getCurrentUser(telegramId: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error) return null;
    return data;
  }

  static async createUser(userData: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) return null;
    return data;
  }

  static async updateUser(telegramId: string, updates: Partial<DatabaseUser>): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('telegram_id', telegramId);
    
    return !error;
  }

  static async updateUserBalance(userId: string, amount: number, type: 'add' | 'subtract'): Promise<boolean> {
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();
    
    if (!user) return false;
    
    const newBalance = type === 'add' 
      ? user.balance + amount 
      : user.balance - amount;
    
    if (newBalance < 0) return false;
    
    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);
    
    return !error;
  }

  // Countries
  static async getActiveCountries(): Promise<DatabaseCountry[]> {
    const { data, error } = await supabase
      .from('countries')
      .select(`
        *,
        available_accounts:accounts(count)
      `)
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) return [];
    
    return data.map(country => ({
      ...country,
      available_accounts: country.available_accounts[0]?.count || 0
    }));
  }

  static async getCountryById(id: string): Promise<DatabaseCountry | null> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  // Accounts
  static async getAvailableAccounts(countryId: string): Promise<DatabaseAccount[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        country:countries(*)
      `)
      .eq('country_id', countryId)
      .eq('status', 'active')
      .eq('is_verified', true)
      .order('quality_score', { ascending: false });
    
    if (error) return [];
    return data;
  }

  static async reserveAccount(accountId: string, userId: string, minutes: number = 10): Promise<boolean> {
    const reserveUntil = new Date();
    reserveUntil.setMinutes(reserveUntil.getMinutes() + minutes);
    
    const { error } = await supabase
      .from('accounts')
      .update({
        status: 'reserved',
        sold_to: userId,
        reserved_until: reserveUntil.toISOString()
      })
      .eq('id', accountId)
      .eq('status', 'active');
    
    return !error;
  }

  static async sellAccount(accountId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('accounts')
      .update({
        status: 'sold',
        sold_to: userId,
        sold_at: new Date().toISOString()
      })
      .eq('id', accountId);
    
    return !error;
  }

  // Purchases
  static async createPurchase(purchaseData: Partial<DatabasePurchase>): Promise<DatabasePurchase | null> {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select(`
        *,
        country:countries(*),
        user:users(*)
      `)
      .single();
    
    if (error) return null;
    return data;
  }

  static async getUserPurchases(userId: string): Promise<DatabasePurchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        country:countries(*),
        purchase_items:purchase_items(
          account:accounts(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  }

  static async updatePurchaseStatus(purchaseId: string, status: string): Promise<boolean> {
    const updates: any = { status };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('purchases')
      .update(updates)
      .eq('id', purchaseId);
    
    return !error;
  }

  // Messages & Channels
  static async getChannels(): Promise<DatabaseChannel[]> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('is_official', { ascending: false })
      .order('member_count', { ascending: false });
    
    if (error) return [];
    return data;
  }

  static async getChannelMessages(channelId: string, limit: number = 50): Promise<DatabaseMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(telegram_id, username, first_name, avatar_url),
        channel:channels(name)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) return [];
    return data.reverse(); // Show oldest first
  }

  static async sendMessage(messageData: Partial<DatabaseMessage>): Promise<DatabaseMessage | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        sender:users(telegram_id, username, first_name, avatar_url),
        channel:channels(name)
      `)
      .single();
    
    if (error) return null;
    return data;
  }

  // Notifications
  static async getUserNotifications(userId: string): Promise<DatabaseNotification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) return [];
    return data;
  }

  static async createNotification(notificationData: Partial<DatabaseNotification>): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert([notificationData]);
    
    return !error;
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    return !error;
  }

  // Statistics
  static async getDashboardStats(userId?: string) {
    const [
      { count: totalUsers },
      { count: totalPurchases },
      { data: totalRevenue },
      { count: activeAccounts }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('purchases').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('purchases').select('total_price').eq('status', 'completed'),
      supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('status', 'active')
    ]);

    const revenue = totalRevenue?.reduce((sum, purchase) => sum + purchase.total_price, 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalPurchases: totalPurchases || 0,
      totalRevenue: revenue,
      activeAccounts: activeAccounts || 0
    };
  }
}