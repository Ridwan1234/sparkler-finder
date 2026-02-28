
-- Investment plans table (static data)
CREATE TABLE public.investment_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  min_amount numeric NOT NULL,
  max_amount numeric NOT NULL,
  roi_percentage numeric NOT NULL,
  duration_days integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view investment plans"
  ON public.investment_plans FOR SELECT
  USING (true);

-- User investments
CREATE TABLE public.investments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.investment_plans(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments"
  ON public.investments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deposits
CREATE TABLE public.deposits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  wallet_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposits"
  ON public.deposits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits"
  ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals
CREATE TABLE public.withdrawals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  wallet_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals"
  ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions (unified ledger)
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  amount numeric NOT NULL,
  description text,
  reference_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed investment plans
INSERT INTO public.investment_plans (name, min_amount, max_amount, roi_percentage, duration_days) VALUES
  ('Standard', 100, 999, 5, 30),
  ('Silver', 1000, 4999, 8, 30),
  ('Golden', 5000, 19999, 12, 30),
  ('Diamond', 20000, 100000, 18, 30);
