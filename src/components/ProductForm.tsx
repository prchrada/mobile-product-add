
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData, Product } from '@/types/product';
import { ArrowLeft, Plus, Package, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProductBasicInfoForm from './forms/ProductBasicInfoForm';
import { useProductFormValidation } from '@/hooks/useProductFormValidation';
import { getCurrentUser } from '@/utils/userAuth';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isEditing?: boolean;
}

const ProductForm = ({ initialData, onSubmit, isEditing = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const { validateForm } = useProductFormValidation(isEditing);
  const currentUser = getCurrentUser();
  
  // Initialize form data with default values or existing product data
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || 'ทั่วไป',
    quantity: initialData?.quantity?.toString() || '',
    imageUrl: initialData?.image_url || '',
    sellerName: currentUser?.name || '',
    sellerPhone: currentUser?.phone || '',
    sellerPromptPay: currentUser?.promptPay || '',
    sellerLineId: currentUser?.lineId || '',
    sellerPassword: '', // No longer needed
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with back button and title */}
        <div className="flex items-center mb-8 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-3 hover:bg-white/70 rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h1>
        </div>

        {/* Main form card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-6">
            <CardTitle className="flex items-center text-xl justify-center">
              <Package className="w-6 h-6 mr-3" />
              ข้อมูลสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product basic information form */}
              <ProductBasicInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                onImageError={handleImageError}
              />

              {/* Show seller info (read-only) */}
              {currentUser && (
                <div className="pt-6 border-t border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    ข้อมูลผู้ขาย
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">ชื่อ:</span>
                        <p className="font-medium text-gray-800">{currentUser.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">เบอร์:</span>
                        <p className="font-medium text-gray-800">{currentUser.phone}</p>
                      </div>
                      {currentUser.promptPay && (
                        <div>
                          <span className="text-gray-600">พร้อมเพย์:</span>
                          <p className="font-medium text-gray-800">{currentUser.promptPay}</p>
                        </div>
                      )}
                      {currentUser.lineId && (
                        <div>
                          <span className="text-gray-600">Line ID:</span>
                          <p className="font-medium text-gray-800">{currentUser.lineId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
