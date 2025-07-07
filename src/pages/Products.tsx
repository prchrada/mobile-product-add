
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types/product';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-md mx-auto">
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
