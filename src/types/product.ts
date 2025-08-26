
// Use Supabase types for consistency
export type { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  quantity: string;
  imageUrl?: string;
  sellerName: string;
  sellerPhone: string;
  sellerPromptPay: string;
  sellerLineId: string;
  sellerPassword: string; // For seller verification
}
