// src/app/(dashboardLayout)/seller/@content/my-medicines/page.tsx
"use client";

import React from "react";
import { 
  Trash2, 
  Package, 
  AlertCircle, 
  Plus, 
  Minus 
} from "lucide-react";
import { 
  useSellerMedicines, 
  useDeleteSellerMedicine,
  useUpdateMedicineStock 
} from "@/hooks/useSellerDashboard";
import Image from "next/image";
import Link from "next/link";

export default function MyMedicines() {
  const { data: medicines = [], isLoading, isError } = useSellerMedicines();
  const deleteMutation = useDeleteSellerMedicine();
  const updateStockMutation = useUpdateMedicineStock();

  // Separate medicines into In Stock and Out of Stock
  const inStockMedicines = medicines.filter((product) => product.stock > 0);
  const outOfStockMedicines = medicines.filter((product) => product.stock <= 0);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleStockChange = async (id: string, currentStock: number, change: number) => {
    const newStock = Math.max(0, currentStock + change);
    if (newStock === currentStock) return;

    await updateStockMutation.mutateAsync({ id, stock: newStock });
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">My Medicines</h1>
          <p className="text-gray-500 mt-1">
            Total: {medicines.length} products • In Stock: {inStockMedicines.length}
          </p>
        </div>
        <Link href="/seller/add-medicine" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Medicine
        </Link>
      </div>

      {/* In Stock Section */}
      {inStockMedicines.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">In Stock ({inStockMedicines.length})</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inStockMedicines.map((product) => (
              <MedicineCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onStockChange={handleStockChange}
                isUpdating={updateStockMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {inStockMedicines.length > 0 && outOfStockMedicines.length > 0 && (
        <div className="border-t border-gray-200 my-8"></div>
      )}

      {/* Out of Stock Section */}
      {outOfStockMedicines.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              Out of Stock ({outOfStockMedicines.length})
              <AlertCircle className="w-5 h-5 text-red-500" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outOfStockMedicines.map((product) => (
              <MedicineCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onStockChange={handleStockChange}
                isUpdating={updateStockMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {medicines.length === 0 && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-2xl">
          <Package className="w-20 h-20 mb-4 text-gray-300" />
          <p className="text-xl font-medium">No medicines added yet</p>
          <Link href="/seller/add-medicine" className="btn btn-primary mt-6">
            Add Your First Medicine
          </Link>
        </div>
      )}
    </div>
  );
}

// Reusable Medicine Card Component
interface MedicineCardProps {
  product: any;
  onDelete: (id: string, name: string) => void;
  onStockChange: (id: string, currentStock: number, change: number) => void;
  isUpdating: boolean;
}

const MedicineCard = ({ product, onDelete, onStockChange, isUpdating }: MedicineCardProps) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
      {/* Delete Button - Visible only on Hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onDelete(product.id, product.name)}
          className="btn btn-circle btn-sm bg-red-500 hover:bg-red-600 text-white shadow-md"
          title="Delete medicine"
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
            <Package className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold line-clamp-1">{product.name}</h2>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 rounded-full text-xs bg-blue-500 text-white">
            {product.category?.name || "Uncategorized"}
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-emerald-500 text-white">
            {product.manufacturer}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              ৳{product.price}
            </span>
          </div>

          {/* Stock Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStockChange(product.id, product.stock, -1)}
              disabled={isUpdating || product.stock <= 0}
              className="btn btn-sm btn-circle btn-outline hover:bg-red-50 disabled:opacity-50"
              title="Decrease stock"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div
              className={`font-semibold px-4 py-1 rounded-md text-sm min-w-[56px] text-center border ${
                isOutOfStock
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              {product.stock}
            </div>

            <button
              onClick={() => onStockChange(product.id, product.stock, 1)}
              disabled={isUpdating}
              className="btn btn-sm btn-circle btn-outline hover:bg-green-50 disabled:opacity-50"
              title="Increase stock"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isOutOfStock && (
          <p className="text-red-600 text-xs font-medium mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Currently out of stock
          </p>
        )}
      </div>
    </div>
  );
};