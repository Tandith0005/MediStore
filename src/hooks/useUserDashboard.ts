/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserDashboardStats,
  getUserCart,
  updateCartItemQuantity,
  removeCartItem,
  getUserOrders,
  createOrder,
} from "@/services/userDashboard.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// User Profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getUserProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useDeleteUserAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUserAccount(),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted successfully");
      router.push("/login");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    },
  });
};

// Dashboard Stats
export const useUserDashboardStats = () => {
  return useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: () => getUserDashboardStats(),
    staleTime: 2 * 60 * 1000,
  });
};

// Cart
export const useUserCart = () => {
  return useQuery({
    queryKey: ["user-cart"],
    queryFn: async () => {
      const response = await getUserCart();
      return response;
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ medicineId, action }: { medicineId: string; action: "increment" | "decrement" }) =>
      updateCartItemQuantity(medicineId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update cart");
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove item");
    },
  });
};

// Orders
export const useUserOrders = () => {
  return useQuery({
    queryKey: ["user-orders"],
    queryFn: () => getUserOrders(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => createOrder(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      toast.success("Order placed successfully!");
      router.push("/user/orders");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to place order");
    },
  });
};