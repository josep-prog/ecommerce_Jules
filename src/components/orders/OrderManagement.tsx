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
import api from '../../utils/api'; // Import the api utility
import { useAuth } from '../../contexts/AuthContext';

interface OrderItem {
  productId: string; // Changed from id to productId to match backend
  name: string;
  image: string;
  quantity: number;
  price: number;
  size?: string; // Added size and color as optional
  color?: string;
}

interface Order {
  _id: string; // Changed from id to _id to match MongoDB
  userId: string;
  clientName: string;
  clientEmail: string;
  orderDate: string; // Changed from date
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Changed from status
  paymentStatus: 'pending' | 'approved' | 'rejected'; // Changed from verified to approved
  totalAmount: number; // Changed from total
  items: OrderItem[];
  paymentProof?: string;
  rejectionReason?: string;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderManagementProps {
  isAdmin?: boolean; // Keep this prop for flexibility
}

const OrderManagement: React.FC<OrderManagementProps> = ({ isAdmin = false }) => {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true); // Set to true initially for data fetch
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, isAdmin]); // Refetch when auth status changes or isAdmin prop changes

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const endpoint = isAdmin ? '/api/orders' : '/api/orders/me';
      const response = await api.get(endpoint);
      setOrders(response.data.orders); // Assuming API returns { orders: [...] }
      toast.success('Orders loaded successfully!');
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newPaymentStatus?: 'approved' | 'rejected', newDeliveryStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    if (!isAdmin) return; // Only admin can change status via this function
    setIsLoading(true);
    try {
      if (newPaymentStatus !== undefined) {
        await api.put(`/api/orders/${orderId}/payment-status`, { status: newPaymentStatus });
        toast.success(`Order ${orderId} payment status updated to ${newPaymentStatus}`);
      }
      if (newDeliveryStatus !== undefined) {
        await api.put(`/api/orders/${orderId}/delivery-status`, { status: newDeliveryStatus });
        toast.success(`Order ${orderId} delivery status updated to ${newDeliveryStatus}`);
      }
      fetchOrders(); // Re-fetch orders to reflect changes
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentProofUpload = async (orderId: string, file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('paymentProof', file);

      await api.post(`/api/orders/${orderId}/payment-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Payment proof uploaded successfully! Awaiting admin review.');
      fetchOrders(); // Re-fetch orders to show updated proof status
    } catch (error: any) {
      console.error('Error uploading payment proof:', error);
      toast.error(error.response?.data?.message || 'Failed to upload payment proof.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.deliveryStatus === statusFilter;
    
    // Time filtering logic (placeholder, requires more specific date comparison)
    const matchesTime = timeFilter === 'all' || true; 

    return matchesSearch && matchesStatus && matchesTime;
  });

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Loading orders...</p>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Please log in to view your orders.</p>
      </div>
    );
  }

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
                placeholder="Search orders by ID, client name, or item..."
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
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-700 dark:text-gray-300">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your order history is empty.</p>
        </motion.div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          isAdmin={isAdmin}
          onUpdateStatus={handleStatusChange}
          onPaymentProofUpload={handlePaymentProofUpload}
        />
      )}
    </div>
  );
};

export default OrderManagement; 