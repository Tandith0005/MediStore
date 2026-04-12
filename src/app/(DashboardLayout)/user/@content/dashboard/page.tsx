"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, PackageCheck, User } from "lucide-react";
import { fetchUserOrders } from "@/services/orders.service";
import { fetchCart } from "@/services/cart.service";


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

interface CartItem {
  id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

const UserDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await fetchUserOrders();
        const cartData = await fetchCart();
        setOrders(ordersData);
        setCartItems(cartData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-10">
      <main className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome back 👋
          </h1>

          <Link href="/shop">
            <button className="btn btn-primary w-full sm:w-auto">
              Shop Medicines
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <PackageCheck className="w-10 h-10 text-blue-500 mb-2" />
            <p className="text-gray-500">My Orders</p>
            <p className="text-xl font-bold">{orders.length}</p>
          </div>

          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <ShoppingCart className="w-10 h-10 text-green-500 mb-2" />
            <p className="text-gray-500">Cart Items</p>
            <p className="text-xl font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              You haven’t placed any orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders
                    .slice(0, 5) // show last 5 orders
                    .map((order) =>
                      order.items.map((item, idx) => (
                        <tr key={`${order.id}-${item.id}`}>
                          {idx === 0 && (
                            <td rowSpan={order.items.length}>#{order.id}</td>
                          )}
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          {idx === 0 && (
                            <td rowSpan={order.items.length}>
                              <span
                                className={`badge ${
                                  order.status === "Pending"
                                    ? "badge-warning"
                                    : "badge-success"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500 text-center md:hidden">
            Scroll horizontally to see all columns →
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
