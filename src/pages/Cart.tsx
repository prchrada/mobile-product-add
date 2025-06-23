
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';
import { getCartItems, updateCartItemQuantity, removeFromCart, getCartTotal } from '@/utils/cartStorage';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    updateCartItemQuantity(itemId, newQuantity);
    loadCart();

    if (newQuantity === 0) {
      toast({
        title: "ลบสินค้าออกจากตะกร้า",
        description: "ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว",
      });
    }
  };

  const handleRemoveItem = (itemId: string, productName: string) => {
    removeFromCart(itemId);
    loadCart();
    toast({
      title: "ลบสินค้าออกจากตะกร้า",
      description: `ลบ "${productName}" ออกจากตะกร้าเรียบร้อยแล้ว`,
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "ตะกร้าสินค้าว่าง",
        description: "กรุณาเพิ่มสินค้าลงในตะกร้าก่อน",
        variant: "destructive",
      });
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/sales')}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            ตะกร้าสินค้า ({cartItems.length})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">ตะกร้าสินค้าว่าง</p>
            <p className="text-gray-400 text-sm mb-4">เลือกสินค้าที่ต้องการซื้อ</p>
            <Button
              onClick={() => navigate('/sales')}
              className="bg-green-600 hover:bg-green-700"
            >
              เลือกซื้อสินค้า
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="shadow-md border-0 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="flex items-center mr-3">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productName}
                        </h3>
                        <p className="text-green-600 font-medium mb-2">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-blue-600">
                              {formatPrice(item.subtotal)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id, item.productName)}
                              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total */}
            <Card className="shadow-lg border-0 bg-white mb-6">
              <CardHeader>
                <CardTitle className="text-center">สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>จำนวนสินค้า:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-green-600 border-t pt-2">
                    <span>ยอดรวม:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              ดำเนินการสั่งซื้อ
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
