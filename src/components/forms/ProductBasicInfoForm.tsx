
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from '@/types/product';
import ImageUpload from '../ImageUpload';
import { Package, FileText, DollarSign, Hash } from 'lucide-react';

interface ProductBasicInfoFormProps {
  formData: ProductFormData;
  errors: Partial<ProductFormData>;
  onInputChange: (field: keyof ProductFormData, value: string) => void;
  onImageChange: (imageUrl: string) => void;
  onImageError: (error: string) => void;
}

const ProductBasicInfoForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  onImageChange, 
  onImageError 
}: ProductBasicInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <ImageUpload
          value={formData.imageUrl}
          onChange={onImageChange}
          onError={onImageError}
        />
      </div>

      <div>
        <Label htmlFor="name" className="text-gray-700 font-medium flex items-center mb-2">
          <Package className="w-4 h-4 mr-2 text-purple-500" />
          ชื่อสินค้า *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="กรอกชื่อสินค้า"
          className={`rounded-xl border-2 transition-colors ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-700 font-medium flex items-center mb-2">
          <FileText className="w-4 h-4 mr-2 text-purple-500" />
          รายละเอียด *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="กรอกรายละเอียดสินค้า"
          rows={4}
          className={`rounded-xl border-2 transition-colors resize-none ${errors.description ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-gray-700 font-medium flex items-center mb-2">
            <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
            ราคา (บาท) *
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`rounded-xl border-2 transition-colors ${errors.price ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="quantity" className="text-gray-700 font-medium flex items-center mb-2">
            <Hash className="w-4 h-4 mr-2 text-purple-500" />
            จำนวน *
          </Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => onInputChange('quantity', e.target.value)}
            placeholder="0"
            min="0"
            className={`rounded-xl border-2 transition-colors ${errors.quantity ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfoForm;
