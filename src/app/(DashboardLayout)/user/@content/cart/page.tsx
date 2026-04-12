"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { deleteItemsInCart, minusCart, upsertCart } from "@/services/cart.service";

interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category: string;
    manufacturer: string;
  };
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Fetch cart error:", err);
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // ─── Calculate totals ───
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 60 : 0;
  const total = subtotal + shipping;

  // ─── Quantity update handler  ───
  const updateQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  // ─── Remove item handler (placeholder — add real API later) ───
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    deleteItemsInCart(id);
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-outline btn-error"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Empty cart ───
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingCart className="h-24 w-24 text-gray-400 mb-6 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <Link href="/shop" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ─── Main cart view ───
  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-8">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-10">
          My Cart ({cartItems.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6 ">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow duration-300"
              >
                {/* Medicine Image */}
                <div className="w-full sm:w-40 h-40 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.medicine.image ? (
                    <Image
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 160px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {item.medicine.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="badge badge-outline badge-info">
                          {item.medicine.category}
                        </span>
                        <span className="badge badge-outline badge-success">
                          {item.medicine.manufacturer}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn btn-ghost btn-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Price & Quantity */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">
                      ৳{(item.medicine.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>{
                          updateQuantity(
                            item.medicineId,
                            Math.max(1, item.quantity - 1));
                            minusCart(item.medicineId);
                        }
                        }
                        className="btn btn-sm btn-outline rounded-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>{
                          updateQuantity(item.medicineId, item.quantity + 1);
                          upsertCart(item.medicineId);
                        }
                        }
                        className="btn btn-sm btn-outline rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary – sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-blue-500">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping (estimated)</span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 ">
                <Link href="/user/checkout">
                  <button className="btn btn-primary w-full btn-lg ">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
                </Link>
                <Link href="/shop" className="btn btn-outline w-full btn-lg">
                  Continue Shopping
                </Link>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
