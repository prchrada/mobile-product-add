
import ProductCard from '@/components/ProductCard';
import EmptyState from './EmptyState';
import { Product } from '@/types/product';

interface ProductsListProps {
  products: Product[];
  filteredProducts: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductsList = ({ products, filteredProducts, onEdit, onDelete }: ProductsListProps) => {
  if (filteredProducts.length === 0) {
    return <EmptyState hasProducts={products.length > 0} />;
  }

  return (
    <div className="space-y-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductsList;
