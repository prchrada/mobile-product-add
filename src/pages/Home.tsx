import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Package, Plus, ShoppingCart, ClipboardList, Eye, LogOut, User, Store, Sparkles, TrendingUp, Heart, Star, Crown } from 'lucide-react';
import { Product } from '@/types/product';
import { getProducts, getUserProducts } from '@/utils/productSupabase';
import { getCurrentUser, signOut, isSeller, isBuyer } from '@/utils/userAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data: { session } } =  await supabase.auth.getSession() 
        let loadedProducts
        if (session) {
          // ถ้าเข้าใช้งาน แสดงสินค้าของผู้ใช้งานนั้นเท่านั้น
          loadedProducts = await getUserProducts(session.user.id);
        } else {
          // ถ้าไม่ได้เข้าใช้งาน แสดงสินค้าทั้งหมด
          loadedProducts = await getProducts();
        }
        
        // แสดงสินค้าทั้งหมดสำหรับคนที่ยังไม่ได้ล็อกอิน
        setProducts(loadedProducts.slice(0, 8));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "ขออภัยที่ต้องจากลา",
    });
    window.location.reload();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                <Store className="w-6 h-6 text-primary icon-glow" />
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                ระบบจัดการสินค้า
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                    <User className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">{currentUser.name}</span>
                  </div>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-white/10"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    เข้าสู่ระบบ
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    สมัครสมาชิก
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-4 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
              🛍️ ตลาดออนไลน์
            </h2>
            <p className="text-white/80 text-xl bg-white/10 px-8 py-3 rounded-full backdrop-blur-sm inline-block">
              ค้นหาสินค้าคุณภาพ ราคาดี จากผู้ขายที่น่าเชื่อถือ
            </p>
          </div>
          
          {!currentUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <Card className="glass-card cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30 group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white icon-glow" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">💖 ผู้ซื้อ</h3>
                    <p className="text-gray-600 mb-4">ค้นหาและซื้อสินค้าที่ชื่นชอบ</p>
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                    >
                      เริ่มช็อปปิ้ง
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30 group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-8 h-8 text-white icon-glow" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">✨ ผู้ขาย</h3>
                    <p className="text-gray-600 mb-4">เพิ่มและจัดการสินค้าของคุณ</p>
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full hero-gradient text-white"
                    >
                      เริ่มขายสินค้า
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              ⭐ สินค้าแนะนำ
            </h2>
            {currentUser && (
              <Button
                onClick={() => navigate(isBuyer() ? '/sales' : '/products')}
                variant="ghost"
                className="text-white hover:text-white/80 glass-card"
              >
                <Eye className="w-4 h-4 mr-2" />
                ดูทั้งหมด
              </Button>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="glass-card rounded-3xl overflow-hidden border-white/30 card-hover">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-3xl">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full hero-gradient flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                        <Package className="w-16 h-16 text-white icon-glow" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-3 text-sm">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-emerald-600 font-bold text-xl">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-primary font-semibold text-sm bg-primary/10 px-3 py-1 rounded-full">
                          {product.stock} ชิ้น
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {currentUser ? (
                          isBuyer() ? (
                            <Button 
                              onClick={() => navigate('/sales')}
                              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              ซื้อสินค้า
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => navigate('/products')}
                              className="w-full hero-gradient text-white"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              จัดการสินค้า
                            </Button>
                          )
                        ) : (
                          <Button 
                            onClick={() => navigate('/login')}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                          >
                            เข้าสู่ระบบเพื่อซื้อ
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-white/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">ยังไม่มีสินค้า</h3>
              <p className="text-white/70 mb-6">รอสักครู่ ผู้ขายกำลังเพิ่มสินค้าเข้าระบบ</p>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-white/90"
              >
                สมัครเป็นผู้ขายเลย
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg mb-12">
            🚀 ทำไมต้องเลือกเรา?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">✨ ง่ายใช้งาน</h3>
              <p className="text-white/80">
                ระบบที่ออกแบบให้ใช้งานง่าย เหมาะกับทุกคน
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <TrendingUp className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">📈 เพิ่มยอดขาย</h3>
              <p className="text-white/80">
                ช่วยให้ผู้ขายเพิ่มยอดขายได้อย่างมีประสิทธิภาพ
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Heart className="w-10 h-10 text-white icon-glow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">💖 ปลอดภัย</h3>
              <p className="text-white/80">
                ระบบความปลอดภัยขั้นสูง ปกป้องข้อมูลของคุณ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">ระบบจัดการสินค้า</h3>
            <p className="text-white/70">แพลตฟอร์มซื้อขายออนไลน์ที่ใช่สำหรับคุณ</p>
          </div>
          
          <div className="text-white/60 text-sm">
            <p>✨ เวอร์ชัน 2.0 | พัฒนาด้วย ❤️ โดย Lovable</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;