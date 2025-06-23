
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/ProductForm';
import { ProductFormData } from '@/types/product';
import { saveProduct } from '@/utils/productStorage';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData: ProductFormData) => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
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
