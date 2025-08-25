
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, User, Phone, Mail, CreditCard, MessageSquare, Heart, Sparkles, Crown, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { signUp, signIn, signInWithNameAndPhone, UserInfo } from '@/utils/userAuth';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'buyer' | 'seller' | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    promptPay: '',
    lineId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExistingUser) {
      // Quick login for existing users
      if (!formData.name || !formData.phone) {
        toast({
          title: "กรุณากรอกชื่อและเบอร์โทรศัพท์",
          variant: "destructive",
        });
        return;
      }

      const { error } = await signInWithNameAndPhone(formData.name, formData.phone);

      if (error) {
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "เข้าสู่ระบบสำเร็จ!",
        description: `ยินดีต้อนรับกลับ ${formData.name}`,
      });

      navigate('/');
    } else {
      // Full registration for new users
      if (!formData.name || !formData.phone || !formData.email || !formData.password) {
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

      const profileData: Omit<UserInfo, 'id' | 'email'> = {
        name: formData.name,
        phone: formData.phone,
        userType: userType!,
        promptPay: userType === 'seller' ? formData.promptPay : undefined,
        lineId: userType === 'seller' ? formData.lineId : undefined,
      };

      const { error } = await signUp(formData.email, formData.password, profileData);

      if (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "ลงทะเบียนสำเร็จ!",
        description: `ยินดีต้อนรับ ${profileData.name}`,
      });

      navigate('/');
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (!userType && !isExistingUser) {
    return (
      <div className="min-h-screen hero-gradient p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl floating-animation">
              <User className="w-12 h-12 text-primary icon-glow" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
              ยินดีต้อนรับ! 🎉
            </h1>
            <p className="text-white/80 text-lg bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
              กรุณาเลือกตัวเลือก
            </p>
          </div>

          <div className="space-y-6">
            {/* Quick Login for Existing Users */}
            <Card 
              className="glass-card cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30 group"
              onClick={() => setIsExistingUser(true)}
            >
              <CardContent className="p-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white icon-glow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">🔑 เข้าสู่ระบบ</h3>
                    <p className="text-gray-600">สำหรับผู้ใช้ที่ลงทะเบียนแล้ว</p>
                    <div className="flex items-center mt-2 text-blue-600">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">กรอกเพียงชื่อและเบอร์โทร</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glass-card cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30 group"
              onClick={() => setUserType('buyer')}
            >
              <CardContent className="p-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white icon-glow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">💖 ลงทะเบียนผู้ซื้อ</h3>
                    <p className="text-gray-600">ค้นหาและซื้อสินค้าที่ชื่นชอบ</p>
                    <div className="flex items-center mt-2 text-pink-600">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">เริ่มช็อปปิ้งได้เลย!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="glass-card cursor-pointer card-hover rounded-3xl overflow-hidden border-white/30 group"
              onClick={() => setUserType('seller')}
            >
              <CardContent className="p-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-8 h-8 text-white icon-glow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">✨ ลงทะเบียนผู้ขาย</h3>
                    <p className="text-gray-600">เพิ่มและจัดการสินค้าของคุณ</p>
                    <div className="flex items-center mt-2 text-purple-600">
                      <Sparkles className="w-4 h-4 mr-1" />
                      <span className="text-sm">สร้างร้านค้าออนไลน์!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Quick login form for existing users
  if (isExistingUser) {
    return (
      <div className="min-h-screen hero-gradient p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl floating-animation">
              <User className="w-12 h-12 text-primary icon-glow" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
              🔑 เข้าสู่ระบบ
            </h1>
            <Button
              variant="ghost"
              onClick={() => setIsExistingUser(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 glass-card"
            >
              ← กลับไปหน้าหลัก
            </Button>
          </div>

          <Card className="glass-card border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white pb-6">
              <CardTitle className="text-center text-xl font-bold">
                🚀 เข้าใช้งานง่ายๆ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="flex items-center text-gray-700 mb-3 font-medium">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    ชื่อ-นามสกุล
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center text-gray-700 mb-3 font-medium">
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    เบอร์โทรศัพท์
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                    placeholder="08x-xxx-xxxx"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:scale-105 text-white"
                >
                  🚀 เข้าสู่ระบบ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className={`w-24 h-24 glass-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl floating-animation`}>
            {userType === 'seller' ? (
              <Crown className="w-12 h-12 text-primary icon-glow" />
            ) : (
              <Heart className="w-12 h-12 text-primary icon-glow" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
            {userType === 'seller' ? '✨ ลงทะเบียนผู้ขาย' : '💖 ลงทะเบียนผู้ซื้อ'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => {
              setUserType(null);
              setIsExistingUser(false);
            }}
            className="text-white/80 hover:text-white hover:bg-white/10 glass-card"
          >
            ← กลับไปหน้าหลัก
          </Button>
        </div>

        <Card className="glass-card border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className={`text-white pb-6 ${
            userType === 'seller'
              ? 'hero-gradient'
              : 'bg-gradient-to-r from-pink-500 to-rose-600'
          }`}>
            <CardTitle className="text-center text-xl font-bold">
              📝 ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <Label htmlFor="name" className="flex items-center text-gray-700 mb-3 font-medium">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center text-gray-700 mb-3 font-medium">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  เบอร์โทรศัพท์
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                  placeholder="08x-xxx-xxxx"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center text-gray-700 mb-3 font-medium">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center text-gray-700 mb-3 font-medium">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className="rounded-2xl border-gray-200 focus:border-primary h-12 text-lg"
                  placeholder="รหัสผ่าน"
                />
              </div>

              {userType === 'seller' && (
                <>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                    <h3 className="text-sm font-bold text-purple-700 mb-3 flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      ข้อมูลผู้ขาย
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="promptPay" className="flex items-center text-gray-700 mb-2 font-medium text-sm">
                          <CreditCard className="w-4 h-4 mr-2 text-green-600" />
                          พร้อมเพย์
                        </Label>
                        <Input
                          id="promptPay"
                          type="text"
                          value={formData.promptPay}
                          onChange={handleInputChange('promptPay')}
                          className="rounded-xl border-purple-200 focus:border-purple-400 h-10"
                          placeholder="เบอร์โทรหรือ ID Card"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lineId" className="flex items-center text-gray-700 mb-2 font-medium text-sm">
                          <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                          Line ID
                        </Label>
                        <Input
                          id="lineId"
                          type="text"
                          value={formData.lineId}
                          onChange={handleInputChange('lineId')}
                          className="rounded-xl border-purple-200 focus:border-purple-400 h-10"
                          placeholder="Line ID สำหรับติดต่อ"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className={`w-full py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 ${
                  userType === 'seller'
                    ? 'hero-gradient hover:scale-105'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 hover:scale-105'
                } text-white`}
              >
                {userType === 'seller' ? '🚀 เริ่มขายสินค้า' : '🎉 เริ่มช็อปปิ้ง'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
