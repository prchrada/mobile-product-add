
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Package, Plus, ShoppingCart, ClipboardList, Eye, LogOut, User, Store } from 'lucide-react';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/productStorage';
import { getCurrentUser, clearCurrentUser, isSeller, isBuyer } from '@/utils/userAuth';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadedProducts = getProducts();
    // If seller, show only their products
    if (isSeller()) {
      const sellerProducts = loadedProducts.filter(product => 
        product.sellerPhone === currentUser.phone
      ).slice(0, 3);
      setProducts(sellerProducts);
    } else {
      // If buyer, show all available products
      setProducts(loadedProducts.slice(0, 3));
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    clearCurrentUser();
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "ขออภัยที่ต้องจากลา",
    });
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  const sellerMenuItems = [
    {
      title: 'จัดการสินค้า',
      description: 'ดูและจัดการสินค้าในคลัง',
      icon: Package,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      path: '/products'
    },
    {
      title: 'เพิ่มสินค้า',
      description: 'เพิ่มสินค้าใหม่เข้าสู่ระบบ',
      icon: Plus,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      path: '/add-product'
    },
    {
      title: 'คำสั่งซื้อ',
      description: 'จัดการคำสั่งซื้อ',
      icon: ClipboardList,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      path: '/orders'
    }
  ];

  const buyerMenuItems = [
    {
      title: 'ซื้อสินค้า',
      description: 'หน้าซื้อสินค้าและจัดการตะกร้า',
      icon: ShoppingCart,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      path: '/sales'
    },
    {
      title: 'คำสั่งซื้อ',
      description: 'ดูประวัติการสั่งซื้อ',
      icon: ClipboardList,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      path: '/orders'
    }
  ];

  const menuItems = isSeller() ? sellerMenuItems : buyerMenuItems;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const getUserTypeIcon = () => {
    return isSeller() ? Store : ShoppingCart;
  };

  const getUserTypeColor = () => {
    return isSeller() 
      ? 'from-purple-600 to-pink-600' 
      : 'from-green-600 to-blue-600';
  };

  const UserIcon = getUserTypeIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with User Info */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${getUserTypeColor()} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-sm text-gray-500">
                  {isSeller() ? 'ผู้ขาย' : 'ผู้ซื้อ'}
                </p>
                <p className="text-xs text-gray-400">{currentUser.phone}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-4">
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${getUserTypeColor()} bg-clip-text text-transparent mb-2`}>
              ระบบจัดการสินค้า
            </h1>
            <p className="text-gray-600">
              {isSeller() ? 'จัดการสินค้าและยอดขาย' : 'ค้นหาและซื้อสินค้าที่ต้องการ'}
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-2xl overflow-hidden"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Products Preview */}
        {products.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isSeller() ? 'สินค้าของคุณ' : 'สินค้าแนะนำ'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(isSeller() ? '/products' : '/sales')}
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="w-4 h-4 mr-1" />
                ดูทั้งหมด
              </Button>
            </div>
            <div className="space-y-3">
              {products.map((product) => (
                <Card key={product.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover mr-3 shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 ${product.imageUrl ? 'hidden' : ''}`}>
                        <Package className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {product.name}
                        </h3>
                        <p className="text-green-600 font-bold text-sm">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-semibold text-sm">
                          {product.quantity} ชิ้น
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
            <CardContent className="pt-6">
              <div className={`text-2xl font-bold bg-gradient-to-r ${getUserTypeColor()} bg-clip-text text-transparent`}>
                {isSeller() ? products.length : getProducts().length}
              </div>
              <div className="text-sm text-gray-600">
                {isSeller() ? 'สินค้าของคุณ' : 'สินค้าทั้งหมด'}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">คำสั่งซื้อ</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>ระบบจัดการสินค้าและขาย</p>
          <p>เวอร์ชัน 2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
