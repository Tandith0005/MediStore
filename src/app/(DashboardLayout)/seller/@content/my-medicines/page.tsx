"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { fetchMyMedicines, deleteMedicine } from "@/services/medicine.service"; // your service functions
import { toast } from "react-toastify";

type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer: string;
  image: string;
};

const MyMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await fetchMyMedicines();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;

    try {
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((med) => med.id !== id));
      toast.success("Medicine deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete medicine");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen  pb-12 bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600 p-12">My Added Medicines :</h1>
      <div className="container mx-auto px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {medicines.map((product) => (
          <div
            key={product.id}
            className="card bg-white shadow-md hover:shadow-xl transition duration-300 relative"
          >
            {/* Delete icon */}
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-7 h-7 cursor-pointer" />
            </button>


            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>

              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="px-3 py-1 rounded-full bg-blue-500 text-white font-bold shadow-sm">
                  {product.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500 text-white font-bold shadow-sm">
                  {product.manufacturer}
                </span>
              </div>

              <p className="text-sm text-base-content/70 mt-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-primary">
                  ৳{product.price}
                </span>
              </div>
            </div>
          </div>
        ))}

        {medicines.length === 0 && !loading && (
          <p className="text-center col-span-full text-gray-500 mt-10">
            You haven’t added any medicines yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyMedicines;
