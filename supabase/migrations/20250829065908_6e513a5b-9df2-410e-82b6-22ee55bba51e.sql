-- Add seller display name to profiles table
ALTER TABLE public.profiles 
ADD COLUMN seller_display_name TEXT;

-- Update existing profiles with a default seller display name
UPDATE public.profiles 
SET seller_display_name = 'ร้านค้า ' || SUBSTRING(id::text, 1, 8)
WHERE user_type = 'seller' AND seller_display_name IS NULL;

-- Create a security definer function to get seller display info without exposing user_id
CREATE OR REPLACE FUNCTION public.get_seller_display_info(seller_user_id UUID)
RETURNS TABLE(display_name TEXT) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT seller_display_name
  FROM public.profiles 
  WHERE user_id = seller_user_id AND user_type = 'seller';
$$;

-- Create a view for products with seller display names (without exposing user_id)
CREATE OR REPLACE VIEW public.products_with_seller AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.quantity,
  p.category,
  p.image_url,
  p.created_at,
  p.updated_at,
  CASE 
    WHEN auth.uid() = p.user_id THEN p.user_id  -- Show user_id only to owner
    ELSE NULL                                   -- Hide user_id from others
  END as user_id,
  prof.seller_display_name
FROM public.products p
LEFT JOIN public.profiles prof ON p.user_id = prof.user_id
WHERE p.quantity > 0;  -- Only show available products

-- Enable RLS on the view
ALTER VIEW public.products_with_seller SET (security_barrier = true);

-- Create RLS policy for the view
CREATE POLICY "Authenticated users can view products with seller info" 
ON public.products_with_seller
FOR SELECT 
TO authenticated
USING (true);