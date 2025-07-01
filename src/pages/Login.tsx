
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, User, Phone, Mail, CreditCard, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { setCurrentUser, UserInfo } from '@/utils/userAuth';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    promptPay: '',
    lineId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    if (userType === 'seller' && (!formData.promptPay || !formData.lineId)) {
      toast({
        title: "กรุณากรอกข้อมูลผู้ขายให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    const user: UserInfo = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      userType: userType!,
      promptPay: userType === 'seller' ? formData.promptPay : undefined,
      lineId: userType === 'seller' ? formData.lineId : undefined,
    };

    setCurrentUser(user);

    toast({
      title: "ลงทะเบียนสำเร็จ!",
      description: `ยินดีต้อนรับ ${user.name}`,
    });

    navigate('/');
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              เลือกประเภทผู้ใช้งาน
            </h1>
            <p className="text-gray-600">กรุณาเลือกว่าคุณต้องการใช้งานในฐานะอะไร</p>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400"
              onClick={() => setUserType('buyer')}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">ผู้ซื้อ</h3>
                    <p className="text-gray-600 text-sm">ซื้อสินค้าและจัดการตะกร้า</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-400"
              onClick={() => setUserType('seller')}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Store className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">ผู้ขาย</h3>
                    <p className="text-gray-600 text-sm">เพิ่มและจัดการสินค้า</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            userType === 'seller' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'bg-gradient-to-r from-blue-600 to-green-600'
          }`}>
            {userType === 'seller' ? (
              <Store className="w-10 h-10 text-white" />
            ) : (
              <ShoppingCart className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ลงทะเบียน{userType === 'seller' ? 'ผู้ขาย' : 'ผู้ซื้อ'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => setUserType(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← เปลี่ยนประเภทผู้ใช้
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-3xl">
          <CardHeader className={`text-white pb-6 ${
            userType === 'seller'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-green-500'
          }`}>
            <CardTitle className="text-center text-xl">
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="rounded-xl border-gray-200 focus:border-purple-400"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  เบอร์โทรศัพท์
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className="rounded-xl border-gray-200 focus:border-purple-400"
                  placeholder="08x-xxx-xxxx"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="rounded-xl border-gray-200 focus:border-purple-400"
                  placeholder="example@email.com"
                />
              </div>

              {userType === 'seller' && (
                <>
                  <div>
                    <Label htmlFor="promptPay" className="flex items-center text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 mr-2" />
                      พร้อมเพย์
                    </Label>
                    <Input
                      id="promptPay"
                      type="text"
                      value={formData.promptPay}
                      onChange={handleInputChange('promptPay')}
                      className="rounded-xl border-gray-200 focus:border-purple-400"
                      placeholder="เบอร์โทรหรือ ID Card สำหรับพร้อมเพย์"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lineId" className="flex items-center text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Line ID
                    </Label>
                    <Input
                      id="lineId"
                      type="text"
                      value={formData.lineId}
                      onChange={handleInputChange('lineId')}
                      className="rounded-xl border-gray-200 focus:border-purple-400"
                      placeholder="Line ID สำหรับติดต่อ"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className={`w-full py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  userType === 'seller'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                } text-white`}
              >
                เริ่มใช้งาน
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
