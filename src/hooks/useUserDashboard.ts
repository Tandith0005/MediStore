/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserDashboardStats,
  getUserOrders,
  createOrder,
} from "@/services/userDashboard.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Dashboard Stats
export const useUserDashboardStats = () => {
  return useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: () => getUserDashboardStats(),
    staleTime: 2 * 60 * 1000,
  });
};



// Orders
export const useUserOrders = () => {
  return useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const response = await getUserOrders();
      return response;
    },
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