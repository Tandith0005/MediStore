"use client";

import { upsertCart } from "@/services/cart.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SessionResult } from "@/constants";

interface Props {
  medicineId: string;
  getUser: SessionResult;
}

export default function ClientActions({ medicineId, getUser }: Props) {
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      if (!getUser?.data?.user) {
        return toast.error("Please login first");
      }

      const role = getUser.data.user.role;

      if (role === "SELLER" || role === "ADMIN") {
        return toast.error("You are not a customer, you can't add to cart!");
      }
      await upsertCart(medicineId);
      toast.success("Added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!getUser?.data?.user) {
        return toast.error("Please login first");
      }

      const role = getUser.data.user.role;

      if (role === "SELLER" || role === "ADMIN") {
        return toast.error("You are not a customer, you can't Buy!");
      }
      await upsertCart(medicineId);
      toast.success("Added to cart! Redirecting...");
      setTimeout(() => {
        router.push("/user/cart");
      }, 600);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }
  };
  return (
    <div className="flex gap-4">
      <button onClick={() => handleAddToCart()} className="btn btn-primary">
        Add to Cart
      </button>
      <button
        onClick={() => handleBuyNow()}
        className="btn btn-outline btn-primary"
      >
        Buy Now
      </button>
    </div>
  );
}
