import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, selectedSize, selectedColor);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const colorMap: { [key: string]: string } = {
    white: 'bg-white border-gray-300',
    black: 'bg-black',
    navy: 'bg-blue-900',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex"
      >
        <div className="flex w-full">
          <Link to={`/products/${product.id}`} className="relative w-48 h-48 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
          </Link>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {product.category}
                </span>
                <button
                  onClick={handleWishlistToggle}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <Link to={`/products/${product.id}`} className="block">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Colors:</span>
                  <div className="flex space-x-1">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedColor(color);
                        }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          colorMap[color] || 'bg-gray-300'
                        } ${
                          selectedColor === color
                            ? 'border-blue-500'
                            : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    onClick={(e) => e.preventDefault()}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/products/${product.id}`}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-md"
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <Link
              to={`/products/${product.id}`}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {product.name}
          </h3>

          {/* Colors */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className={`w-4 h-4 rounded-full border ${
                    colorMap[color] || 'bg-gray-300'
                  }`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.reviews} reviews
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;