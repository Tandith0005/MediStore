// src/app/(dashboardLayout)/seller/@content/my-medicines/page.tsx
"use client";

import React from "react";
import { Trash2, Edit, Package, AlertCircle } from "lucide-react";
import { useSellerMedicines, useDeleteSellerMedicine } from "@/hooks/useSellerDashboard";
import Image from "next/image";
import Link from "next/link";

export default function MyMedicines() {
  const { data: medicines, isLoading, isError } = useSellerMedicines();
  const deleteMutation = useDeleteSellerMedicine();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-500">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load medicines</p>
        </div>
      </div>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <Package className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg">No medicines added yet</p>
        <Link href="/seller/add-medicine" className="btn btn-primary mt-4">
          Add Your First Medicine
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">My Medicines</h1>
          <p className="text-gray-500 mt-1">Total: {medicines.length} products</p>
        </div>
        <Link href="/seller/add-medicine" className="btn btn-primary btn-sm">
          + Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicines.map((product) => (
          <div
            key={product.id}
            className="card bg-white shadow-md hover:shadow-xl transition duration-300 relative group"
          >
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleDelete(product.id, product.name)}
                className="btn btn-circle btn-sm bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Image */}
            <figure className="px-4 pt-4">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="rounded-xl object-cover h-40 w-full"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </figure>

            <div className="card-body p-4">
              <h2 className="card-title text-lg font-bold line-clamp-1">
                {product.name}
              </h2>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                  {product.category?.name || "Uncategorized"}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-emerald-500 text-white">
                  {product.manufacturer}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-xl font-bold text-primary">
                    ৳{product.price}
                  </span>
                  <span className={`text-xs ml-2 ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}