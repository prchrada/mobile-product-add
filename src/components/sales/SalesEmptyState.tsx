
import { Package } from 'lucide-react';

interface SalesEmptyStateProps {
  hasProducts: boolean;
}

const SalesEmptyState = ({ hasProducts }: SalesEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg mb-2">
        {!hasProducts ? 'ไม่มีสินค้าในสต็อก' : 'ไม่พบสินค้าที่ค้นหา'}
      </p>
      <p className="text-gray-400 text-sm">
        {!hasProducts ? 'เพิ่มสินค้าเพื่อเริ่มขาย' : 'ลองเปลี่ยนคำค้นหา'}
      </p>
    </div>
  );
};

export default SalesEmptyState;
