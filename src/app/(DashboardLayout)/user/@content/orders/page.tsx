"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserOrders } from "@/services/orders.service";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">My Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4 mb-4">
              <div>
                <p className="font-semibold">
                  Order ID: <span className="text-gray-600">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 relative bg-gray-100 rounded">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>

                  <p className="font-semibold">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t mt-6 pt-4 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-lg text-blue-600">
                ৳{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
