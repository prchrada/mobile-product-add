import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Store, Package, TrendingUp, Settings } from "lucide-react";

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🏪 หน้าควบคุมผู้ขาย</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button
            onClick={() => navigate('/products')}
            className="p-6 h-auto flex flex-col items-center gap-4 bg-white hover:bg-gray-50 text-gray-800 border shadow-lg"
          >
            <Package className="w-8 h-8" />
            <span>จัดการสินค้า</span>
          </Button>

          <Button
            onClick={() => navigate('/orders')}
            className="p-6 h-auto flex flex-col items-center gap-4 bg-white hover:bg-gray-50 text-gray-800 border shadow-lg"
          >
            <TrendingUp className="w-8 h-8" />
            <span>ดูคำสั่งซื้อ</span>
          </Button>

          <Button
            onClick={() => navigate('/profile')}
            className="p-6 h-auto flex flex-col items-center gap-4 bg-white hover:bg-gray-50 text-gray-800 border shadow-lg"
          >
            <Settings className="w-8 h-8" />
            <span>ตั้งค่าร้านค้า</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
