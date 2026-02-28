
-- Function to apply first deposit bonus when a deposit is approved
CREATE OR REPLACE FUNCTION public.apply_first_deposit_bonus()
RETURNS TRIGGER AS $$
DECLARE
  bonus_percent NUMERIC;
  bonus_amount NUMERIC;
  previous_approved_count INTEGER;
BEGIN
  -- Only trigger on status change to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
    -- Check if this is the user's first approved deposit
    SELECT COUNT(*) INTO previous_approved_count
    FROM public.deposits
    WHERE user_id = NEW.user_id
      AND status = 'approved'
      AND id <> NEW.id;

    IF previous_approved_count = 0 THEN
      -- Get the bonus percentage from site_settings
      SELECT CAST(value AS NUMERIC) INTO bonus_percent
      FROM public.site_settings
      WHERE key = 'first_deposit_bonus_percent';

      IF bonus_percent IS NOT NULL AND bonus_percent > 0 THEN
        bonus_amount := ROUND((NEW.amount * bonus_percent / 100)::NUMERIC, 2);

        -- Insert a bonus transaction
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on deposits table
DROP TRIGGER IF EXISTS trigger_first_deposit_bonus ON public.deposits;
CREATE TRIGGER trigger_first_deposit_bonus
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_first_deposit_bonus();
