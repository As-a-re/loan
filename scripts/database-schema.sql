-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_loans_given INTEGER DEFAULT 0,
  total_loans_received INTEGER DEFAULT 0,
  total_amount_lent DECIMAL(10,2) DEFAULT 0.00,
  total_amount_borrowed DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings_groups table
CREATE TABLE IF NOT EXISTS savings_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0.00,
  contribution_frequency TEXT NOT NULL CHECK (contribution_frequency IN ('weekly', 'bi-weekly', 'monthly')),
  contribution_amount DECIMAL(10,2) NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE,
  UNIQUE(group_id, user_id)
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES savings_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  contribution_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan_offers table
CREATE TABLE IF NOT EXISTS loan_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  repayment_period INTEGER NOT NULL, -- in months
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan_requests table
CREATE TABLE IF NOT EXISTS loan_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  borrower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  purpose TEXT NOT NULL,
  repayment_plan TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lender_id UUID REFERENCES profiles(id),
  borrower_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  repayment_period INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'defaulted')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan_payments table
CREATE TABLE IF NOT EXISTS loan_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID REFERENCES profiles(id),
  participant2_id UUID REFERENCES profiles(id),
  loan_offer_id UUID REFERENCES loan_offers(id),
  loan_request_id UUID REFERENCES loan_requests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id, loan_offer_id),
  UNIQUE(participant1_id, participant2_id, loan_request_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('loan_offer', 'loan_request', 'payment_reminder', 'group_activity')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view all savings groups" ON savings_groups FOR SELECT TO authenticated;
CREATE POLICY "Users can create savings groups" ON savings_groups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view group members" ON group_members FOR SELECT TO authenticated;
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all loan offers" ON loan_offers FOR SELECT TO authenticated;
CREATE POLICY "Users can create their own loan offers" ON loan_offers FOR INSERT WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Users can view all loan requests" ON loan_requests FOR SELECT TO authenticated;
CREATE POLICY "Users can create their own loan requests" ON loan_requests FOR INSERT WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE id = conversation_id 
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE id = conversation_id 
    AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
  )
);

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
