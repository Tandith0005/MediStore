"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { useCart, useAddToCart, useRemoveFromCart, useDecreaseCartQuantity } from "@/hooks/useCart";
import { CartItem } from "@/services/cart.service";


export default function CartPage() {
  const { data: cartData, isLoading, isError, refetch } = useCart();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const decreaseCartQuantityMutation = useDecreaseCartQuantity();

  const handleIncrement = (medicineId: string) => {
    addToCartMutation.mutate(medicineId);
  };

  const handleDecrement = (medicineId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      decreaseCartQuantityMutation.mutate(medicineId);
    }
  };

  const handleRemove = (cartItemId: string) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Failed to load cart</p>
          <button onClick={() => refetch()} className="btn btn-sm btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // console.log('cartData', cartData.summary);
  const items = cartData?.items || [];
  // console.log('items', items);
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any items yet</p>
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Use the summary from backend or calculate it
  const subtotal = cartData?.summary?.subtotal || items.reduce((sum : number, item: CartItem) => sum + (item.medicine?.price || 0) * (item.quantity || 0), 0);
  const shipping = cartData?.summary?.shippingFee || (subtotal > 500 ? 0 : 60);
  const total = cartData?.summary?.total || (subtotal + shipping);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">My Cart</h1>
        <p className="text-gray-500 mt-1">{cartData?.summary?.totalItems || items.length} items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row gap-5">
              {/* Image */}
              <div className="w-full sm:w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
                {item.medicine?.image ? (
                  <Image src={item.medicine.image} alt={item.medicine.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.medicine?.name || "Unknown Product"}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="badge badge-sm">{item.medicine?.category || "Uncategorized"}</span>
                      <span className="badge badge-sm">{item.medicine?.manufacturer || "Unknown"}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="text-red-500 hover:text-red-700"
                    disabled={removeFromCartMutation.isPending}
                  >
                    {removeFromCartMutation.isPending && removeFromCartMutation.variables === item.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-primary">৳{item.medicine?.price || 0}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement(item.medicineId, item.quantity)}
                      disabled={item.quantity <= 1 || decreaseCartQuantityMutation.isPending}
                      className="btn btn-sm btn-outline rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.medicineId)}
                      disabled={addToCartMutation.isPending}
                      className="btn btn-sm btn-outline rounded-full"
                    >
                      {addToCartMutation.isPending && addToCartMutation.variables === item.medicineId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal > 500 && <div className="text-green-600 text-sm">✓ Free shipping applied</div>}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link href="/user/checkout">
              <button className="btn btn-primary w-full mt-6 gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/shop" className="btn btn-outline w-full mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}