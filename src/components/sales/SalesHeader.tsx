
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartButton from '@/components/CartButton';

interface SalesHeaderProps {
  productsCount: number;
}

const SalesHeader = ({ productsCount }: SalesHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8 pt-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mr-4 glass-card text-white hover:text-white/80"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
            <Heart className="w-6 h-6 text-white icon-glow" />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            💖 ซื้อสินค้า ({productsCount})
          </h1>
        </div>
      </div>
      <CartButton />
    </div>
  );
};

export default SalesHeader;
