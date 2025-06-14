import React from 'react';
import { motion } from 'framer-motion';
import OrderManagement from '../../components/orders/OrderManagement';

const AdminOrderManagement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Orders Management
      </h2>
      <OrderManagement isAdmin={true} />
    </motion.div>
  );
};

export default AdminOrderManagement; 