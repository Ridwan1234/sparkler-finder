
-- Add features and popular flag to investment_plans for dynamic landing page
ALTER TABLE public.investment_plans
  ADD COLUMN features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN is_popular boolean NOT NULL DEFAULT false;

-- Create site_settings table for dynamic config like first deposit bonus
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed first deposit bonus
INSERT INTO public.site_settings (key, value) VALUES ('first_deposit_bonus_percent', '10');

-- Update existing plans with features and popular flag
UPDATE public.investment_plans SET
  features = ARRAY['Daily Compounding', '24/7 Support', 'Instant Withdrawal'],
  is_popular = false
WHERE name = 'Standard';

UPDATE public.investment_plans SET
  features = ARRAY['Daily Compounding', 'Priority Support', 'Instant Withdrawal', 'Referral Bonus'],
  is_popular = false
WHERE name = 'Silver';

UPDATE public.investment_plans SET
  features = ARRAY['Daily Compounding', 'VIP Support', 'Instant Withdrawal', 'Referral Bonus', 'Dedicated Manager'],
  is_popular = true
WHERE name = 'Golden';

UPDATE public.investment_plans SET
  features = ARRAY['Daily Compounding', 'VIP Support', 'Priority Withdrawal', 'Referral Bonus', 'Dedicated Manager', 'Custom Strategy'],
  is_popular = false
WHERE name = 'Diamond';
