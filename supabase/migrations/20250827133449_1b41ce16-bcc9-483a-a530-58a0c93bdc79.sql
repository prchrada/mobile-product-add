-- Security hardening migration
-- Fix database function search paths and enhance security

-- Update the handle_new_user function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone, user_type, prompt_pay, line_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'ผู้ใช้ใหม่'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer'),
    NEW.raw_user_meta_data->>'prompt_pay',
    NEW.raw_user_meta_data->>'line_id'
  );
  RETURN NEW;
END;
$$;

-- Create a secure function to get current user profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE(
  user_id uuid,
  name text,
  phone text,
  user_type text,
  prompt_pay text,
  line_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT p.user_id, p.name, p.phone, p.user_type, p.prompt_pay, p.line_id
  FROM public.profiles p
  WHERE p.user_id = auth.uid();
$$;

-- Enhance RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- More restrictive profile policies
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure products policies are secure
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

-- More secure product policies
CREATE POLICY "Authenticated users can view products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
ON public.products
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
ON public.products
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log profile changes (in a real app, you'd log to an audit table)
  RAISE LOG 'Profile changed for user: %', NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_profile_updates
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();