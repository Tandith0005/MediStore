import api from "@/lib/axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  isDeleted: boolean;
  image?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
    manufacturer: string;
    stock: number;
  };
}

export interface Order {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    medicine: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
  customer: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalSpent: number;
    totalReviews: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  recentOrders: Order[];
}

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get<UserProfile>("/user/profile");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data: { name: string }) => {
  const response = await api.patch<UserProfile>("/user/me", data);
  return response.data;
};

// Delete user account
export const deleteUserAccount = async () => {
  await api.delete("/user/me");
};

// Get user dashboard stats
export const getUserDashboardStats = async () => {
  const response = await api.get<DashboardStats>("/dashboard/customer");
  return response.data;
};

// Get user cart
export const getUserCart = async () => {
  const response = await api.get("/cart");
  
  if (response.data && typeof response.data === 'object') {
    if ('items' in response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if ('data' in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  }
  return [];
};

// Update cart item quantity
export const updateCartItemQuantity = async (medicineId: string, action: "increment" | "decrement") => {
  if (action === "increment") {
    const response = await api.patch(`/cart/${medicineId}`);
    return response.data;
  } else {
    const response = await api.patch(`/cart/minus/${medicineId}`);
    return response.data;
  }
};

// Remove cart item
export const removeCartItem = async (cartItemId: string) => {
  await api.delete(`/cart/${cartItemId}`);
};

// Get user orders
export const getUserOrders = async () => {
  const response = await api.get<Order[]>("/orders");
  return response.data;
};

// Create order
export const createOrder = async () => {
  const response = await api.post("/orders");
  return response.data;
};