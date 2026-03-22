
-- Add reference_number column to deposits
ALTER TABLE public.deposits ADD COLUMN reference_number text;

-- Add reference_number column to withdrawals
ALTER TABLE public.withdrawals ADD COLUMN reference_number text;

-- Add reference_number column to transactions
ALTER TABLE public.transactions ADD COLUMN reference_number text;

-- Create function to generate reference numbers
CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  prefix TEXT;
  seq_num TEXT;
BEGIN
  CASE TG_TABLE_NAME
    WHEN 'deposits' THEN prefix := 'DEP';
    WHEN 'withdrawals' THEN prefix := 'WDR';
    WHEN 'transactions' THEN prefix := 'TXN';
    ELSE prefix := 'REF';
  END CASE;
  
  seq_num := UPPER(SUBSTRING(md5(NEW.id::text || extract(epoch from now())::text) FROM 1 FOR 8));
  NEW.reference_number := prefix || '-' || seq_num;
  
  RETURN NEW;
END;
$$;

-- Create triggers for auto-generating reference numbers
CREATE TRIGGER set_deposit_reference
  BEFORE INSERT ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_reference_number();

CREATE TRIGGER set_withdrawal_reference
  BEFORE INSERT ON public.withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_reference_number();

CREATE TRIGGER set_transaction_reference
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_reference_number();

-- Backfill existing records
UPDATE public.deposits SET reference_number = 'DEP-' || UPPER(SUBSTRING(md5(id::text) FROM 1 FOR 8)) WHERE reference_number IS NULL;
UPDATE public.withdrawals SET reference_number = 'WDR-' || UPPER(SUBSTRING(md5(id::text) FROM 1 FOR 8)) WHERE reference_number IS NULL;
UPDATE public.transactions SET reference_number = 'TXN-' || UPPER(SUBSTRING(md5(id::text) FROM 1 FOR 8)) WHERE reference_number IS NULL;
