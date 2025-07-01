
import { Button } from "@/components/ui/button";
import ProductForm from '@/components/ProductForm';
import { Product, ProductFormData } from '@/types/product';

interface ProductEditFormProps {
  editingProduct: Product;
  onSubmit: (formData: ProductFormData) => void;
  onCancel: () => void;
}

const ProductEditForm = ({ editingProduct, onSubmit, onCancel }: ProductEditFormProps) => {
  return (
    <div>
      <ProductForm
        initialData={editingProduct}
        onSubmit={onSubmit}
        isEditing={true}
      />
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-6"
        >
          ยกเลิก
        </Button>
      </div>
    </div>
  );
};

export default ProductEditForm;
