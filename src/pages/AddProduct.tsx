
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/ProductForm';
import { ProductFormData } from '@/types/product';
import { saveProduct } from '@/utils/productStorage';
import { getCurrentUser } from '@/utils/userAuth';

const AddProduct = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleSubmit = (formData: ProductFormData) => {
    if (!currentUser) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบใหม่",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: 'ทั่วไป',
        quantity: parseInt(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
        sellerName: currentUser.name,
        sellerPhone: currentUser.phone,
        sellerPromptPay: currentUser.promptPay || '',
        sellerLineId: currentUser.lineId || '',
        sellerPassword: currentUser.phone,
      };

      const newProduct = saveProduct(productData);
      
      toast({
        title: "เพิ่มสินค้าสำเร็จ!",
        description: `เพิ่มสินค้า "${newProduct.name}" เรียบร้อยแล้ว`,
      });

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return <ProductForm onSubmit={handleSubmit} />;
};

export default AddProduct;
