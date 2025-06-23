
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
  sellerPhone: string;
  sellerPromptPay: string;
  sellerLineId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  quantity: string;
  imageUrl?: string;
  sellerPhone: string;
  sellerPromptPay: string;
  sellerLineId: string;
}
