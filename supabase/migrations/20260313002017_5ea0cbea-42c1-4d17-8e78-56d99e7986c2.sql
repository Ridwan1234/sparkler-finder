-- Add avatar_url column to testimonials
ALTER TABLE public.testimonials ADD COLUMN avatar_url text;

-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-avatars', 'testimonial-avatars', true);

-- Allow anyone to view files
CREATE POLICY "Anyone can view testimonial avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-avatars');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload testimonial avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-avatars' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to update
CREATE POLICY "Admins can update testimonial avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonial-avatars' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete testimonial avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-avatars' AND public.has_role(auth.uid(), 'admin'));