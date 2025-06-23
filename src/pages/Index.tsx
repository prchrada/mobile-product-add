
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Package, Plus, ShoppingCart, ClipboardList, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'ขายสินค้า',
      description: 'หน้าขายสินค้าและจัดการตะกร้า',
      icon: ShoppingCart,
      color: 'bg-green-500',
      path: '/sales'
    },
    {
      title: 'จัดการสินค้า',
      description: 'ดูและจัดการสินค้าในคลัง',
      icon: Package,
      color: 'bg-blue-500',
      path: '/products'
    },
    {
      title: 'เพิ่มสินค้า',
      description: 'เพิ่มสินค้าใหม่เข้าสู่ระบบ',
      icon: Plus,
      color: 'bg-purple-500',
      path: '/add-product'
    },
    {
      title: 'คำสั่งซื้อ',
      description: 'จัดการคำสั่งซื้อและสถานะ',
      icon: ClipboardList,
      color: 'bg-orange-500',
      path: '/orders'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ระบบจัดการสินค้า
          </h1>
          <p className="text-gray-600">
            จัดการสินค้าและขายสินค้าผ่านมือถือ
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
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

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">สินค้าทั้งหมด</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/70 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">คำสั่งซื้อ</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>ระบบจัดการสินค้าและขาย</p>
          <p>เวอร์ชัน 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
