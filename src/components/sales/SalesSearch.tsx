
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface SalesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SalesSearch = ({ searchTerm, onSearchChange }: SalesSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
    </div>
  );
};

export default SalesSearch;
