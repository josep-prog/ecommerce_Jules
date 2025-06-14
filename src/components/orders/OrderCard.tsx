import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload,
  ChevronDown,
  ChevronUp,
  Download,
  Truck,
  AlertCircle,
  Receipt,
  MapPin
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

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

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, status: 'verified' | 'rejected', reason?: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isAdmin, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      // Here you would typically upload the file to your server
      toast.success('Payment proof uploaded successfully');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onStatusChange?.(order.id, 'rejected', rejectionReason);
    setShowRejectionModal(false);
    setRejectionReason('');
  };

  return (
    <>
      <motion.div
        layout
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        {/* Order Header */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {order.id}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  title={item.name}
                />
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(order.total)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {isAdmin && order.paymentStatus === 'pending' && (
                <>
                  <button
                    onClick={() => onStatusChange?.(order.id, 'verified')}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Verify Payment"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Reject Payment"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </>
              )}
              {!isAdmin && order.paymentStatus === 'pending' && (
                <label className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer" title="Upload Payment Proof">
                  <Upload className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
              {order.status === 'shipped' && order.trackingNumber && (
                <button
                  onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank')}
                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  title="Track Package"
                >
                  <Truck className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isExpanded ? "Collapse Details" : "Expand Details"}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                {/* Items List */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Order Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Order placed on {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                    {order.paymentStatus === 'verified' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Payment verified
                        </p>
                      </div>
                    )}
                    {order.status === 'shipped' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Order shipped
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      // Implement download receipt functionality
                      toast.success('Receipt downloaded');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Payment
                </h3>
              </div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderCard; 