CREATE TABLE public.spot_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_symbol TEXT NOT NULL CHECK (coin_symbol IN ('BTC', 'ETH', 'BNB')),
  quantity NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  avg_buy_price NUMERIC NOT NULL DEFAULT 0 CHECK (avg_buy_price >= 0),
  invested_usd NUMERIC NOT NULL DEFAULT 0 CHECK (invested_usd >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, coin_symbol)
);

CREATE TABLE public.spot_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_symbol TEXT NOT NULL CHECK (coin_symbol IN ('BTC', 'ETH', 'BNB')),
  order_type TEXT NOT NULL CHECK (order_type IN ('buy', 'sell')),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  price_usd NUMERIC NOT NULL CHECK (price_usd > 0),
  total_usd NUMERIC NOT NULL CHECK (total_usd > 0),
  realized_pnl NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spot_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spot_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spot positions"
  ON public.spot_positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spot positions"
  ON public.spot_positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spot positions"
  ON public.spot_positions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own spot positions"
  ON public.spot_positions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own spot orders"
  ON public.spot_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spot orders"
  ON public.spot_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all spot positions"
  ON public.spot_positions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all spot orders"
  ON public.spot_orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_spot_positions_updated_at
  BEFORE UPDATE ON public.spot_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
