-- Insert some sample products for testing
INSERT INTO public.products (name, description, price, quantity, category, seller_name, seller_phone, seller_prompt_pay, user_id)
VALUES 
  ('iPhone 15 Pro', 'มือถือ iPhone 15 Pro สีดำ 128GB', 45000, 5, 'Electronics', 'ร้านมือถือดี', '081-234-5678', '081-234-5678', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('Samsung Galaxy S24', 'มือถือ Samsung Galaxy S24 สีเงิน 256GB', 38000, 3, 'Electronics', 'ร้านมือถือดี', '081-234-5678', '081-234-5678', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('MacBook Air M2', 'โน๊ตบุ๊ค MacBook Air M2 สีเงิน', 42000, 2, 'Computers', 'ร้านคอมพิวเตอร์', '082-345-6789', '082-345-6789', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('iPad Pro 11"', 'แท็บเล็ต iPad Pro 11 นิ้ว Wi-Fi 128GB', 28000, 4, 'Electronics', 'ร้านแอปเปิล', '083-456-7890', '083-456-7890', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
ON CONFLICT (id) DO NOTHING;