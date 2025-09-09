-- Insert some sample products for testing with correct schema
INSERT INTO public.products (name, description, price, quantity, category, user_id)
VALUES 
  ('iPhone 15 Pro', 'มือถือ iPhone 15 Pro สีดำ 128GB ใหม่ป้ายแดง พร้อมใช้งาน', 45000, 5, 'Electronics', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('Samsung Galaxy S24', 'มือถือ Samsung Galaxy S24 สีเงิน 256GB สภาพใหม่มาก', 38000, 3, 'Electronics', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('MacBook Air M2', 'โน๊ตบุ๊ค MacBook Air M2 13" สีเงิน SSD 256GB RAM 8GB', 42000, 2, 'Computers', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('iPad Pro 11"', 'แท็บเล็ต iPad Pro 11 นิ้ว Wi-Fi 128GB สี Space Gray', 28000, 4, 'Electronics', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('Nike Air Force 1', 'รองเท้าผ้าใบ Nike Air Force 1 สีขาว ไซส์ 42 ของแท้', 3500, 10, 'Fashion', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('Canon EOS R6', 'กล้อง Canon EOS R6 Body อย่างเดียว สภาพสวยมาก', 65000, 1, 'Electronics', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
ON CONFLICT DO NOTHING;