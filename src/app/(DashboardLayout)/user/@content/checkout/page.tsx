// src/app/(dashboardLayout)/user/@content/checkout/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/hooks/useUserDashboard";
import { Truck, Shield, Clock, MapPin, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/services/cart.service";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading, isError: cartError } = useCart();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }

    // Pass the order data to the mutation
    await createOrderMutation.mutateAsync();
  };

  // Extract items from cartData (which is an object with items and summary)
  const cartItems = cartData?.items || [];
  const cartSummary = cartData?.summary;

  // Calculate totals using the summary from backend or fallback to calculation
  const subtotal = cartSummary?.subtotal ?? cartItems.reduce(
    (sum: number, item: CartItem) => sum + (item.medicine?.price || 0) * (item.quantity || 0), 
    0
  );
  const shipping = cartSummary?.shippingFee ?? (subtotal > 500 ? 0 : 60);
  const total = cartSummary?.total ?? (subtotal + shipping);

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load cart</p>
          <button onClick={() => router.back()} className="btn btn-sm btn-primary mt-3">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out</p>
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Checkout</h1>
        <p className="text-gray-500 mt-1">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mt-1"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="label-text text-sm font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mt-1"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="label-text text-sm font-medium">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input input-bordered w-full mt-1"
                  placeholder="House number, street, area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text text-sm font-medium">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mt-1"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="label-text text-sm font-medium">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="input input-bordered w-full mt-1"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="btn btn-primary w-full mt-4 gap-2 lg:hidden"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" defaultChecked className="radio radio-primary" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled className="radio" />
                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

            <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 relative bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    {item.medicine?.image && (
                      <Image
                        src={item.medicine.image}
                        alt={item.medicine.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.medicine?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">৳{((item.medicine?.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal > 500 && (
                <div className="text-green-600 text-xs">✓ Free shipping applied</div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={createOrderMutation.isPending}
              className="btn btn-primary w-full mt-6 gap-2 hidden lg:flex"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>

            {/* Delivery Info */}
            <div className="mt-6 pt-4 border-t space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-3 h-3" />
                <span>Free delivery on orders ৳500+</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>100% authentic products</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Delivery within 24-48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}