
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { Product, ProductFormData } from '@/types/product';
import { getProducts, deleteProduct, updateProduct } from '@/utils/productStorage';
import { getCurrentSeller, setCurrentSeller } from '@/utils/sellerAuth';
import { ArrowLeft, Plus, Search, Store } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editingId = searchParams.get('edit');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    if (editingId) {
      const product = products.find(p => p.id === editingId);
      if (product) {
        setEditingProduct(product);
      }
    } else {
      setEditingProduct(null);
    }
  }, [editingId, products]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = () => {
    const currentSeller = getCurrentSeller();
    if (!currentSeller) {
      setProducts([]);
      return;
    }

    // Filter products to show only current seller's products
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

  const handleEdit = (product: Product) => {
    setSearchParams({ edit: product.id });
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

  const handleEditSubmit = (formData: ProductFormData) => {
    if (!editingProduct) return;

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
        sellerPassword: editingProduct.sellerPassword, // Keep existing password
      };

      // Update seller info in local storage
      setCurrentSeller({
        name: formData.sellerName,
        phone: formData.sellerPhone,
        promptPay: formData.sellerPromptPay,
        lineId: formData.sellerLineId,
      });

      const updatedProduct = updateProduct(editingProduct.id, updates);
      
      if (updatedProduct) {
        loadProducts();
        setSearchParams({});
        toast({
          title: "แก้ไขสินค้าสำเร็จ!",
          description: `แก้ไขสินค้า "${updatedProduct.name}" เรียบร้อยแล้ว`,
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขสินค้าได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setSearchParams({});
  };

  const currentSeller = getCurrentSeller();

  if (!currentSeller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่ได้เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mb-6">กรุณาเพิ่มสินค้าแรกเพื่อเข้าสู่ระบบผู้ขาย</p>
          <Button
            onClick={() => navigate('/add-product')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มสินค้าแรก
          </Button>
        </div>
      </div>
    );
  }

  if (editingProduct) {
    return (
      <div>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleEditSubmit}
          isEditing={true}
        />
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-6"
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-3 hover:bg-white/70 rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              สินค้าของฉัน ({filteredProducts.length})
            </h1>
            <p className="text-sm text-gray-600">ผู้ขาย: {currentSeller.name}</p>
          </div>
          <Button
            onClick={() => navigate('/add-product')}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 rounded-2xl"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 rounded-2xl">
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-sm border-purple-200 rounded-2xl">
              <SelectItem value="all">หมวดหมู่ทั้งหมด</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-purple-500" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {products.length === 0 ? 'ยังไม่มีสินค้า' : 'ไม่พบสินค้าที่ค้นหา'}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {products.length === 0 ? 'เริ่มต้นเพิ่มสินค้าแรกของคุณ' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
              </p>
              {products.length === 0 && (
                <Button
                  onClick={() => navigate('/add-product')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl px-8"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มสินค้าแรก
                </Button>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
