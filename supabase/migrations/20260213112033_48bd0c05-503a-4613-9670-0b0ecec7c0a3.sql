
-- Drop the existing SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Recreate with explicit authentication check
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);
