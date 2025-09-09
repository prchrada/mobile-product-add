
// Temporary local types until Supabase types auto-update
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  user_type: string;
  prompt_pay?: string | null;
  line_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Temporary local types until Supabase types auto-update
export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInsert {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity?: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductUpdate {
  id?: string;
  user_id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  quantity?: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

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
