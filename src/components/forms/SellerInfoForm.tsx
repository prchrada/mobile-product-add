
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductFormData } from '@/types/product';

interface SellerInfoFormProps {
  formData: ProductFormData;
  errors: Partial<ProductFormData>;
  onInputChange: (field: keyof ProductFormData, value: string) => void;
  isEditing?: boolean;
}

const SellerInfoForm = ({ 
  formData, 
  errors, 
  onInputChange, 
  isEditing = false 
}: SellerInfoFormProps) => {
  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-900 mb-3">ข้อมูลผู้ขาย</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="sellerName">ชื่อผู้ขาย *</Label>
          <Input
            id="sellerName"
            value={formData.sellerName}
            onChange={(e) => onInputChange('sellerName', e.target.value)}
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
            onChange={(e) => onInputChange('sellerPhone', e.target.value)}
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
            onChange={(e) => onInputChange('sellerPromptPay', e.target.value)}
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
            onChange={(e) => onInputChange('sellerLineId', e.target.value)}
            placeholder="@lineid หรือ line.me/ti/p/xxxx"
            className={errors.sellerLineId ? 'border-red-500' : ''}
          />
          {errors.sellerLineId && <p className="text-red-500 text-sm mt-1">{errors.sellerLineId}</p>}
        </div>

        <div>
          <Label htmlFor="sellerPassword">
            {isEditing ? 'รหัสผ่านยืนยันตัวตน *' : 'ตั้งรหัสผ่านสำหรับสินค้า *'}
          </Label>
          <Input
            id="sellerPassword"
            type="password"
            value={formData.sellerPassword}
            onChange={(e) => onInputChange('sellerPassword', e.target.value)}
            placeholder={isEditing ? 'กรอกรหัสผ่านเดิมเพื่อยืนยัน' : 'ตั้งรหัสผ่าน (อย่างน้อย 4 ตัว)'}
            className={errors.sellerPassword ? 'border-red-500' : ''}
          />
          {errors.sellerPassword && <p className="text-red-500 text-sm mt-1">{errors.sellerPassword}</p>}
          {!isEditing && (
            <p className="text-gray-500 text-sm mt-1">
              รหัสผ่านนี้จะใช้สำหรับยืนยันตัวตนเมื่อแก้ไขสินค้า
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerInfoForm;
