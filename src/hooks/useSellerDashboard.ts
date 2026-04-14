/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSellerDashboardStats,
  getSellerOrders,
  updateOrderStatus,
  getSellerMedicines,
  deleteSellerMedicine,
  createSellerMedicine,
  updateMedicineStock,
} from "@/services/sellerDashboard.service";
import { toast } from "react-toastify";

// Seller dashboard stats
export const useSellerDashboard = () => {
  return useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => getSellerDashboardStats(),
    staleTime: 2 * 60 * 1000,
  });
};

// Seller orders
export const useSellerOrders = () => {
  return useQuery({
    queryKey: ["seller-orders"],
    queryFn: () => getSellerOrders(),
    staleTime: 1 * 60 * 1000,
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-dashboard"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update order status");
    },
  });
};

// Seller medicines
export const useSellerMedicines = () => {
  return useQuery({
    queryKey: ["seller-medicines"],
    queryFn: () => getSellerMedicines(),
    staleTime: 2 * 60 * 1000,
  });
};

// Delete medicine mutation
export const useDeleteSellerMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSellerMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      toast.success("Medicine deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete medicine");
    },
  });
};

// Create medicine mutation
export const useCreateSellerMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createSellerMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      toast.success("Medicine added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add medicine");
    },
  });
};

// Update medicine stock mutation
export const useUpdateMedicineStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateMedicineStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      toast.success("Stock updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update stock");
    },
  });
};