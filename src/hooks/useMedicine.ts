/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedicines, fetchSpecificMedicine, FilterParams, deleteMedicine } from "@/services/medicine.service";
import { toast } from "react-toastify";

// Hook for fetching medicines with pagination & filters
export const useMedicines = (filters: FilterParams = {}) => {
  return useQuery({
    queryKey: ["medicines", filters],
    queryFn: () => fetchMedicines(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching single medicine
export const useMedicine = (id: string) => {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: () => fetchSpecificMedicine(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for deleting medicine
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete medicine");
    },
  });
};