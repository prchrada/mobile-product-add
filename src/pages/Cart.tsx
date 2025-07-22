
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';
import { getCartItems, updateCartItemQuantity, removeFromCart, getCartTotal } from '@/utils/cartStorage';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, ShoppingBag, Heart } from 'lucide-react';

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
    <div className="min-h-screen hero-gradient p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/sales')}
            className="mr-4 glass-card text-white hover:text-white/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
              <ShoppingBag className="w-6 h-6 text-white icon-glow" />
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              💖 ตะกร้าสินค้า ({cartItems.length})
            </h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl floating-animation">
              <Heart className="w-12 h-12 text-primary icon-glow" />
            </div>
            <p className="text-white text-xl mb-3 font-bold drop-shadow-lg">ตะกร้าสินค้าว่าง</p>
            <p className="text-white/80 text-lg mb-6 bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">เลือกสินค้าที่ต้องการซื้อ</p>
            <Button
              onClick={() => navigate('/sales')}
              className="btn-primary px-8 py-4 text-lg rounded-3xl shadow-2xl"
            >
              🛍️ เลือกซื้อสินค้า
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <Card key={item.id} className="glass-card border-white/30 rounded-3xl shadow-xl card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex items-center mr-4">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 hero-gradient rounded-2xl flex items-center justify-center shadow-lg">
                            <ShoppingCart className="w-8 h-8 text-white icon-glow" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">
                          {item.productName}
                        </h3>
                        <p className="text-emerald-600 font-bold mb-4 text-xl">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-2xl">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-10 w-10 p-0 rounded-full border-2 hover:scale-110 transition-transform"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold min-w-[3rem] text-center text-lg bg-white px-3 py-1 rounded-full">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-10 w-10 p-0 rounded-full border-2 hover:scale-110 transition-transform"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-primary text-lg bg-primary/10 px-4 py-2 rounded-full">
                              {formatPrice(item.subtotal)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id, item.productName)}
                              className="text-red-500 hover:text-red-700 h-10 w-10 p-0 rounded-full hover:bg-red-50 hover:scale-110 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
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
            <Card className="glass-card border-white/30 rounded-3xl shadow-2xl mb-8">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-3xl">
                <CardTitle className="text-center text-xl font-bold">📋 สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-700">🛍️ จำนวนสินค้า:</span>
                    <span className="font-bold bg-primary/10 px-3 py-1 rounded-full text-primary">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-emerald-600 border-t-2 border-emerald-100 pt-4">
                    <span>💰 ยอดรวม:</span>
                    <span className="bg-emerald-100 px-4 py-2 rounded-2xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 rounded-3xl text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              🚀 ดำเนินการสั่งซื้อ
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
