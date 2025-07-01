
import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { getProducts, deleteProduct, updateProduct } from '@/utils/productStorage';
import { getCurrentSeller, setCurrentSeller } from '@/utils/sellerAuth';
import { toast } from '@/hooks/use-toast';

export const useProductsData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentSeller = getCurrentSeller();

  const loadProducts = () => {
    if (!currentSeller) {
      setProducts([]);
      return;
    }

    const allProducts = getProducts();
    const sellerProducts = allProducts.filter(product => 
      product.sellerPhone === currentSeller.phone
    );
    setProducts(sellerProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = (id: string) => {
    try {
      const success = deleteProduct(id);
      if (success) {
        loadProducts();
        toast({
          title: "ลบสินค้าสำเร็จ!",
          description: "ลบสินค้าออกจากระบบเรียบร้อยแล้ว",
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = (editingProduct: Product, formData: ProductFormData) => {
    try {
      const updates = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerPromptPay: formData.sellerPromptPay,
        sellerLineId: formData.sellerLineId,
      };

      setCurrentSeller({
        name: formData.sellerName,
        phone: formData.sellerPhone,
        promptPay: formData.sellerPromptPay,
        lineId: formData.sellerLineId,
      });

      const updatedProduct = updateProduct(editingProduct.id, updates);
      
      if (updatedProduct) {
        loadProducts();
        toast({
          title: "แก้ไขสินค้าสำเร็จ!",
          description: `แก้ไขสินค้า "${updatedProduct.name}" เรียบร้อยแล้ว`,
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขสินค้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
    return false;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  return {
    products,
    filteredProducts,
    searchTerm,
    selectedCategory,
    currentSeller,
    setSearchTerm,
    setSelectedCategory,
    handleDelete,
    handleEditSubmit,
    loadProducts
  };
};
