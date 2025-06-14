import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import { Package, Truck, CheckCircle, Clock, XCircle, MoreHorizontal, Upload } from 'lucide-react';
import clsx from 'clsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'; // Assuming you have a reusable dropdown menu component

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

interface OrderTableProps {
  orders: Order[];
  isAdmin?: boolean;
  onUpdateStatus?: (orderId: string, status: 'verified' | 'rejected', reason?: string) => void;
  onPaymentProofUpload?: (orderId: string, fileUrl: string) => void;
}

const getStatusClasses = (status: Order['status'] | Order['paymentStatus']) => {
  switch (status) {
    case 'delivered':
    case 'verified':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'processing':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'cancelled':
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusIcon = (status: Order['status'] | Order['paymentStatus']) => {
  switch (status) {
    case 'delivered':
    case 'verified':
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case 'shipped':
      return <Truck className="w-4 h-4 mr-1" />;
    case 'processing':
    case 'pending':
      return <Clock className="w-4 h-4 mr-1" />;
    case 'cancelled':
    case 'rejected':
      return <XCircle className="w-4 h-4 mr-1" />;
    default:
      return <Package className="w-4 h-4 mr-1" />;
  }
};

const OrderTable: React.FC<OrderTableProps> = ({ orders, isAdmin, onUpdateStatus, onPaymentProofUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentOrderId) return;
    const file = e.target.files?.[0];
    if (file) {
      // For demonstration, create a blob URL. In a real app, upload to a backend.
      const fileUrl = URL.createObjectURL(file);
      if (onPaymentProofUpload) {
        onPaymentProofUpload(currentOrderId, fileUrl);
      }
    }
    // Reset the file input value to allow uploading the same file again
    e.target.value = '';
    setCurrentOrderId(null);
  };

  const triggerFileUpload = (orderId: string) => {
    setCurrentOrderId(orderId);
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,.pdf" // Accept images and PDF files
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Payment Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Payment Proof
              </th>
              {isAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={clsx(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusClasses(order.status)
                      )}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={clsx(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusClasses(order.paymentStatus)
                      )}
                    >
                      {order.paymentProof || order.paymentStatus !== 'pending' ? (
                        <>
                          {getStatusIcon(order.paymentStatus)}
                          {order.paymentStatus}
                        </>
                      ) : (
                        '-'
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {order.paymentProof ? (
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        View Proof
                      </a>
                    ) : order.paymentStatus === 'pending' && !isAdmin ? (
                      <button
                        onClick={() => triggerFileUpload(order.id)}
                        className="text-blue-600 hover:underline dark:text-blue-400 flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Proof
                      </button>
                    ) : (
                      '-'
                    )}
                  </td>
                  {isAdmin && onUpdateStatus && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                          {order.paymentStatus === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'verified')}>
                                Verify Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'rejected')}>
                                Reject Payment
                              </DropdownMenuItem>
                            </>
                          )}
                          {/* Add more actions as needed based on order status */}
                          {order.status === 'processing' && (
                            <DropdownMenuItem onClick={() => alert('Implement ship order')}>
                              Ship Order
                            </DropdownMenuItem>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <DropdownMenuItem onClick={() => alert('Implement cancel order')}>
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable; 