
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from '@/types/product';
import { Package, X, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const handleDelete = () => {
    onDelete(product.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover mr-4 shadow-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mr-4 ${product.imageUrl ? 'hidden' : ''}`}>
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-10 w-10 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">ราคา:</span>
              <span className="font-bold text-purple-600 text-xl">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">จำนวน:</span>
              <span className="font-semibold text-pink-600">
                {product.quantity} ชิ้น
              </span>
            </div>
          </div>

          <Button
            onClick={() => onEdit(product)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            แก้ไข
          </Button>

          <div className="mt-3 text-xs text-gray-400 text-center">
            เพิ่มเมื่อ: {new Date(product.createdAt).toLocaleDateString('th-TH')}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-3xl bg-white/90 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex items-center justify-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-500" />
              ยืนยันการลบ
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              คุณแน่ใจหรือไม่ที่จะลบสินค้า "{product.name}" 
              การกระทำนี้ไม่สามารถยกเลิกได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2">
            <AlertDialogAction 
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 rounded-2xl"
            >
              ลบสินค้า
            </AlertDialogAction>
            <AlertDialogCancel className="w-full rounded-2xl">ยกเลิก</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductCard;
