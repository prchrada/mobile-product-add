
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartButton from '@/components/CartButton';

interface SalesHeaderProps {
  productsCount: number;
}

const SalesHeader = ({ productsCount }: SalesHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 pt-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          ซื้อสินค้า ({productsCount})
        </h1>
      </div>
      <CartButton />
    </div>
  );
};

export default SalesHeader;
