
import { Button } from "@/components/ui/button";
import { Store, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerAuthGuard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
      <div className="text-center">
        <Store className="w-16 h-16 mx-auto mb-4 text-purple-400" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่ได้เข้าสู่ระบบ</h1>
        <p className="text-gray-600 mb-6">กรุณาเพิ่มสินค้าแรกเพื่อเข้าสู่ระบบผู้ขาย</p>
        <Button
          onClick={() => navigate('/add-product')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าแรก
        </Button>
      </div>
    </div>
  );
};

export default SellerAuthGuard;
