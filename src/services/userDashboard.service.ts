// src/services/userDashboard.service.ts
import api from "@/lib/axios";


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

// Get user dashboard stats
export const getUserDashboardStats = async () => {
  const response = await api.get("/dashboard/customer");
  // console.log(response.data.data);
  return response.data?.data;
};



// Get user orders
export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders");

  const data = response.data?.data ?? response.data;

  return data;
};

// Create order
export const createOrder = async () => {
  const response = await api.post("/orders");
  return response.data;
};
