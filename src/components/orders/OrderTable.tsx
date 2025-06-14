import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Upload,
  FileText,
  Eye
} from 'lucide-react';
import clsx from 'clsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'; // Assuming you have a reusable dropdown menu component

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size?: string;
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

interface OrderTableProps {
  orders: Order[];
  isAdmin?: boolean;
  onUpdateStatus?: (orderId: string, newPaymentStatus?: 'approved' | 'rejected', newDeliveryStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => Promise<void>;
  onPaymentProofUpload?: (orderId: string, file: File) => Promise<void>;
}

const getStatusClasses = (status: Order['deliveryStatus'] | Order['paymentStatus']) => {
  switch (status) {
    case 'delivered':
    case 'approved': // Changed from verified
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

const getStatusIcon = (status: Order['deliveryStatus'] | Order['paymentStatus']) => {
  switch (status) {
    case 'delivered':
    case 'approved': // Changed from verified
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
      if (onPaymentProofUpload) {
        onPaymentProofUpload(currentOrderId, file);
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
                Client Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Order Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Delivery Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Total Amount
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
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {order.clientEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={clsx(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusClasses(order.deliveryStatus)
                      )}
                    >
                      {getStatusIcon(order.deliveryStatus)}
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(order.totalAmount)}
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
                      {getStatusIcon(order.paymentStatus)}
                      {order.paymentStatus}
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
                        <FileText className="w-4 h-4 mr-1 text-gray-500" />
                        View Proof
                      </a>
                    ) : order.paymentStatus === 'pending' && !isAdmin ? (
                      <button
                        onClick={() => triggerFileUpload(order._id)}
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
                              <DropdownMenuItem onClick={() => onUpdateStatus(order._id, 'approved')}> {/* Changed to approved */}
                                Approve Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order._id, 'rejected')}>
                                Reject Payment
                              </DropdownMenuItem>
                            </>
                          )}
                          {order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'cancelled' && (
                            <>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order._id, undefined, 'processing')}> {/* Added delivery status update */}
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order._id, undefined, 'shipped')}> {/* Added delivery status update */}
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateStatus(order._id, undefined, 'delivered')}> {/* Added delivery status update */}
                                Mark as Delivered
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => console.log('View Order', order._id)}>
                            <a href={`/admin/orders/${order._id}`} className="flex items-center w-full">
                              <Eye className="w-4 h-4 mr-2"/>View Details
                            </a>
                          </DropdownMenuItem>
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