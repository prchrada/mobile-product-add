
import { useSalesData } from '@/hooks/useSalesData';
import SalesHeader from '@/components/sales/SalesHeader';
import SalesSearch from '@/components/sales/SalesSearch';
import SellerProductsGroup from '@/components/sales/SellerProductsGroup';
import SalesEmptyState from '@/components/sales/SalesEmptyState';

const Sales = () => {
  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    groupProductsBySeller,
    handleAddToCart,
    formatPrice
  } = useSalesData();

  const groupedProducts = groupProductsBySeller();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-4">
      <div className="max-w-md mx-auto">
        <SalesHeader productsCount={filteredProducts.length} />
        
        <SalesSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* Products Grouped by Seller */}
        <div className="space-y-6">
          {Object.keys(groupedProducts).length === 0 ? (
            <SalesEmptyState hasProducts={products.length > 0} />
          ) : (
            Object.entries(groupedProducts).map(([sellerKey, sellerProducts]) => (
              <SellerProductsGroup
                key={sellerKey}
                sellerKey={sellerKey}
                sellerProducts={sellerProducts}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
