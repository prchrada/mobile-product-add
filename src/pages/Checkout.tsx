
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { CartItem, OrderFormData } from '@/types/cart';
import { getCartItems, getCartTotal, clearCart, saveOrder } from '@/utils/cartStorage';
import { getProductById } from '@/utils/productStorage';
import { ArrowLeft, Phone, CreditCard, MessageCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [sellerInfo, setSellerInfo] = useState<{
    phone: string;
    promptPay: string;
    lineId: string;
  } | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });
  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const items = getCartItems();
    if (items.length === 0) {
      navigate('/sales');
      return;
    }
    setCartItems(items);
    setTotal(getCartTotal());

    // Get seller info from the first product (assuming all products are from the same seller)
    if (items.length > 0) {
      const firstProduct = getProductById(items[0].productId);
      if (firstProduct) {
        setSellerInfo({
          phone: firstProduct.sellerPhone,
          promptPay: firstProduct.sellerPromptPay,
          lineId: firstProduct.sellerLineId,
        });
      }
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'กรุณากรอกชื่อลูกค้า';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/[- ]/g, ''))) {
      newErrors.customerPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง';
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'กรุณากรอกที่อยู่';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const order = saveOrder({
        items: cartItems,
        total,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
      });

      clearCart();

      toast({
        title: "สั่งซื้อสำเร็จ!",
        description: `คำสั่งซื้อ #${order.id} ได้รับการบันทึกแล้ว`,
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">ชำระเงิน</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller Payment Information */}
          {sellerInfo && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">ข้อมูลการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">พร้อมเพย์</p>
                    <p className="text-sm text-green-600">{sellerInfo.promptPay}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Line ID</p>
                    <p className="text-sm text-blue-600">{sellerInfo.lineId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">เบอร์โทรผู้ขาย</p>
                    <p className="text-sm text-gray-600">{sellerInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Information */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>ข้อมูลลูกค้า</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">ชื่อลูกค้า *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="กรอกชื่อ-นามสกุล"
                  className={errors.customerName ? 'border-red-500' : ''}
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="customerPhone">เบอร์โทรศัพท์ *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="08xxxxxxxx"
                  className={errors.customerPhone ? 'border-red-500' : ''}
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="customerAddress">ที่อยู่จัดส่ง *</Label>
                <Textarea
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  placeholder="กรอกที่อยู่สำหรับจัดส่งสินค้า"
                  rows={3}
                  className={errors.customerAddress ? 'border-red-500' : ''}
                />
                {errors.customerAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold text-green-600">
                  <span>ยอดรวมทั้งสิ้น:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันคำสั่งซื้อ'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
