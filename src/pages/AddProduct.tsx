import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { addProductService } from '@/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [product, setProduct] = useState({
    id: '',
    seller_id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: null as File | null,
    image_url: '',
    created_at: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast({
          title: "ผิดพลาด",
          description: "ขนาดไฟล์ต้องไม่เกิน 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProduct({ ...product, image: file });
    }
  };

  const addProduct = async (productData: typeof product) => {
    await addProductService(productData)
  };

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast({
        title: "สำเร็จ",
        description: "เพิ่มสินค้าเรียบร้อยแล้ว",
      });
      navigate('/products');
    },
    onError: (error) => {
      toast({
        title: "ผิดพลาด",
        description: error.message || "ไม่สามารถเพิ่มสินค้าได้",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.description) {
      toast({
        title: "ผิดพลาด",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }
    mutation.mutate(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4">
      <div className="max-w-md mx-auto">
        <Card className="glass-card border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="hero-gradient text-white pb-6">
            <CardTitle className="text-center text-2xl font-bold">
              ➕ เพิ่มสินค้าใหม่
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ชื่อสินค้า</label>
                <Input
                  placeholder="ระบุชื่อสินค้า"
                  value={product.name}
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                  required
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">ราคา (บาท)</label>
                <Input
                  type="number"
                  placeholder="ระบุราคา"
                  value={product.price}
                  onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
                  required
                  min="0"
                  step="0.01"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">รายละเอียด</label>
                <Textarea
                  placeholder="รายละเอียดสินค้า"
                  value={product.description}
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                  required
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">รูปภาพสินค้า</label>
                <div className="flex flex-col items-center gap-4">
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    {preview ? '🔄 เปลี่ยนรูปภาพ' : '📸 เลือกรูปภาพ'}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'กำลังเพิ่มสินค้า...' : '➕ เพิ่มสินค้า'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
