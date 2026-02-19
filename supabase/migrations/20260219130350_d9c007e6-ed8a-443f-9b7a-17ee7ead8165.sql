
CREATE TABLE public.page_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  page_label text NOT NULL,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page SEO" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admins can insert page SEO" ON public.page_seo FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update page SEO" ON public.page_seo FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete page SEO" ON public.page_seo FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_seo_updated_at BEFORE UPDATE ON public.page_seo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed fixed pages
INSERT INTO public.page_seo (page_key, page_label) VALUES
  ('home', 'Home'),
  ('faq', 'FAQ'),
  ('contact', 'Contact Us'),
  ('shipping', 'Shipping Info'),
  ('returns', 'Returns'),
  ('privacy', 'Privacy Policy'),
  ('cookies', 'Cookie Policy'),
  ('terms', 'Terms of Service'),
  ('warranty', 'Warranty');
