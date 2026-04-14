// src/app/(dashboardLayout)/admin/@content/dashboard/page.tsx
"use client";

import React from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Layers,
  TrendingUp,
  AlertCircle,
  Loader2,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load dashboard data</p>
          <button onClick={() => refetch()} className="btn btn-sm btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, charts, recent } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your marketplace</p>
      </div>

      {/* Stats Cards - Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{overview.totalUsers}</p>
              <div className="flex gap-2 text-xs mt-1">
                <span className="text-green-600">Active: {overview.activeUsers}</span>
                <span className="text-red-600">Deleted: {overview.deletedUsers}</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Admin Revenue (10%)</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{(overview.adminRevenue || 0).toLocaleString()}
              </p>
              <div className="flex gap-2 text-xs mt-1">
                <span className="text-blue-600">
                  Monthly: ৳{(overview.monthlyAdminRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{overview.totalOrders}</p>
              <div className="flex gap-2 text-xs mt-1">
                <span className="text-yellow-600">Pending: {overview.pendingOrders}</span>
                <span className="text-green-600">Completed: {overview.completedOrders}</span>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products</p>
              <p className="text-2xl font-bold">{overview.totalProducts}</p>
              <div className="text-xs mt-1">
                <span className="text-red-600">Out of Stock: {overview.outOfStockProducts}</span>
              </div>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sellers</p>
              <p className="text-2xl font-bold">{overview.totalSellers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Customers</p>
              <p className="text-2xl font-bold">{overview.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold">৳{(overview.averageOrderValue || 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Categories</p>
              <p className="text-2xl font-bold">{charts.categoryDistribution?.length || 0}</p>
            </div>
            <Layers className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
      </div>

      {/* Revenue Trend - Show both Seller and Admin Revenue */}
      {charts.revenueTrend && charts.revenueTrend.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Admin earns {(overview.adminCommissionRate || 0) * 100}% commission on all seller revenue
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-4 min-w-max">
              {charts.revenueTrend.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="flex gap-1">
                    <div
                      className="bg-blue-500 rounded-t-lg"
                      style={{
                        width: "28px",
                        height: `${Math.min(150, ((day.sellerRevenue || 0) / (overview.monthlySellerRevenue || 1)) * 150)}px`,
                      }}
                      title={`Seller Revenue: ৳{(day.sellerRevenue || 0).toLocaleString()}`}
                    />
                    <div
                      className="bg-green-500 rounded-t-lg"
                      style={{
                        width: "28px",
                        height: `${Math.min(150, ((day.adminRevenue || 0) / (overview.monthlyAdminRevenue || 1)) * 150)}px`,
                      }}
                      title={`Admin Revenue: ৳{(day.adminRevenue || 0).toLocaleString()}`}
                    />
                  </div>
                  <p className="text-xs font-semibold mt-2">৳{(day.sellerRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-green-600">+৳{(day.adminRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{day.date}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Seller Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Admin Revenue (10%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Products with Admin Revenue */}
      {charts.topProducts && charts.topProducts.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Seller Revenue</th>
                </tr>
              </thead>
              <tbody>
                {charts.topProducts.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.totalSold} units</td>
                    <td>৳{(product.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {charts.categoryDistribution && charts.categoryDistribution.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Category Distribution
          </h2>
          <div className="space-y-3">
            {charts.categoryDistribution.map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <span className="w-32 text-sm">{category.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-500 rounded-full h-4 transition-all"
                    style={{
                      width: `${(category.count / (overview.totalProducts || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold w-16 text-right">
                  {category.count} products
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {recent.lowStockProducts && recent.lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Low Stock Alert
          </h2>
          <div className="space-y-2">
            {recent.lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-600 ml-2">by {product.seller.name}</span>
                </div>
                <span className="font-semibold text-red-600">Only {product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recent.recentOrders && recent.recentOrders.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-500 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(-8)}</td>
                    <td>{order.customer.name || order.customer.email}</td>
                    <td>{order._count.items} items</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Users */}
      {recent.recentUsers && recent.recentUsers.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-500 hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${
                        user.role === "ADMIN" ? "badge-primary" :
                        user.role === "SELLER" ? "badge-secondary" : "badge-accent"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}