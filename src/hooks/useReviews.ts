/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { 
  getMedicineReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  getMyReviews,
  CreateReviewPayload,
  UpdateReviewPayload
} from "@/services/review.service";
import { toast } from "react-toastify";

// Get reviews for a medicine (with pagination)
export const useMedicineReviews = (medicineId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["reviews", medicineId, page, limit],
    queryFn: () => getMedicineReviews(medicineId, page, limit),
    enabled: !!medicineId,
    staleTime: 2 * 60 * 1000,
  });
};

// Create a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewPayload) => createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.medicineId] });
      queryClient.invalidateQueries({ queryKey: ["medicine", variables.medicineId] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    },
  });
};

// Update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewPayload }) => updateReview(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      toast.success("Review updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update review");
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: (_, __, context: any) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      toast.success("Review deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete review");
    },
  });
};

// Get my reviews (with infinite scroll support)
export const useMyReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["my-reviews", page, limit],
    queryFn: () => getMyReviews(page, limit),
    staleTime: 2 * 60 * 1000,
  });
};