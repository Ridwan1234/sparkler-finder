-- Allow admins to manage investment plans
CREATE POLICY "Admins can insert investment plans"
  ON public.investment_plans FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update investment plans"
  ON public.investment_plans FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete investment plans"
  ON public.investment_plans FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));