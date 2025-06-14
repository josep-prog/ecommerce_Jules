import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  Settings, 
  Heart, 
  CreditCard, 
  MapPin,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import OrderManagement from '../../components/orders/OrderManagement';

type Language = 'en' | 'fr' | 'rw';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'orders', label: 'My Orders', icon: Package, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/dashboard/addresses' },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard, path: '/dashboard/payment' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/dashboard/wishlist' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 2,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 129.99,
      items: 1,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 45.99,
      items: 3,
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? 240 : 80 }}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isSidebarOpen ? 'Dashboard' : 'DB'}
          </h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                location.pathname === item.path ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <item.icon className="w-6 h-6" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'rw')}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>

          <Routes>
            <Route path="/" element={<OrderManagement />} />
            <Route path="/profile" element={<div>Profile Content</div>} />
            <Route path="/addresses" element={<div>Addresses Content</div>} />
            <Route path="/payment" element={<div>Payment Methods Content</div>} />
            <Route path="/wishlist" element={<div>Wishlist Content</div>} />
            <Route path="/settings" element={<div>Settings Content</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;