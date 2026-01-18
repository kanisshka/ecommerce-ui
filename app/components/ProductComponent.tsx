import { Award, Crown, Flame, ShoppingCart, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

// Product Card Component

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

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
}> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeStyles = (type: string) => {
    const styles = {
      bestseller: 'bg-black text-white border border-white/20',
      trending: 'bg-white text-black border border-black',
      new: 'bg-gradient-to-r from-gray-800 to-black text-white',
      sale: 'bg-white text-black border border-black',
      premium: 'bg-black text-white border border-white/30',
    };
    return styles[type as keyof typeof styles] || 'bg-gray-900 text-white';
  };

  const getBadgeIcon = (type: string) => {
    const icons = {
      bestseller: <Crown size={14} />,
      trending: <TrendingUp size={14} />,
      new: <Sparkles size={14} />,
      sale: <Flame size={14} />,
      premium: <Award size={14} />,
    };
    return icons[type as keyof typeof icons];
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-200 hover:border-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-5 left-5 ${getBadgeStyles(product.badge.type)} px-3 py-1.5 rounded-full text-xs font-bold z-20 shadow-xl flex items-center gap-1.5`}>
          {getBadgeIcon(product.badge.type)}
          {product.badge.text}
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-5 right-5 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold z-20 shadow-xl border border-white/20">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <div className={`relative bg-gradient-to-br from-gray-50 via-white to-gray-100 p-10 transition-all duration-500 ${isHovered ? 'scale-105 bg-gray-50' : 'scale-100'}`}>
        <div className="text-8xl text-center transform transition-all duration-500">
          {product.image}
        </div>
        
        {/* Quick Add Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end justify-center pb-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
onClick={() => onAddToCart(product)}            
className="bg-white text-black px-3 py-1 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transform hover:scale-105 active:scale-95 transition-all shadow-xl border-2 border-black"
          >
            <ShoppingCart size={18} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
            <Zap size={12} />
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${i < Math.floor(product.rating) ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-black text-black">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through font-medium">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-black' : product.stock > 10 ? 'bg-gray-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium text-gray-600">
            {product.stock > 20 ? 'In Stock' : `Only ${product.stock} left`}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
         onClick={() => onAddToCart(product)}
          className="w-full bg-black text-white py-2 rounded-2xl font-bold text-base hover:bg-gray-900 border-2 border-black transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />
    </div>
  );
};

export default ProductCard;