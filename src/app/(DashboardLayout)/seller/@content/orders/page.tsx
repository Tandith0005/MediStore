// src/app/(dashboardLayout)/seller/@content/orders/page.tsx
"use client";

import React from "react";
import { useSellerOrders, useUpdateOrderStatus } from "@/hooks/useSellerDashboard";
import { AlertCircle, Package } from "lucide-react";

const statusColors = {
  PENDING: "badge-warning",
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
};

export default function SellerOrders() {
  const { data: orders, isLoading, isError } = useSellerOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateStatusMutation.mutateAsync({ orderId, status });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
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
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <Package className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg">No orders yet</p>
        <p className="text-sm">When customers place orders, they&apos;ll appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Incoming Orders</h1>
        <p className="text-gray-500 mt-1">Manage and update order status</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</p>
                <p className="text-sm text-gray-500">
                  Customer: {order.customer.name} ({order.customer.email})
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <select
                className={`select select-sm ${statusColors[order.status as keyof typeof statusColors]} border-none`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updateStatusMutation.isPending}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="border-t pt-3">
              <p className="font-medium text-sm text-gray-600 mb-2">Items:</p>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.medicine.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">৳{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}