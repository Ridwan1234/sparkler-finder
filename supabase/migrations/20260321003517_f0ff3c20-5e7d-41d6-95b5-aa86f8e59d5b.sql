
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    SUBSTRING(md5(NEW.id::text) FROM 1 FOR 8),
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'referred_by', ''), '')
  );
  RETURN NEW;
END;
$$;
