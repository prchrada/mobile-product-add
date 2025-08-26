
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/productSupabase';
import { addToCart } from '@/utils/cartStorage';
import { toast } from '@/hooks/use-toast';

export const useSalesData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts();
      const availableProducts = allProducts.filter(product => product.quantity > 0);
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const groupProductsBySeller = () => {
    const grouped: { [key: string]: Product[] } = {};
    
    filteredProducts.forEach(product => {
      const sellerKey = product.user_id; // Use user_id as key
      if (!grouped[sellerKey]) {
        grouped[sellerKey] = [];
      }
      grouped[sellerKey].push(product);
    });
    
    return grouped;
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.image_url,
        price: product.price,
        quantity: 1,
      });

      toast({
        title: "เพิ่มสินค้าลงตะกร้าแล้ว!",
        description: `เพิ่ม "${product.name}" ลงในตะกร้าสินค้า`,
      });

      // Refresh the page to update cart count
      window.location.reload();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    groupProductsBySeller,
    handleAddToCart,
    formatPrice
  };
};
