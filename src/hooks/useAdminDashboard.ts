/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { banUser, getAdminDashboardStats, getAllOrders, getAllUsers, getOrderStats, unbanUser, } from "@/services/adminDashboard.service";
import { toast } from "react-toastify";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => getAdminDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    // onError: (error: any) => {
    //   toast.error(error?.response?.data?.message || "Failed to load dashboard data");
    // },
  });
};

// Get all users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAllUsers(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Ban user mutation
export const useBanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => banUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User banned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to ban user");
    },
  });
};

// Unban user mutation
export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User unbanned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unban user");
    },
  });
};

// Get all orders for admin
export const useAdminOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAllOrders(params),
    staleTime: 1 * 60 * 1000,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: () => getOrderStats(),
    staleTime: 2 * 60 * 1000,   // 2 minutes
    retry: 1,
    // onError: (error: any) => {
    //   toast.error(error?.response?.data?.message || "Failed to load order statistics");
    // },
  });
};