// app/products/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart,
  Zap, 
} from 'lucide-react';
import ProductCard from './components/ProductComponent'
import CartSidebar from './components/SliderComponent';
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
  const [isCartOpen, setIsCartOpen] = useState(false);
const [cart, setCart] = useState<any[]>([]);
const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

const userId = "u1"; // static for demo

const handleAddToCart = async (product: Product) => {
  const payload = {
    userId,
    itemId: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  };

 try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("Cart Updated:", data);

    alert(`${product.name} added to cart 🛒`);
    setCart(prev => {
  const existing = prev.find(i => i.productId === product.id);

  if (existing) {
    return prev.map(i =>
      i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }

  return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
});

  } catch (error) {
    console.error("Failed to add to cart:", error);
    alert("Something went wrong. Please try again.");
  }
};

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
             {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all shadow-xl group"
            >
              <ShoppingCart className="text-white" size={24} strokeWidth={2} />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
<CartSidebar
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  cartItems={cart}
  onUpdateQuantity={(id, qty) =>
    setCart(prev =>
      prev.map(item =>
        item.productId === id ? { ...item, quantity: Math.max(qty, 1) } : item
      )
    )
  }
  onRemoveItem={(id) =>
    setCart(prev => prev.filter(item => item.productId !== id))
  }
/>
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
             onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
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