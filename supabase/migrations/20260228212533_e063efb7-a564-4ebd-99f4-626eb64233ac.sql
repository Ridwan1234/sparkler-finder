
CREATE POLICY "Admins can view all investments"
ON public.investments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
