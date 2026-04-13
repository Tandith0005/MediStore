// src/app/(dashboardLayout)/seller/@content/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Package, TrendingUp, Star, AlertCircle } from "lucide-react";
import { useSellerDashboard } from "@/hooks/useSellerDashboard";

export default function SellerDashboard() {
  const { data: stats, isLoading, isError } = useSellerDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
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
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-sm btn-primary mt-3"
          >
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
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your store performance</p>
        </div>

        <Link href="/seller/add-medicine">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto">
            + Add New Medicine
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">৳{overview.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{overview.totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{overview.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold">{overview.averageRating || 0}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      {charts.topProducts.length > 0 && (
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {charts.topProducts.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.sold} units</td>
                    <td>৳{product.revenue.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {recent.lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Low Stock Alert
          </h2>
          <div className="space-y-2">
            {recent.lowStockProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span className="font-semibold text-red-600">Only {product.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}