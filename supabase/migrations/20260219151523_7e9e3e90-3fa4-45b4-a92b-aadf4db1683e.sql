
CREATE TABLE public.custom_code (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL UNIQUE CHECK (location IN ('head', 'body_start', 'body_end')),
  code text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_code ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active custom code" ON public.custom_code FOR SELECT USING (true);
CREATE POLICY "Admins can update custom code" ON public.custom_code FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert custom code" ON public.custom_code FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete custom code" ON public.custom_code FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.custom_code (location, code) VALUES
  ('head', ''),
  ('body_start', ''),
  ('body_end', '');
