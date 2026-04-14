/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "@/services/profile.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; phone?: string; address?: string }) =>
      updateUserProfile(data),
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
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete account"
      );
    },
  });
};