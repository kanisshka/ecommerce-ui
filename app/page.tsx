// app/products/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Zap, 
} from 'lucide-react';
import ProductCard from './components/ProductComponent'

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  badge?: {
    text: string;
    type: 'bestseller' | 'trending' | 'new' | 'sale' | 'premium';
  };
  image: string;
  stock: number;
}

// Sample Products Data
const products: Product[] = [
  {
    id: 1,
    name: 'AirWave Pro Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 1247,
    category: 'Audio',
    badge: { text: 'Best Seller', type: 'bestseller' },
    image: '🎧',
    stock: 24
  },
  {
    id: 2,
    name: 'Quantum Watch Ultra',
    price: 549.99,
    rating: 4.8,
    reviews: 892,
    category: 'Wearables',
    badge: { text: 'Trending', type: 'trending' },
    image: '⌚',
    stock: 15
  },
  {
    id: 3,
    name: 'ErgoLift Pro Stand',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 2341,
    category: 'Accessories',
    badge: { text: 'Hot Sale', type: 'sale' },
    image: '💻',
    stock: 56
  },
  {
    id: 4,
    name: 'HyperHub USB-C Elite',
    price: 79.99,
    rating: 4.6,
    reviews: 1823,
    category: 'Accessories',
    badge: { text: 'New Arrival', type: 'new' },
    image: '🔌',
    stock: 89
  },
  {
    id: 5,
    name: 'Mech RGB Keyboard',
    price: 189.99,
    rating: 4.9,
    reviews: 3456,
    category: 'Gaming',
    badge: { text: 'Premium', type: 'premium' },
    image: '⌨️',
    stock: 32
  },
  {
    id: 6,
    name: 'PrecisionX Pro Mouse',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviews: 1567,
    category: 'Gaming',
    badge: { text: 'Best Seller', type: 'bestseller' },
    image: '🖱️',
    stock: 41
  },
];

const categories = ['All Products', 'Audio', 'Wearables', 'Accessories', 'Gaming'];

// Main Products Page Component
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Premium Black & White */}
      <div className="relative bg-black overflow-hidden border-b-2 border-white/10">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-2 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-2.5 rounded-xl border border-white/20 shadow-xl">
                <Zap className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  NovaTech
                </h1>
                <p className="text-gray-400 text-sm font-medium">Premium Technology</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedProducts.has(product.id)}
              onToggleLike={() => toggleLike(product.id)}
              onAddToCart={() => console.log('Add to cart:', product.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Add to globals.css for animations:
/*
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
*/