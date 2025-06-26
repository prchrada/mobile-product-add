
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from '@/types/product';
import ImageUpload from '../ImageUpload';

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
    <div className="space-y-4">
      <ImageUpload
        value={formData.imageUrl}
        onChange={onImageChange}
        onError={onImageError}
      />

      <div>
        <Label htmlFor="name">ชื่อสินค้า *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
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
          onChange={(e) => onInputChange('description', e.target.value)}
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
          onChange={(e) => onInputChange('price', e.target.value)}
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
          onChange={(e) => onInputChange('quantity', e.target.value)}
          placeholder="0"
          min="0"
          className={errors.quantity ? 'border-red-500' : ''}
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
      </div>
    </div>
  );
};

export default ProductBasicInfoForm;
