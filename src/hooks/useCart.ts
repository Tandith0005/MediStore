// src/hooks/useCart.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertCart, getCart, removeFromCart, decreaseCartQuantity, clearCart } from "@/services/cart.service";
import { toast } from "react-toastify";

// Get cart
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    staleTime: 1 * 60 * 1000,
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (medicineId: string) => upsertCart(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    },
  });
};

// Remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (medicineId: string) => removeFromCart(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove from cart");
    },
  });
};

// Decrease quantity
export const useDecreaseCartQuantity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (medicineId: string) => decreaseCartQuantity(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update quantity");
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    },
  });
};