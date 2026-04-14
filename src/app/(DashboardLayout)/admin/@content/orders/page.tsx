// src/app/(dashboardLayout)/admin/@content/orders/page.tsx
"use client";

import { useState } from "react";
import { useAdminOrders, useOrderStats } from "@/hooks/useAdminDashboard";
import { 
  Loader2, 
  AlertCircle, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Calendar, 
  DollarSign, 
  User,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import Image from "next/image";

const statusColors: Record<string, string> = {
  PENDING: "badge-warning",
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: ordersData, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useAdminOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });

  const { data: orderStats, isLoading: statsLoading } = useOrderStats();

  const orders = ordersData?.data || [];
  const meta = ordersData?.meta;

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (ordersLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load orders</p>
          <button onClick={() => refetchOrders()} className="btn btn-sm btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">All Orders</h1>
        <p className="text-gray-500 mt-1">View and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{orderStats?.totalOrders || 0}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{orderStats?.completedOrders || 0}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{orderStats?.pendingOrders || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                ৳{(orderStats?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="select select-bordered w-full"
            >
              <option value="">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 self-center">
            Showing {orders.length} of {meta?.total || 0} orders
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
          <p className="text-gray-500">No orders match your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Order Header */}
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition flex flex-wrap justify-between items-center gap-4"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </span>
                    <span className={`badge ${statusColors[order.status]} gap-1`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{order.customer?.name || order.customer?.email || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-primary">৳{order.total.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-semibold">{order.items?.length || 0}</p>
                  </div>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order.id && (
                <div className="border-t bg-gray-50 p-5 space-y-4">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-3">
                          <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden">
                            {item.medicine?.image ? (
                              <Image
                                src={item.medicine.image}
                                alt={item.medicine.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="font-medium">{item.medicine?.name}</p>
                            <p className="text-sm text-gray-500">
                              Seller: {item.medicine?.seller?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Price: ৳{item.price.toFixed(2)}</p>
                          </div>

                          <p className="font-semibold">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-semibold">৳{(order.total - 60).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Fee</p>
                        <p className="font-semibold">৳60.00</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Order Total</span>
                          <span className="text-xl font-bold text-primary">
                            ৳{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2">{order.customer?.name || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2">{order.customer?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Order Date:</span>
                        <span className="ml-2">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Order ID:</span>
                        <span className="ml-2">{order.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center">
          <div className="join">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="join-item btn btn-sm"
            >
              « Previous
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {page} of {meta.totalPage}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="join-item btn btn-sm"
            >
              Next »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Clock icon component for pending orders
const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default AdminOrdersPage;