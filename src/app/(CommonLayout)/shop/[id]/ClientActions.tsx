// src/app/(commonLayout)/shop/[id]/ClientActions.tsx
"use client";

import { useAddToCart } from "@/hooks/useCart";
import { useSession } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  medicineId: string;
  isOutOfStock?: boolean;
}

export default function ClientActions({ medicineId, isOutOfStock = false }: Props) {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const addToCartMutation = useAddToCart();
  
  const user = session?.user || null;
  const isCustomer = user?.role === "CUSTOMER";
  const canAddToCart = user && isCustomer && !isOutOfStock;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add items to cart");
      return;
    }

    if (isOutOfStock) {
      toast.error("This item is out of stock");
      return;
    }

    await addToCartMutation.mutateAsync(medicineId);
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can buy products");
      return;
    }

    if (isOutOfStock) {
      toast.error("This item is out of stock");
      return;
    }

    await addToCartMutation.mutateAsync(medicineId);
    toast.success("Added to cart! Redirecting...");
    setTimeout(() => {
      router.push("/user/cart");
    }, 600);
  };

  if (sessionLoading) {
    return (
      <div className="flex gap-4">
        <div className="skeleton h-12 w-32"></div>
        <div className="skeleton h-12 w-32"></div>
      </div>
    );
  }

  // Out of stock state
  if (isOutOfStock) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <button
            disabled
            className="btn btn-disabled gap-2 cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Out of Stock
          </button>
          
          <button
            disabled
            className="btn btn-outline btn-disabled gap-2 cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            Not Available
          </button>
        </div>
        <p className="text-sm text-red-600">
          This item is currently out of stock. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || !canAddToCart}
          className="btn btn-primary gap-2"
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={addToCartMutation.isPending || !canAddToCart}
          className="btn btn-warning gap-2 text-white border-none hover:bg-amber-600"
          style={{ backgroundColor: '#f59e0b' }}
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      {!user && (
        <p className="text-sm text-gray-500">
          Please <Link href="/login" className="text-primary hover:underline">login</Link> to purchase
        </p>
      )}

      {user && !isCustomer && (
        <p className="text-sm text-amber-600">
          You are logged in as {user.role}. Only customers can purchase medicines.
        </p>
      )}
    </div>
  );
}