
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

interface ProductsFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProductsFilters = ({ 
  searchTerm, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange 
}: ProductsFiltersProps) => {
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

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
        <Input
          placeholder="ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 rounded-2xl"
        />
      </div>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
  );
};

export default ProductsFilters;
