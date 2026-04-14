import api from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Get all categories
export const getCategories = async () => {
  const response = await api.get<Category[]>("/categories");
  return response.data.data || response.data;
};

// Create category (for admin)
export const createCategory = async (name: string) => {
  const response = await api.post("/categories", { name });
  return response.data.data || response.data
};