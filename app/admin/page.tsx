// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  TrendingUp,
  Tag,
  DollarSign,
  ShoppingCart,
  Gift,
  CheckCircle,
  XCircle,
  Copy,
  RefreshCw,
  Calendar,
  Users,
  Zap
} from 'lucide-react';

// Types
interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  used: boolean;
  createdAt: string;
  usedAt?: string;
  orderNumber: number;
}

interface Stats {
  totalOrders: number;
  totalItemsPurchased: number;
  totalPurchaseAmount: number;
  totalDiscountAmount: number;
  couponsIssued: Coupon[];
  nextCouponAt: number;
}

// API Functions - Replace these URLs with your actual API endpoints
const AdminAPI = {
  /**
   * GET /api/admin/stats
   * Fetches all statistics from the backend
   */
  async getStats(): Promise<Stats> {
    try {
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      console.log(data,'data')
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'black' | 'gray' | 'white';
}> = ({ title, value, icon, trend, color }) => {
  const colorStyles = {
    black: 'bg-black text-white border-black',
    gray: 'bg-gray-900 text-white border-gray-900',
    white: 'bg-white text-black border-gray-200'
  };

  return (
    <div className={`${colorStyles[color]} p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color === 'white' ? 'bg-gray-100' : 'bg-white/10'}`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-sm font-semibold mb-2 ${color === 'white' ? 'text-gray-600' : 'text-gray-300'}`}>
        {title}
      </h3>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
};

// Coupon Card Component
const CouponCard: React.FC<{
  coupon: Coupon;
  onCopy: () => void;
}> = ({ coupon, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative p-5 rounded-xl border-2 transition-all ${
      coupon.used 
        ? 'bg-gray-50 border-gray-300' 
        : 'bg-white border-black hover:shadow-lg'
    }`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {coupon.used ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
            <XCircle size={14} />
            Used
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <CheckCircle size={14} />
            Available
          </span>
        )}
      </div>

      <div className="pr-20">
        {/* Coupon Code */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Coupon Code
          </label>
          <div className="flex items-center gap-2">
            <code className="text-2xl font-black text-gray-900 tracking-wider">
              {coupon.code}
            </code>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Copy code"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Discount
            </p>
            <p className="text-lg font-black text-gray-900">
              10% OFF
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Order #
            </p>
            <p className="text-lg font-black text-gray-900">
              {coupon.orderNumber || 'Manual'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await AdminAPI.getStats();
      setStats(data);
    } catch (error) {
      showNotification('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  let availableCoupons;
  let usedCoupons;
if(stats.couponsIssued){
availableCoupons = stats.couponsIssued.filter(c => !c.used).length;
 usedCoupons = stats.couponsIssued.filter(c => c.used).length;
}
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl ${
          notification.type === 'error' 
            ? 'bg-red-500' 
            : 'bg-green-500'
        } text-white font-semibold animate-in slide-in-from-right`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-black border-b-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/20">
                <Zap className="text-white" size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
                <p className="text-gray-400 font-medium">NovaTech Store Analytics</p>
              </div>
            </div>
            <button
              onClick={loadStats}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors border border-white/20"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Package size={24} className="text-black" />}
            color="white"
          />
          <StatsCard
            title="Items Purchased"
            value={stats.totalItemsPurchased}
            icon={<ShoppingCart size={24} className="text-white" />}
            color="black"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalPurchaseAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign size={24} className="text-white" />}
            color="gray"
          />
          <StatsCard
            title="Total Discounts"
            value={`$${stats.totalDiscountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<Tag size={24} className="text-black" />}
            color="white"
          />
        </div>

        {/* Coupon Management Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Coupon Management</h2>
              <p className="text-gray-600">Generate and manage discount coupons</p>
            </div>
          </div>

          {/* Coupon Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <Tag className="text-gray-700" size={20} />
                <span className="text-sm font-semibold text-gray-600 mb-3">Total Coupons</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{stats.couponsIssued.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 ">
                <CheckCircle className="text-green-700" size={20} />
                <span className="text-sm font-semibold text-green-700 mb-3">Available</span>
              </div>
             {stats.couponsIssued && <p className="text-3xl font-black text-green-900">{availableCoupons}</p> }
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 ">
                <XCircle className="text-red-700" size={20} />
                <span className="text-sm font-semibold text-red-700 mb-3">Used</span>
              </div>
            {stats.couponsIssued && <p className="text-3xl font-black text-red-900">{usedCoupons}</p> }
            </div>
          </div>

          {/* Next Coupon Alert */}
          <div className="bg-gradient-to-r from-black to-gray-900 text-white p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} />
              <div>
                <p className="font-semibold">Next automatic coupon in:</p>
                <p className="text-sm text-gray-300">Every 2rd order triggers a new coupon</p>
              </div>
            </div>
            {/* <div className="text-right">
              <p className="text-4xl font-black">{stats.nextCouponAt}</p>
              <p className="text-sm text-gray-300">orders remaining</p>
            </div> */}
          </div>
        </div>

        {/* Coupons List */}
     {stats.couponsIssued &&   
     (<div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
          <h2 className="text-2xl font-black text-gray-900 mb-6">All Coupons ({stats.couponsIssued.length})</h2>
          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {stats.couponsIssued.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onCopy={() => showNotification('Coupon code copied!', 'success')}
                />
              ))}
            </div>
        </div>)}
      </div>
    </div>
  );
}