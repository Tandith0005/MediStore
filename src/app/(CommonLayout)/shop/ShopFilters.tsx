// src/app/(commonLayout)/shop/ShopFilters.tsx
"use client";
import { FilterParams } from "@/services/medicine.service";
import { categories, manufacturers, priceRanges } from "@/constants";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface ShopFiltersProps {
  onFilterChange: (newFilters: Partial<FilterParams>) => void;
  currentFilters: FilterParams;
}

const ShopFilters = ({ onFilterChange, currentFilters }: ShopFiltersProps) => {
  const [search, setSearch] = useState(currentFilters.search || "");

  const handleSearch = () => {
    onFilterChange({ search: search.trim() || undefined, page: 1 });
  };

  const handleClearFilters = () => {
    setSearch("");
    onFilterChange({
      search: undefined,
      category: undefined,
      manufacturer: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Filter Medicines</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search medicines..."
              className="input input-bordered w-full pl-12 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category */}
          <select
            className="select select-bordered w-full"
            value={currentFilters.category || "All"}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Manufacturer */}
          <select
            className="select select-bordered w-full"
            value={currentFilters.manufacturer || "All"}
            onChange={(e) => onFilterChange({ manufacturer: e.target.value, page: 1 })}
          >
            <option value="All">All Manufacturers</option>
            {manufacturers.map((mfg) => (
              <option key={mfg} value={mfg}>
                {mfg}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <select
            className="select select-bordered w-full"
            value={
              currentFilters.minPrice !== undefined
                ? priceRanges.find(
                    (p) =>
                      p.min === currentFilters.minPrice &&
                      p.max === currentFilters.maxPrice
                  )?.label || ""
                : ""
            }
            onChange={(e) => {
              const range = priceRanges.find((p) => p.label === e.target.value);
              if (range) {
                onFilterChange({
                  minPrice: range.min,
                  maxPrice: range.max,
                  page: 1,
                });
              } else {
                onFilterChange({ minPrice: undefined, maxPrice: undefined, page: 1 });
              }
            }}
          >
            <option value="">Any Price</option>
            {priceRanges.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="select select-bordered w-full"
            value={`${currentFilters.sortBy || "createdAt"}-${currentFilters.sortOrder || "desc"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-") as [
                FilterParams["sortBy"],
                FilterParams["sortOrder"]
              ];
              onFilterChange({ sortBy, sortOrder, page: 1 });
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSearch}
            className="btn btn-primary flex-1 md:flex-none gap-2"
          >
            <Search className="w-4 h-4" />
            Apply Filters
          </button>

          <button
            onClick={handleClearFilters}
            className="btn btn-outline flex-1 md:flex-none gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;