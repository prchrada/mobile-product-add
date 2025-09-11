import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../services/productService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    description: '',
    image: ''
  });

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast({
        title: "สำเร็จ",
        description: "เพิ่มสินค้าเรียบร้อยแล้ว",
      });
      navigate('/products');
    },
    onError: () => {
      toast({
        title: "ผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าได้",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(product);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="ชื่อสินค้า"
          value={product.name}
          onChange={(e) => setProduct({...product, name: e.target.value})}
          required
        />
        <Input
          type="number"
          placeholder="ราคา"
          value={product.price}
          onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
          required
        />
        <Input
          placeholder="รายละเอียด"
          value={product.description}
          onChange={(e) => setProduct({...product, description: e.target.value})}
          required
        />
        <Input
          type="url"
          placeholder="URL รูปภาพ"
          value={product.image}
          onChange={(e) => setProduct({...product, image: e.target.value})}
          required
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'กำลังเพิ่มสินค้า...' : 'เพิ่มสินค้า'}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
