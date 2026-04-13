// src/app/(dashboardLayout)/seller/@content/add-medicine/page.tsx
"use client";

import { categories, manufacturers } from "@/constants";
import uploadToImgbb from "@/services/uploadImg.service";
import { useCreateSellerMedicine } from "@/hooks/useSellerDashboard";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Upload } from "lucide-react";

const AddMedicine = () => {
  const router = useRouter();
  const createMutation = useCreateSellerMedicine();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    try {
      // Upload image
      const imageUrl = await uploadToImgbb(formData.image);

      // Create FormData for API
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("categoryId", formData.category);
      submitData.append("manufacturer", formData.manufacturer);
      submitData.append("image", imageUrl);

      await createMutation.mutateAsync(submitData);

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        manufacturer: "",
        image: null,
      });

      router.push("/seller/my-medicines");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Add New Medicine</h1>
        <p className="text-gray-500 mt-1">Fill in the details to add a new product</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="label-text font-medium">Medicine Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter medicine name"
                className="input input-bordered w-full mt-1"
              />
            </div>

            {/* Price */}
            <div>
              <label className="label-text font-medium">Price (৳) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input input-bordered w-full mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-text font-medium">Description *</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the medicine..."
              className="textarea textarea-bordered w-full mt-1"
            />
          </div>

          {/* Category & Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text font-medium">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full mt-1"
              >
                <option value="">Select category</option>
                {categories
                  .filter((c) => c !== "All Medicines")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label-text font-medium">Manufacturer *</label>
              <select
                name="manufacturer"
                required
                value={formData.manufacturer}
                onChange={handleChange}
                className="select select-bordered w-full mt-1"
              >
                <option value="">Select manufacturer</option>
                {manufacturers
                  .filter((m) => m !== "All Manufacturers")
                  .map((manufacturer) => (
                    <option key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label-text font-medium">Medicine Image *</label>
            <div className="mt-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {formData.image ? formData.image.name : "Click to upload image"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary w-full md:w-auto"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding Medicine...
                </>
              ) : (
                "Add Medicine"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;