/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(commonLayout)/shop/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Medicine, FilterParams } from "@/services/medicine.service";
import Image from "next/image";
import Link from "next/link";
import ShopFilters from "./ShopFilters";
import { useMedicines } from "@/hooks/useMedicine";

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading, isError, error } = useMedicines(filters);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };


  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [filters]);

  if (isError) {
    return (
      <div className="min-h-screen pt-28 pb-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load medicines</p>
          <p className="text-gray-500 mt-2">{(error as any)?.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  const medicines = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 mb-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">Shop Medicines</h1>
        <p className="text-center text-gray-600 mt-2">
          {meta?.total || 0} products available
        </p>
      </div>

      {/* Filters - Always visible */}
      <ShopFilters 
        onFilterChange={handleFilterChange} 
        currentFilters={filters} 
      />

      {/* Products Grid */}
      <div className="container mx-auto px-4 mt-8">
        {/* Show skeleton only in the grid area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-md">
                <div className="skeleton h-48 w-full rounded-t-xl"></div>
                <div className="card-body">
                  <div className="skeleton h-6 w-3/4"></div>
                  <div className="skeleton h-4 w-full mt-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                  <div className="flex justify-between mt-4">
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-10 w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No medicines found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {medicines.map((product: Medicine) => (
                <div
                  key={product.id}
                  className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
                >
                  <figure className="px-6 pt-6">
                    {product.image ? (
                      <Image
                        src={product.image}
                        width={300}
                        height={300}
                        alt={product.name}
                        className="rounded-xl object-cover h-48 w-full"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-base-200 rounded-xl flex items-center justify-center text-base-content/50">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </figure>
                  <div className="card-body">
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

                    {product.averageRating && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="rating rating-xs">
                          {[...Array(5)].map((_, i) => (
                            <input
                              key={i}
                              type="radio"
                              name={`rating-${product.id}`}
                              className="mask mask-star-2 bg-orange-400"
                              checked={i + 1 === Math.round(product.averageRating || 0)}
                              readOnly
                              disabled
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.totalReviews || 0})
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-primary">
                        ৳{product.price}
                      </span>
                      <Link href={`/shop/${product.id}`}>
                        <button className="btn btn-primary btn-sm">View Details</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
              <div className="flex justify-center mt-12">
                <div className="join">
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={!meta.hasPrev}
                    className="join-item btn btn-outline disabled:opacity-50"
                  >
                    « Previous
                  </button>

                  {[...Array(Math.min(5, meta.totalPage))].map((_, i) => {
                    let pageNum = meta.page <= 3 
                      ? i + 1 
                      : meta.page >= meta.totalPage - 2 
                      ? meta.totalPage - 4 + i 
                      : meta.page - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`join-item btn ${meta.page === pageNum ? "btn-active btn-primary" : "btn-outline"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={!meta.hasNext}
                    className="join-item btn btn-outline disabled:opacity-50"
                  >
                    Next »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}