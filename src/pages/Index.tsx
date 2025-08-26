
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Package, Plus, ShoppingCart, ClipboardList, Eye, LogOut, User, Store, Sparkles, TrendingUp, Heart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/productSupabase';
import { getCurrentUser, signOut, isSeller, isBuyer } from '@/utils/userAuth';
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

    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        // If seller, show only their products
        if (isSeller()) {
          const sellerProducts = loadedProducts.filter(product => 
            product.user_id === currentUser.id
          ).slice(0, 3);
          setProducts(sellerProducts);
        } else {
          // If buyer, show all available products
          setProducts(loadedProducts.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลสินค้าได้",
          variant: "destructive",
        });
      }
    };
    
    loadProducts();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await signOut();
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
      color: 'hero-gradient',
      iconColor: 'text-white icon-glow',
      path: '/products'
    },
    {
      title: 'เพิ่มสินค้า',
      description: 'เพิ่มสินค้าใหม่เข้าสู่ระบบ',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      iconColor: 'text-white icon-glow',
      path: '/add-product'
    },
    {
      title: 'คำสั่งซื้อ',
      description: 'จัดการคำสั่งซื้อและติดตาม',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-orange-500 to-amber-600',
      iconColor: 'text-white icon-glow',
      path: '/orders'
    }
  ];

  const buyerMenuItems = [
    {
      title: 'ซื้อสินค้า',
      description: 'หน้าซื้อสินค้าและจัดการตะกร้า',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      iconColor: 'text-white icon-glow',
      path: '/sales'
    },
    {
      title: 'คำสั่งซื้อ',
      description: 'ดูประวัติการสั่งซื้อ',
      icon: Star,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      iconColor: 'text-white icon-glow',
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
    <div className="min-h-screen hero-gradient p-4">
      <div className="max-w-md mx-auto">
        {/* Header with User Info */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={`รูปโปรไฟล์ของ ${currentUser.name}`}
                className="w-20 h-20 rounded-3xl object-cover mr-4 shadow-2xl floating-animation border-4 border-white/30"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-20 h-20 glass-card rounded-3xl flex items-center justify-center mr-4 shadow-2xl floating-animation ${currentUser.avatarUrl ? 'hidden' : ''}`}>
              <UserIcon className="w-10 h-10 text-primary icon-glow" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white drop-shadow-lg">{currentUser.name}</h2>
              <p className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {isSeller() ? '✨ ผู้ขาย' : '💖 ผู้ซื้อ'}
              </p>
              <p className="text-xs text-white/60 mt-1">{currentUser.phone}</p>
            </div>
          </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-white/10 rounded-full p-3 glass-card"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
              ระบบจัดการสินค้า
            </h1>
            <p className="text-white/80 text-lg bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
              {isSeller() ? '🎯 จัดการสินค้าและยอดขาย' : '🛍️ ค้นหาและซื้อสินค้าที่ต้องการ'}
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-2xl cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mr-4 shadow-xl`}>
                      <Icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-1">
                        {item.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Products Preview */}
        {products.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white drop-shadow-lg">
                {isSeller() ? '🎨 สินค้าของคุณ' : '⭐ สินค้าแนะนำ'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(isSeller() ? '/products' : '/sales')}
                className="text-white hover:text-white/80 glass-card"
              >
                <Eye className="w-4 h-4 mr-1" />
                ดูทั้งหมด
              </Button>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="glass-card rounded-3xl overflow-hidden border-white/30 card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded-2xl object-cover mr-4 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mr-4 shadow-lg ${product.image_url ? 'hidden' : ''}`}>
                        <Package className="w-8 h-8 text-white icon-glow" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                          {product.name}
                        </h3>
                        <p className="text-emerald-600 font-bold text-lg">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-semibold text-sm bg-primary/10 px-3 py-1 rounded-full">
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
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="text-center glass-card border-white/30 rounded-3xl shadow-xl card-hover">
            <CardContent className="pt-8 pb-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                {isSeller() ? products.length : products.length}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                {isSeller() ? '🎯 สินค้าของคุณ' : '🛍️ สินค้าทั้งหมด'}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center glass-card border-white/30 rounded-3xl shadow-xl card-hover">
            <CardContent className="pt-8 pb-6">
              <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
              <div className="text-sm text-gray-700 font-medium">⭐ คำสั่งซื้อ</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p className="mb-1">✨ ระบบจัดการสินค้าและขาย</p>
          <p>เวอร์ชัน 2.0 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
