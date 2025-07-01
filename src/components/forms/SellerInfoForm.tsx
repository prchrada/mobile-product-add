
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductFormData } from '@/types/product';
import { User, Phone, CreditCard, MessageCircle } from 'lucide-react';

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
    <div className="pt-6 border-t border-gradient-to-r from-purple-200 to-pink-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <User className="w-5 h-5 mr-2 text-purple-600" />
        ข้อมูลผู้ขาย
      </h3>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="sellerName" className="text-gray-700 font-medium flex items-center mb-2">
            <User className="w-4 h-4 mr-2 text-purple-500" />
            ชื่อผู้ขาย *
          </Label>
          <Input
            id="sellerName"
            value={formData.sellerName}
            onChange={(e) => onInputChange('sellerName', e.target.value)}
            placeholder="กรอกชื่อผู้ขาย"
            className={`rounded-xl border-2 transition-colors ${errors.sellerName ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.sellerName && <p className="text-red-500 text-sm mt-2">{errors.sellerName}</p>}
        </div>

        <div>
          <Label htmlFor="sellerPhone" className="text-gray-700 font-medium flex items-center mb-2">
            <Phone className="w-4 h-4 mr-2 text-purple-500" />
            เบอร์โทรผู้ขาย *
          </Label>
          <Input
            id="sellerPhone"
            value={formData.sellerPhone}
            onChange={(e) => onInputChange('sellerPhone', e.target.value)}
            placeholder="08xxxxxxxx"
            className={`rounded-xl border-2 transition-colors ${errors.sellerPhone ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.sellerPhone && <p className="text-red-500 text-sm mt-2">{errors.sellerPhone}</p>}
        </div>

        <div>
          <Label htmlFor="sellerPromptPay" className="text-gray-700 font-medium flex items-center mb-2">
            <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
            พร้อมเพย์ผู้ขาย *
          </Label>
          <Input
            id="sellerPromptPay"
            value={formData.sellerPromptPay}
            onChange={(e) => onInputChange('sellerPromptPay', e.target.value)}
            placeholder="เบอร์โทรหรือเลขบัตรประชาชน"
            className={`rounded-xl border-2 transition-colors ${errors.sellerPromptPay ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.sellerPromptPay && <p className="text-red-500 text-sm mt-2">{errors.sellerPromptPay}</p>}
        </div>

        <div>
          <Label htmlFor="sellerLineId" className="text-gray-700 font-medium flex items-center mb-2">
            <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
            Line ID ผู้ขาย *
          </Label>
          <Input
            id="sellerLineId"
            value={formData.sellerLineId}
            onChange={(e) => onInputChange('sellerLineId', e.target.value)}
            placeholder="@lineid หรือ line.me/ti/p/xxxx"
            className={`rounded-xl border-2 transition-colors ${errors.sellerLineId ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'}`}
          />
          {errors.sellerLineId && <p className="text-red-500 text-sm mt-2">{errors.sellerLineId}</p>}
        </div>
      </div>
    </div>
  );
};

export default SellerInfoForm;
