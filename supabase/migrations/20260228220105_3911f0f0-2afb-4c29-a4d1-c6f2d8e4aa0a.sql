
-- Create wallet_addresses table for admin-managed deposit wallets
CREATE TABLE public.wallet_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'BTC',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Anyone can view active wallet addresses
CREATE POLICY "Anyone can view active wallet addresses"
  ON public.wallet_addresses
  FOR SELECT
  USING (true);

-- Admins can manage wallet addresses
CREATE POLICY "Admins can insert wallet addresses"
  ON public.wallet_addresses
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update wallet addresses"
  ON public.wallet_addresses
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete wallet addresses"
  ON public.wallet_addresses
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));
