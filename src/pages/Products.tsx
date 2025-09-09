
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '@/types/product';
import { Package } from 'lucide-react';
import { useProductsData } from '@/hooks/useProductsData';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsList from '@/components/products/ProductsList';
import ProductEditForm from '@/components/products/ProductEditForm';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editingId = searchParams.get('edit');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    products,
    filteredProducts,
    searchTerm,
    selectedCategory,
    currentUser,
    setSearchTerm,
    setSelectedCategory,
    handleDelete,
    handleEditSubmit
  } = useProductsData();

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

  const handleEdit = (product: Product) => {
    setSearchParams({ edit: product.id });
  };

  const handleEditFormSubmit = (formData: any) => {
    if (editingProduct && handleEditSubmit(editingProduct, formData)) {
      setSearchParams({});
    }
  };

  const handleCancelEdit = () => {
    setSearchParams({});
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-500">เพื่อเข้าถึงหน้าจัดการสินค้า</p>
        </div>
      </div>
    );
  }

  if (editingProduct) {
    return (
      <ProductEditForm
        editingProduct={editingProduct}
        onSubmit={handleEditFormSubmit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="min-h-screen hero-gradient p-4">
      <div className="max-w-md mx-auto">
        {/* Beautiful header with animated elements */}
        <div className="text-center mb-8 pt-6">
          <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl floating-animation">
            <Package className="w-10 h-10 text-primary icon-glow" />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            ✨ จัดการสินค้า
          </h1>
          <p className="text-white/80 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
            สวัสดี {currentUser?.name} 👋
          </p>
        </div>

        <ProductsHeader 
          currentUser={currentUser} 
          productsCount={filteredProducts.length} 
        />

        <ProductsFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        <ProductsList
          products={products}
          filteredProducts={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Products;
