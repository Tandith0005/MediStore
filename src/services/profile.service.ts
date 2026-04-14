import api from "@/lib/axios";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone?: string | null;
  address?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>("/user/me");
  return response.data.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  phone?: string;
  address?: string;
}): Promise<UserProfile> => {
  const response = await api.patch<ApiResponse<UserProfile>>("/user/me", data);
  return response.data.data;
};

export const deleteUserAccount = async (): Promise<void> => {
  await api.delete<ApiResponse<null>>("/user/me");
};