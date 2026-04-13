// src/app/(commonLayout)/shop/[id]/page.tsx
import { fetchSpecificMedicine } from "@/services/medicine.service";
import Image from "next/image";
import Link from "next/link";
import ClientActions from "./ClientActions";
import { notFound } from "next/navigation";
import { Star, Package, Truck, Shield, MapPin, Clock } from "lucide-react";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

// Loading component - matches the actual layout perfectly
function ProductSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="skeleton h-4 w-12"></div>
          <div className="skeleton h-4 w-4"></div>
          <div className="skeleton h-4 w-12"></div>
          <div className="skeleton h-4 w-4"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>

        {/* Product Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">
          {/* Image Skeleton */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8">
            <div className="skeleton h-[400px] w-full rounded-xl"></div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="skeleton h-10 w-3/4 mb-2"></div>
              <div className="skeleton h-5 w-32 mb-4"></div>
              <div className="flex items-center gap-2 mb-4">
                <div className="skeleton h-6 w-24"></div>
              </div>
            </div>

            <div>
              <div className="skeleton h-6 w-24 mb-2"></div>
              <div className="skeleton h-20 w-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div>
                <div className="skeleton h-4 w-20 mb-1"></div>
                <div className="skeleton h-5 w-32"></div>
              </div>
              <div>
                <div className="skeleton h-4 w-20 mb-1"></div>
                <div className="skeleton h-5 w-32"></div>
              </div>
            </div>

            <div>
              <div className="skeleton h-4 w-16 mb-1"></div>
              <div className="skeleton h-12 w-40"></div>
            </div>

            <div className="flex gap-4">
              <div className="skeleton h-12 w-32"></div>
              <div className="skeleton h-12 w-32"></div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="skeleton h-4 w-4"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ShopSpecificItem({ params }: Props) {
  const { id } = await params;
  
  if (!id || id === "undefined") {
    notFound();
  }

  const medicine = await fetchSpecificMedicine(id);
  
  if (!medicine || !medicine.id) {
    notFound();
  }

  const isOutOfStock = medicine.stock <= 0;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex gap-2 text-gray-600">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
            <li className="text-gray-400 line-clamp-1 max-w-[200px]">{medicine.name}</li>
          </ul>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">

          {/* Image Section */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8">
            {medicine.image ? (
              <Image
                src={medicine.image}
                alt={medicine.name}
                width={400}
                height={400}
                className="rounded-xl object-contain"
                style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                priority
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {medicine.name}
              </h1>
              
              {/* Rating */}
              {medicine.averageRating ? (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i + 1 <= Math.round(medicine.averageRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {medicine.averageRating} ({medicine.totalReviews || 0} reviews)
                  </span>
                </div>
              ) : (
                <div className="mb-3">
                  <span className="text-sm text-gray-400">No reviews yet</span>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`badge ${!isOutOfStock ? "badge-success" : "badge-error"} gap-1`}>
                  <Package className="w-3 h-3" />
                  {!isOutOfStock ? "In Stock" : "Out of Stock"}
                </div>
                {!isOutOfStock && medicine.stock < 20 && (
                  <span className="text-xs text-amber-600">
                    Only {medicine.stock} left!
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {medicine.description || "No description available"}
              </p>
            </div>

            {/* Manufacturer & Category */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p className="font-medium">{medicine.manufacturer || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{medicine.category?.name || "Uncategorized"}</p>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-4xl font-bold text-primary">
                ৳{medicine.price}
              </p>
              {medicine.price > 500 && !isOutOfStock && (
                <p className="text-sm text-green-600 mt-1">✓ Free shipping eligible</p>
              )}
            </div>

            {/* Actions */}
            <ClientActions medicineId={medicine.id} isOutOfStock={isOutOfStock} />

            {/* Shipping Info */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery on orders ৳500+</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>100% authentic products</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Pan India delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}