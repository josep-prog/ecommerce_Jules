import React from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';

interface FilterProps {
  filters: {
    category: string;
    priceRange: number[];
    sizes: string[];
    colors: string[];
    rating: number;
    inStock: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const ProductFilters: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'men', label: 'Men\'s Fashion' },
    { value: 'women', label: 'Women\'s Fashion' },
    { value: 'shoes', label: 'Shoes' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11', '12'];
  const colors = ['white', 'black', 'navy', 'blue', 'red', 'green', 'pink', 'gray'];

  const colorMap: { [key: string]: string } = {
    white: 'bg-white border-gray-300',
    black: 'bg-black',
    navy: 'bg-blue-900',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500',
  };

  const handleSizeToggle = (size: string) => {
    setFilters((prev: any) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s: string) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setFilters((prev: any) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c: string) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 200],
      sizes: [],
      colors: [],
      rating: 0,
      inStock: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={filters.category === category.value}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, category: e.target.value }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Price Range
        </h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                priceRange: [0, parseInt(e.target.value)],
              }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>$0</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                filters.sizes.includes(size)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Color
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorToggle(color)}
              className={`w-10 h-10 rounded-full border-2 ${
                colorMap[color] || 'bg-gray-300'
              } ${
                filters.colors.includes(color)
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
              />
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  & up
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) =>
              setFilters(prev => ({ ...prev, inStock: e.target.checked }))
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            In Stock Only
          </span>
        </label>
      </div>
    </motion.div>
  );
};

export default ProductFilters;