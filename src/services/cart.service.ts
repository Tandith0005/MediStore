// src/services/cart.service.ts
import api from "@/lib/axios";

export interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    manufacturer?: string;
    category?: string;
  };
}

export interface CartResponse {
  items: CartItem[];
  summary: {
    subtotal: number;
    totalItems: number;
    shippingFee: number;
    total: number;
  };
}

// Add to cart
export const upsertCart = async (medicineId: string) => {
  const response = await api.patch(`/cart/${medicineId}`);
  return response.data?.data || response.data;
};

// Remove from cart
export const removeFromCart = async (cartItemId: string) => {
  const response = await api.delete(`/cart/${cartItemId}`);
  return response.data?.data || response.data;
};

// Decrease quantity
export const decreaseCartQuantity = async (medicineId: string) => {
  const response = await api.patch(`/cart/minus/${medicineId}`);
  return response.data?.data || response.data;
};

// Get cart
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data?.data || response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data?.data || response.data;
};