-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone_number TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  language TEXT DEFAULT 'ar',
  theme TEXT DEFAULT 'light',
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_purchases INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  is_premium BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  flag_emoji TEXT NOT NULL,
  phone_prefix TEXT NOT NULL,
  base_price DECIMAL(8,2) NOT NULL,
  premium_price DECIMAL(8,2),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id),
  phone_number TEXT UNIQUE NOT NULL,
  session_data TEXT,
  tdata_data JSONB,
  two_factor_password TEXT,
  verification_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'reserved', 'banned')),
  quality_score INTEGER DEFAULT 100,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  added_by UUID REFERENCES users(id),
  sold_to UUID REFERENCES users(id),
  reserved_until TIMESTAMP WITH TIME ZONE,
  last_checked TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sold_at TIMESTAMP WITH TIME ZONE
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  country_id UUID REFERENCES countries(id),
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('single', 'bulk')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(8,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'balance',
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Purchase items (for bulk purchases)
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases(id) NOT NULL,
  account_id UUID REFERENCES accounts(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User pricing (custom pricing for specific users)
CREATE TABLE IF NOT EXISTS user_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  country_id UUID REFERENCES countries(id) NOT NULL,
  custom_price DECIMAL(8,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, country_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'purchase', 'refund', 'bonus')),
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  reference_id TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat channels/groups
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  channel_type TEXT DEFAULT 'public' CHECK (channel_type IN ('public', 'private', 'support')),
  avatar_url TEXT,
  member_count INTEGER DEFAULT 0,
  is_official BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Channel members
CREATE TABLE IF NOT EXISTS channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  sender_id UUID REFERENCES users(id) NOT NULL,
  reply_to UUID REFERENCES messages(id),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  content TEXT NOT NULL,
  media_url TEXT,
  metadata JSONB,
  is_pinned BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_country ON accounts(country_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (telegram_id = current_setting('app.current_user_telegram_id', true));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (telegram_id = current_setting('app.current_user_telegram_id', true));

-- Initial data
INSERT INTO countries (code, name, name_ar, name_en, flag_emoji, phone_prefix, base_price, premium_price) VALUES
('SA', 'المملكة العربية السعودية', 'المملكة العربية السعودية', 'Saudi Arabia', '🇸🇦', '+966', 2.50, 2.00),
('US', 'الولايات المتحدة الأمريكية', 'الولايات المتحدة الأمريكية', 'United States', '🇺🇸', '+1', 1.80, 1.50),
('GB', 'المملكة المتحدة', 'المملكة المتحدة', 'United Kingdom', '🇬🇧', '+44', 2.20, 1.90),
('DE', 'ألمانيا', 'ألمانيا', 'Germany', '🇩🇪', '+49', 2.00, 1.70),
('FR', 'فرنسا', 'فرنسا', 'France', '🇫🇷', '+33', 1.90, 1.60),
('CN', 'الصين', 'الصين', 'China', '🇨🇳', '+86', 3.00, 2.50),
('RU', 'روسيا', 'روسيا', 'Russia', '🇷🇺', '+7', 1.50, 1.20),
('KR', 'كوريا الجنوبية', 'كوريا الجنوبية', 'South Korea', '🇰🇷', '+82', 2.80, 2.30),
('JP', 'اليابان', 'اليابان', 'Japan', '🇯🇵', '+81', 3.50, 3.00),
('AE', 'الإمارات العربية المتحدة', 'الإمارات العربية المتحدة', 'United Arab Emirates', '🇦🇪', '+971', 2.30, 2.00),
('EG', 'مصر', 'مصر', 'Egypt', '🇪🇬', '+20', 1.20, 1.00),
('TR', 'تركيا', 'تركيا', 'Turkey', '🇹🇷', '+90', 1.40, 1.20),
('IN', 'الهند', 'الهند', 'India', '🇮🇳', '+91', 0.80, 0.60),
('BD', 'بنغلاديش', 'بنغلاديش', 'Bangladesh', '🇧🇩', '+880', 0.70, 0.50),
('PK', 'باكستان', 'باكستان', 'Pakistan', '🇵🇰', '+92', 0.90, 0.70)
ON CONFLICT (code) DO NOTHING;

-- Sample users
INSERT INTO users (telegram_id, username, first_name, last_name, balance, is_premium, is_verified) VALUES
('123456789', 'admin_user', 'أحمد', 'المدير', 1000.00, true, true),
('987654321', 'test_user', 'محمد', 'المختبر', 150.50, false, true),
('456789123', 'premium_user', 'فاطمة', 'العميلة', 500.00, true, true)
ON CONFLICT (telegram_id) DO NOTHING;

-- Sample channels
INSERT INTO channels (name, description, channel_type, is_official) VALUES
('📢 الإعلانات الرسمية', 'قناة الإعلانات والأخبار المهمة', 'public', true),
('💬 الدعم الفني', 'قناة الدعم الفني والمساعدة', 'support', true),
('🛒 عروض خاصة', 'عروض وخصومات حصرية للعملاء المميزين', 'private', true)
ON CONFLICT DO NOTHING;

-- System settings
INSERT INTO system_settings (key, value, description) VALUES
('site_name', 'Telegram Nexus', 'اسم الموقع'),
('maintenance_mode', 'false', 'وضع الصيانة'),
('min_balance_purchase', '1.00', 'الحد الأدنى للرصيد للشراء'),
('max_bulk_quantity', '100', 'الحد الأقصى للشراء بالجملة'),
('support_telegram', '@TelegramNexusSupport', 'حساب الدعم الفني')
ON CONFLICT (key) DO NOTHING;