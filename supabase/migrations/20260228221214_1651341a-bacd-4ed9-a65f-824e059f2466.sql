
-- Fix search path for the function
CREATE OR REPLACE FUNCTION public.apply_first_deposit_bonus()
RETURNS TRIGGER AS $$
DECLARE
  bonus_percent NUMERIC;
  bonus_amount NUMERIC;
  previous_approved_count INTEGER;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
    SELECT COUNT(*) INTO previous_approved_count
    FROM public.deposits
    WHERE user_id = NEW.user_id
      AND status = 'approved'
      AND id <> NEW.id;

    IF previous_approved_count = 0 THEN
      SELECT CAST(value AS NUMERIC) INTO bonus_percent
      FROM public.site_settings
      WHERE key = 'first_deposit_bonus_percent';

      IF bonus_percent IS NOT NULL AND bonus_percent > 0 THEN
        bonus_amount := ROUND((NEW.amount * bonus_percent / 100)::NUMERIC, 2);

        INSERT INTO public.transactions (user_id, amount, type, description, reference_id)
        VALUES (
          NEW.user_id,
          bonus_amount,
          'bonus',
          'First deposit bonus (' || bonus_percent || '%)',
          NEW.id
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;
