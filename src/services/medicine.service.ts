// src/services/medicine.service.ts
import api from "@/lib/axios";
import { envVars } from "@/config/envVars";

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
  manufacturer: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface FilterParams {
  search?: string;
  category?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

// Get all medicines with pagination & filters
export const fetchMedicines = async (params?: FilterParams): Promise<ApiResponse<Medicine[]>> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }
  const queryString = queryParams.toString();
  const url = `/medicine${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<ApiResponse<Medicine[]>>(url);
  return response.data; 
};

// Get single medicine
export const fetchSpecificMedicine = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicine/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as Medicine; // unwrap { success, message, data }
};

// Get seller's own medicines
export const fetchMyMedicines = async () => {
  const response = await api.get<Medicine[]>("/medicine/my");
  return response.data;
};

// Delete medicine
export const deleteMedicine = async (id: string) => {
  await api.delete(`/medicine/${id}`);
};

// Create medicine
export const createMedicine = async (data: FormData) => {
  const response = await api.post("/medicine", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update medicine
export const updateMedicine = async (id: string, data: Partial<Medicine>) => {
  const response = await api.patch(`/medicine/${id}`, data);
  return response.data;
};