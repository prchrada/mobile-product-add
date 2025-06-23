
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from 'lucide-react';
import { getCartItemCount } from '@/utils/cartStorage';
import { useNavigate } from 'react-router-dom';

const CartButton = () => {
  const navigate = useNavigate();
  const [itemCount] = useState(getCartItemCount());

  return (
    <Button
      onClick={() => navigate('/cart')}
      variant="outline"
      size="sm"
      className="relative"
    >
      <ShoppingCart className="w-4 h-4" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;
