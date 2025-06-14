import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Download,
  RefreshCw
} from 'lucide-react';
import OrderTable from './OrderTable';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  total: number;
  items: OrderItem[];
  paymentProof?: string;
  rejectionReason?: string;
  trackingNumber?: string;
}

interface OrderManagementProps {
  isAdmin?: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ isAdmin = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock statistics data
  const stats = {
    ordersToday: 5,
    pendingPayments: 3,
    monthlyTotal: 1250.99,
    averageOrderValue: 250.20,
    totalOrders: 25,
    successRate: 92
  };

  // Mock orders data - replace with actual API calls
  const initialMockOrders: Order[] = [
    {
      id: 'ORD-001',
      date: '2024-01-15T10:30:00',
      status: 'delivered',
      paymentStatus: 'verified',
      total: 89.99,
      items: [
        {
          id: '1',
          name: 'Classic White Sneakers',
          image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200',
          quantity: 1,
          price: 89.99
        }
      ],
      paymentProof: 'https://example.com/payment_proof_ORD001.jpg'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10T14:20:00',
      status: 'shipped',
      paymentStatus: 'verified',
      total: 129.99,
      items: [
        {
          id: '2',
          name: 'Premium Leather Wallet',
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200',
          quantity: 1,
          price: 129.99
        }
      ],
      trackingNumber: 'TRK123456',
      paymentProof: 'https://example.com/payment_proof_ORD002.jpg'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05T09:15:00',
      status: 'processing',
      paymentStatus: 'pending',
      total: 45.99,
      items: [
        {
          id: '3',
          name: 'Wireless Earbuds',
          image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=200',
          quantity: 1,
          price: 45.99
        }
      ]
    }
  ];

  const [orders, setOrders] = useState<Order[]>(initialMockOrders);

  const handleStatusChange = async (orderId: string, status: 'verified' | 'rejected', reason?: string) => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to update the order status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, paymentStatus: status } : order
        )
      );
      toast.success(`Order ${orderId} payment ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentProofUpload = (orderId: string, fileUrl: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, paymentProof: fileUrl, paymentStatus: 'pending' } : order
      )
    );
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // In a real app, refetch orders from the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // For now, we'll just reset to initial mock data or fetch new mock data if available
      setOrders(initialMockOrders);
      toast.success('Orders refreshed');
    } catch (error) {
      toast.error('Failed to refresh orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTime = timeFilter === 'all' || true; // Implement time filtering logic
    return matchesSearch && matchesStatus && matchesTime;
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle Filters"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Orders"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-col md:flex-row gap-4"
            >
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orders Grid */}
      <OrderTable
        orders={filteredOrders}
        isAdmin={isAdmin}
        onUpdateStatus={handleStatusChange}
        onPaymentProofUpload={handlePaymentProofUpload}
      />

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900 dark:text-white">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 