// src/app/(dashboardLayout)/user/@content/orders/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { useUserOrders } from "@/hooks/useUserDashboard";

const statusColors: Record<string, string> = {
  PENDING: "badge-warning",
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrdersPage() {
  const { data: ordersData, isLoading, isError, refetch } = useUserOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Extract orders array from response
  const orders = React.useMemo(() => {
    if (!ordersData) return [];
    if (Array.isArray(ordersData)) return ordersData;
    if (ordersData && typeof ordersData === 'object' && 'data' in ordersData && Array.isArray(ordersData.data)) {
      return ordersData.data;
    }
    return [];
  }, [ordersData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load orders</p>
          <button onClick={() => refetch()} className="btn btn-sm btn-primary mt-3">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet</p>
        <Link href="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order: Order) => (
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
                  <span className={`badge ${statusColors[order.status] || "badge-info"} gap-1`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
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
                <h3 className="font-semibold text-gray-700">Order Items</h3>
                <div className="space-y-3">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-3">
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden">
                        {item.medicine?.image ? (
                          <Image
                            src={item.medicine.image}
                            alt={item.medicine.name || "Product"}
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
                        <p className="font-medium">{item.medicine?.name || "Unknown Product"}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>

                      <p className="font-semibold">
                        ৳{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Order Total</span>
                    <span className="text-xl font-bold text-primary">
                      ৳{order.total.toFixed(2)}
                    </span>
                  </div>
                  {order.status === "PENDING" && (
                    <p className="text-sm text-amber-600 mt-2">
                      Your order is being processed. You will receive updates shortly.
                    </p>
                  )}
                  {order.status === "COMPLETED" && (
                    <p className="text-sm text-green-600 mt-2">
                      Your order has been delivered. Thank you for shopping with us!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}