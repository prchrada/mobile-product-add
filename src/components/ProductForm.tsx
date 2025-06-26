
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData, Product } from '@/types/product';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isEditing?: boolean;
}

const ProductForm = ({ initialData, onSubmit, isEditing = false }: ProductFormProps) => {
  const navigate = useNavigate();
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
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const validateForm = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

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

  const handleImageChange = (imageUrl: string) => {
    handleInputChange('imageUrl', imageUrl);
  };

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
        {/* Header */}
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

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Plus className="w-5 h-5 mr-2 text-green-600" />
              ข้อมูลสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                value={formData.imageUrl}
                onChange={handleImageChange}
                onError={handleImageError}
              />

              <div>
                <Label htmlFor="name">ชื่อสินค้า *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="กรอกชื่อสินค้า"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">รายละเอียด *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="กรอกรายละเอียดสินค้า"
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="price">ราคา (บาท) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="quantity">จำนวน *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              {/* Seller Information Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-3">ข้อมูลผู้ขาย</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sellerName">ชื่อผู้ขาย *</Label>
                    <Input
                      id="sellerName"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange('sellerName', e.target.value)}
                      placeholder="กรอกชื่อผู้ขาย"
                      className={errors.sellerName ? 'border-red-500' : ''}
                    />
                    {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sellerPhone">เบอร์โทรผู้ขาย *</Label>
                    <Input
                      id="sellerPhone"
                      value={formData.sellerPhone}
                      onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                      placeholder="08xxxxxxxx"
                      className={errors.sellerPhone ? 'border-red-500' : ''}
                    />
                    {errors.sellerPhone && <p className="text-red-500 text-sm mt-1">{errors.sellerPhone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sellerPromptPay">พร้อมเพย์ผู้ขาย *</Label>
                    <Input
                      id="sellerPromptPay"
                      value={formData.sellerPromptPay}
                      onChange={(e) => handleInputChange('sellerPromptPay', e.target.value)}
                      placeholder="เบอร์โทรหรือเลขบัตรประชาชน"
                      className={errors.sellerPromptPay ? 'border-red-500' : ''}
                    />
                    {errors.sellerPromptPay && <p className="text-red-500 text-sm mt-1">{errors.sellerPromptPay}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sellerLineId">Line ID ผู้ขาย *</Label>
                    <Input
                      id="sellerLineId"
                      value={formData.sellerLineId}
                      onChange={(e) => handleInputChange('sellerLineId', e.target.value)}
                      placeholder="@lineid หรือ line.me/ti/p/xxxx"
                      className={errors.sellerLineId ? 'border-red-500' : ''}
                    />
                    {errors.sellerLineId && <p className="text-red-500 text-sm mt-1">{errors.sellerLineId}</p>}
                  </div>
                </div>
              </div>

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
