
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '@/utils/userAuth';

interface ProductsHeaderProps {
  currentUser: UserInfo;
  productsCount: number;
}

const ProductsHeader = ({ currentUser, productsCount }: ProductsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-8 pt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="mr-3 hover:bg-white/70 rounded-full p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          สินค้าของฉัน ({productsCount})
        </h1>
        <p className="text-sm text-gray-600">ผู้ขาย: {currentUser.name}</p>
      </div>
      <Button
        onClick={() => navigate('/add-product')}
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-lg"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProductsHeader;
