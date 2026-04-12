"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { fetchMedicines } from "@/services/medicine.service";
import { fetchSellerOrders } from "@/services/orders.service";

interface Medicine {
  id: string;
  name: string;
  stock: number;
}

interface Order {
  id: string;
  customerName: string;
  medicineName: string;
  quantity: number;
  status: string;
}

const SellerDashboard = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const medData = await fetchMedicines();
        setMedicines(medData);

        const orderData = await fetchSellerOrders();
        setOrders(orderData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary bg-blue-400"></span>
        Loading....
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row pt-10">
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8 w-full">
          <h1 className="text-2xl font-bold text-blue-600">Welcome, Seller!</h1>

          <Link href="/seller/add-medicine">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">
              Add Medicine
            </button>
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8 w-full">
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <Package className="w-10 h-10 text-blue-500 mb-2" />
            <p className="text-gray-500">Total Medicines</p>
            <p className="text-xl font-bold">{medicines.length}</p>
          </div>

          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <ShoppingCart className="w-10 h-10 text-green-500 mb-2" />
            <p className="text-gray-500">Incoming Orders</p>
            <p className="text-xl font-bold">{orders.length}</p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white shadow rounded p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No incoming orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.medicineName}</td>
                      <td>{order.quantity}</td>
                      <td>
                        <span
                          className={`badge gap-1 ${
                            order.status === "Pending"
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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

export default SellerDashboard;
