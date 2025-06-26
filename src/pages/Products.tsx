
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
import { ArrowLeft, Plus, Search } from 'lucide-react';

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
    const loadedProducts = getProducts();
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

    // Verify seller password
    if (formData.sellerPassword !== editingProduct.sellerPassword) {
      toast({
        title: "รหัสผ่านไม่ถูกต้อง",
        description: "กรุณากรอกรหัสผ่านที่ถูกต้องเพื่อยืนยันตัวตน",
        variant: "destructive",
      });
      return;
    }

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
        sellerPassword: formData.sellerPassword, // Keep the same password
      };

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

  if (editingProduct) {
    return (
      <div>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleEditSubmit}
          isEditing={true}
        />
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="bg-white shadow-lg"
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            รายการสินค้า ({filteredProducts.length})
          </h1>
          <Button
            onClick={() => navigate('/add-product')}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
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

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {products.length === 0 ? 'ยังไม่มีสินค้า' : 'ไม่พบสินค้าที่ค้นหา'}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {products.length === 0 ? 'เริ่มต้นเพิ่มสินค้าแรกของคุณ' : 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'}
              </p>
              {products.length === 0 && (
                <Button
                  onClick={() => navigate('/add-product')}
                  className="bg-green-600 hover:bg-green-700"
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
