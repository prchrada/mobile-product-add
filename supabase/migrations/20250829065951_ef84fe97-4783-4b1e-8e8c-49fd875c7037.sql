-- Create a function that returns products with seller display names without exposing user_id
CREATE OR REPLACE FUNCTION public.get_products_for_sale()
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  quantity INTEGER,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  seller_display_name TEXT,
  seller_id TEXT  -- Anonymous seller identifier instead of user_id
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
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
    COALESCE(prof.seller_display_name, 'ร้านค้าไม่ระบุชื่อ') as seller_display_name,
    CONCAT('seller_', SUBSTRING(MD5(p.user_id::text), 1, 8)) as seller_id
  FROM public.products p
  LEFT JOIN public.profiles prof ON p.user_id = prof.user_id
  WHERE p.quantity > 0;  -- Only show available products
$$;

-- Update the search path for existing functions to be secure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone, user_type, prompt_pay, line_id, seller_display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'ผู้ใช้ใหม่'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer'),
    NEW.raw_user_meta_data->>'prompt_pay',
    NEW.raw_user_meta_data->>'line_id',
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer') = 'seller' 
      THEN 'ร้านค้า ' || SUBSTRING(NEW.id::text, 1, 8)
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;