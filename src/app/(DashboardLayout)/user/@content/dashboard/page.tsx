/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { ShoppingCart, PackageCheck, Star, AlertCircle, Loader2 } from "lucide-react";
import { useUserDashboardStats} from "@/hooks/useUserDashboard";
import { useCart } from "@/hooks/useCart";

export default function UserDashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useUserDashboardStats();
  const { data: cartData, isLoading: cartLoading } = useCart();

  const cartItemCount = cartData?.summary?.totalItems || 0;

  // Safely extract stats overview
  const overview = stats?.overview || {
    totalOrders: 0,
    totalSpent: 0,
    totalReviews: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  };

  const recentOrders = stats?.recentOrders || [];

  if (statsLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load dashboard</p>
          <button onClick={() => window.location.reload()} className="btn btn-sm btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your activity summary</p>
        </div>

        <Link href="/shop">
          <button className="btn btn-primary w-full sm:w-auto">Continue Shopping</button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{overview.totalOrders || 0}</p>
            </div>
            <PackageCheck className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">৳{(overview.totalSpent || 0).toLocaleString()}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Cart Items</p>
              <p className="text-2xl font-bold">{cartItemCount}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reviews</p>
              <p className="text-2xl font-bold">{overview.totalReviews || 0}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/user/orders" className="text-blue-500 hover:underline text-sm">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id?.slice(-8) || order.id}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>৳{(order.total || 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        order.status === "PENDING" ? "badge-warning" :
                        order.status === "COMPLETED" ? "badge-success" : "badge-error"
                      }`}>
                        {order.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}