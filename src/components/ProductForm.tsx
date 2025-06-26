
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData, Product } from '@/types/product';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProductBasicInfoForm from './forms/ProductBasicInfoForm';
import SellerInfoForm from './forms/SellerInfoForm';
import { useProductFormValidation } from '@/hooks/useProductFormValidation';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isEditing?: boolean;
}

const ProductForm = ({ initialData, onSubmit, isEditing = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const { validateForm } = useProductFormValidation(isEditing);
  
  // Initialize form data with default values or existing product data
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || 'ทั่วไป',
    quantity: initialData?.quantity?.toString() || '',
    imageUrl: initialData?.imageUrl || '',
    sellerName: initialData?.sellerName || '',
    sellerPhone: initialData?.sellerPhone || '',
    sellerPromptPay: initialData?.sellerPromptPay || '',
    sellerLineId: initialData?.sellerLineId || '',
    sellerPassword: '', // Always empty for security
  });

  // Track validation errors for each form field
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data using the validation hook
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    // Only submit if no validation errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Handle input changes and clear errors
  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (imageUrl: string) => {
    handleInputChange('imageUrl', imageUrl);
  };

  // Handle image upload errors
  const handleImageError = (error: string) => {
    toast({
      title: "เกิดข้อผิดพลาด",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with back button and title */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h1>
        </div>

        {/* Main form card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Plus className="w-5 h-5 mr-2 text-green-600" />
              ข้อมูลสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product basic information form */}
              <ProductBasicInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                onImageError={handleImageError}
              />

              {/* Seller information form */}
              <SellerInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                isEditing={isEditing}
              />

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
                size="lg"
              >
                {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
