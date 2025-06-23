
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import CartButton from '@/components/CartButton';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/productStorage';
import { addToCart } from '@/utils/cartStorage';
import { ArrowLeft, Plus, Search, Package } from 'lucide-react';

const Sales = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'อิเล็กทรอนิกส์',
    'เสื้อผ้า',
    'อาหารและเครื่องดื่ม',
    'บ้านและสวน',
    'กีฬาและกิจกรรมกลางแจ้ง',
    'ความงาม',
    'หนังสือ',
    'อื่นๆ'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = () => {
    const loadedProducts = getProducts().filter(product => product.quantity > 0);
    setProducts(loadedProducts);
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

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              ขายสินค้า ({filteredProducts.length})
            </h1>
          </div>
          <CartButton />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">หมวดหมู่ทั้งหมด</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {products.length === 0 ? 'ไม่มีสินค้าในสต็อก' : 'ไม่พบสินค้าที่ค้นหา'}
              </p>
              <p className="text-gray-400 text-sm">
                {products.length === 0 ? 'เพิ่มสินค้าเพื่อเริ่มขาย' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-md border-0 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start">
                    <div className="flex items-center mb-2 flex-1">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-3 ${product.imageUrl ? 'hidden' : ''}`}>
                        <Package className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-1">
                          {product.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">ราคา:</span>
                      <span className="font-bold text-green-600 text-xl">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">คงเหลือ:</span>
                      <span className="font-medium text-blue-600">
                        {product.quantity} ชิ้น
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={product.quantity <= 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
