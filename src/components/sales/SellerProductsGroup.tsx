
import { User } from 'lucide-react';
import { Product } from '@/types/product';
import ProductSalesCard from './ProductSalesCard';

interface SellerProductsGroupProps {
  sellerKey: string;
  sellerProducts: Product[];
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
}

const SellerProductsGroup = ({ 
  sellerKey, 
  sellerProducts, 
  onAddToCart, 
  formatPrice 
}: SellerProductsGroupProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      {/* Seller Header */}
      <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">ผู้ขาย</h3>
          <p className="text-sm text-gray-500">
            รหัสผู้ขาย: {sellerKey.substring(0, 8)}...
          </p>
        </div>
      </div>

      {/* Seller's Products */}
      <div className="space-y-4">
        {sellerProducts.map((product) => (
          <ProductSalesCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default SellerProductsGroup;
