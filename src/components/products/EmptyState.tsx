
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  hasProducts: boolean;
}

const EmptyState = ({ hasProducts }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-purple-500" />
      </div>
      <p className="text-gray-500 text-lg mb-2">
        {!hasProducts ? 'ยังไม่มีสินค้า' : 'ไม่พบสินค้าที่ค้นหา'}
      </p>
      <p className="text-gray-400 text-sm mb-6">
        {!hasProducts ? 'เริ่มต้นเพิ่มสินค้าแรกของคุณ' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
      </p>
      {!hasProducts && (
        <Button
          onClick={() => navigate('/add-product')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl px-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าแรก
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
