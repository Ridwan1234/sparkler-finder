CREATE OR REPLACE FUNCTION public.apply_first_deposit_bonus()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  bonus_percent NUMERIC;
  bonus_amount NUMERIC;
  previous_approved_count INTEGER;
  referral_percent NUMERIC;
  referral_amount NUMERIC;
  referrer_code TEXT;
  referrer_user_id UUID;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved') THEN
    SELECT COUNT(*) INTO previous_approved_count
    FROM public.deposits
    WHERE user_id = NEW.user_id
      AND status = 'approved'
      AND id <> NEW.id;

    IF previous_approved_count = 0 THEN
      -- First deposit bonus
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

      -- Referral bonus for the referrer
      SELECT referred_by INTO referrer_code
      FROM public.profiles
      WHERE user_id = NEW.user_id;

      IF referrer_code IS NOT NULL AND referrer_code <> '' THEN
        SELECT user_id INTO referrer_user_id
        FROM public.profiles
        WHERE referral_code = referrer_code;

        IF referrer_user_id IS NOT NULL THEN
          SELECT CAST(value AS NUMERIC) INTO referral_percent
          FROM public.site_settings
          WHERE key = 'referral_bonus_percent';

          IF referral_percent IS NOT NULL AND referral_percent > 0 THEN
            referral_amount := ROUND((NEW.amount * referral_percent / 100)::NUMERIC, 2);

            INSERT INTO public.transactions (user_id, amount, type, description, reference_id)
            VALUES (
              referrer_user_id,
              referral_amount,
              'referral_bonus',
              'Referral bonus (' || referral_percent || '%) from referred user deposit',
              NEW.id
            );
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;