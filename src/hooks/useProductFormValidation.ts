
import { ProductFormData } from '@/types/product';

export const useProductFormValidation = (isEditing: boolean = false) => {
  const validateForm = (formData: ProductFormData): Partial<ProductFormData> => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อสินค้า';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียด';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'กรุณากรอกจำนวนที่ถูกต้อง';
    }

    if (!formData.sellerName.trim()) {
      newErrors.sellerName = 'กรุณากรอกชื่อผู้ขาย';
    }

    if (!formData.sellerPhone.trim()) {
      newErrors.sellerPhone = 'กรุณากรอกเบอร์โทรผู้ขาย';
    } else if (!/^[0-9]{10}$/.test(formData.sellerPhone.replace(/[- ]/g, ''))) {
      newErrors.sellerPhone = 'กรุณากรอกเบอร์โทรให้ถูกต้อง';
    }

    if (!formData.sellerPromptPay.trim()) {
      newErrors.sellerPromptPay = 'กรุณากรอกพร้อมเพย์ผู้ขาย';
    }

    if (!formData.sellerLineId.trim()) {
      newErrors.sellerLineId = 'กรุณากรอก Line ID ผู้ขาย';
    }

    return newErrors;
  };

  return { validateForm };
};
