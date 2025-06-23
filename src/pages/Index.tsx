
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ระบบจัดการสินค้า</h1>
          <p className="text-gray-600">เพิ่ม แก้ไข และจัดการสินค้าของคุณ</p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Plus className="w-5 h-5 mr-2 text-green-600" />
                เพิ่มสินค้าใหม่
              </CardTitle>
              <CardDescription>
                เพิ่มสินค้าใหม่เข้าสู่ระบบ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/add-product')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มสินค้า
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <List className="w-5 h-5 mr-2 text-blue-600" />
                รายการสินค้า
              </CardTitle>
              <CardDescription>
                ดูและจัดการสินค้าทั้งหมด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/products')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <List className="w-4 h-4 mr-2" />
                ดูสินค้าทั้งหมด
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>ระบบจัดการสินค้าสำหรับมือถือ</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
