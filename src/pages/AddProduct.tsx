
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/ProductForm';
import { ProductFormData } from '@/types/product';
import { saveProduct } from '@/utils/productStorage';
import { setCurrentSeller } from '@/utils/sellerAuth';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData: ProductFormData) => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: 'ทั่วไป',
        quantity: parseInt(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerPromptPay: formData.sellerPromptPay,
        sellerLineId: formData.sellerLineId,
        sellerPassword: formData.sellerPhone, // Use phone as password for simplicity
      };

      // Set current seller info
      setCurrentSeller({
        name: formData.sellerName,
        phone: formData.sellerPhone,
        promptPay: formData.sellerPromptPay,
        lineId: formData.sellerLineId,
      });

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
