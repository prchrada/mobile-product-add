import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="hero-gradient text-white pb-6">
            <CardTitle className="text-center text-2xl font-bold">
              🛒 จัดการสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Button
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105"
              onClick={() => navigate("/add-product")}
            >
              ➕ เพิ่มสินค้าใหม่
            </Button>
            <Button
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:scale-105"
              onClick={() => navigate("/products")}
            >
              📦 ดูรายการสินค้า
            </Button>
            <Button
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:scale-105"
              onClick={() => navigate("/orders")}
            >
              📑 ดูออเดอร์
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
