"use client";

import { categories, manufacturers } from "@/constants";
import uploadToImgbb from "@/services/uploadImg.service";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddMedicine = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
  // form submission login here----------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    try {
      //  upload image
      const imageUrl = await uploadToImgbb(formData.image);

      //  payload
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        manufacturer: formData.manufacturer,
        image: imageUrl,
      };

      //  send to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to save medicine");

      toast.success("Medicine added successfully");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        manufacturer: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-28 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Medicine
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}

            <div>
              <label className="label">Medicine Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Paracetamol 500mg"
                className="input input-bordered w-full"
              />
            </div>

            {/* Price */}
            <div>
              <label className="label">Price (৳)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description about the medicine"
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Category & Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Select category
                </option>

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
              <label className="label">Manufacturer</label>
              <select
                name="manufacturer"
                required
                value={formData.manufacturer}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Select manufacturer
                </option>

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

          {/* Image URL */}
          <div>
            <label className="label">Medicine Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full md:w-auto"
            >
              {loading ? "Uploading..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
