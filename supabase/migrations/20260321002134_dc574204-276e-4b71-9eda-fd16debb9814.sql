
DROP TRIGGER IF EXISTS trigger_first_deposit_bonus ON public.deposits;

CREATE TRIGGER trigger_first_deposit_bonus
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_first_deposit_bonus();
