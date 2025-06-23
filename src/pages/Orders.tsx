
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { Order } from '@/types/cart';
import { getOrders, updateOrderStatus } from '@/utils/cartStorage';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const loadOrders = () => {
    const loadedOrders = getOrders().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(loadedOrders);
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    try {
      const success = updateOrderStatus(orderId, newStatus);
      if (success) {
        loadOrders();
        toast({
          title: "อัปเดตสถานะสำเร็จ",
          description: "เปลี่ยนสถานะคำสั่งซื้อเรียบร้อยแล้ว",
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: Clock },
      confirmed: { label: 'ยืนยันแล้ว', variant: 'default' as const, icon: Package },
      completed: { label: 'เสร็จสิ้น', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'ยกเลิก', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">
            คำสั่งซื้อ ({filteredOrders.length})
          </h1>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="กรองตามสถานะ" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="pending">รอดำเนินการ</SelectItem>
              <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
              <SelectItem value="completed">เสร็จสิ้น</SelectItem>
              <SelectItem value="cancelled">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {orders.length === 0 ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่พบคำสั่งซื้อในสถานะนี้'}
              </p>
              <p className="text-gray-400 text-sm">
                {orders.length === 0 ? 'คำสั่งซื้อจะแสดงที่นี่' : 'ลองเปลี่ยนตัวกรอง'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-md border-0 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        คำสั่งซื้อ #{order.id.slice(-6)}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">ข้อมูลลูกค้า:</h4>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    <p className="text-sm text-gray-600">{order.customerAddress}</p>
                  </div>

                  {/* Order Items */}
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-2">รายการสินค้า:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center mb-1">
                        <span className="text-sm">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="text-sm font-medium">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center font-bold text-green-600">
                    <span>ยอดรวม:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      เปลี่ยนสถานะ:
                    </label>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="pending">รอดำเนินการ</SelectItem>
                        <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                        <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                        <SelectItem value="cancelled">ยกเลิก</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
