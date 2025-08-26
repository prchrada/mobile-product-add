
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductSalesCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
}

const ProductSalesCard = ({ product, onAddToCart, formatPrice }: ProductSalesCardProps) => {
  return (
    <Card className="shadow-sm border-0 bg-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-start">
          <div className="flex items-center mb-2 flex-1">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover mr-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-3 ${product.image_url ? 'hidden' : ''}`}>
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-1">
                {product.name}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">ราคา:</span>
            <span className="font-bold text-green-600 text-xl">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">คงเหลือ:</span>
            <span className="font-medium text-blue-600">
              {product.quantity} ชิ้น
            </span>
          </div>
        </div>

        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={product.quantity <= 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มลงตะกร้า
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductSalesCard;
