"use client";

import { categories, manufacturers, priceRanges } from "@/constants";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ShopFilters = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [manufacturer, setManufacturer] = useState("All");
  const [price, setPrice] = useState("");

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    if (manufacturer !== "All") params.set("manufacturer", manufacturer);

    if (price) {
      const range = priceRanges.find(p => p.label === price);
      if (range) {
        params.set("minPrice", String(range.min));
        params.set("maxPrice", String(range.max));
      }
    }

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicine..."
          className="input input-bordered w-full pl-10"
        />
      </div>

      <select
        className="select select-bordered min-w-[180px]"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All</option>
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <select
        className="select select-bordered min-w-[180px]"
        onChange={(e) => setManufacturer(e.target.value)}
      >
        <option>All</option>
        {manufacturers.map((mfg) => (
          <option key={mfg}>{mfg}</option>
        ))}
      </select>

      <select
        className="select select-bordered min-w-[180px]"
        onChange={(e) => setPrice(e.target.value)}
      >
        <option value="">Any Price</option>
        {priceRanges.map((p) => (
          <option key={p.label}>{p.label}</option>
        ))}
      </select>

      <button onClick={handleFilter} className="btn btn-primary min-w-[120px]">
        Filter
      </button>
    </div>
  );
};

export default ShopFilters;
