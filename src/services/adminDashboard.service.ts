// src/services/adminDashboard.service.ts
import api from "@/lib/axios";

export interface AdminDashboardStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    deletedUsers: number;
    totalSellers: number;
    totalCustomers: number;
    totalProducts: number;
    outOfStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    sellerRevenue: number;
    adminRevenue: number;
    monthlySellerRevenue: number;
    monthlyAdminRevenue: number;
    weeklySellerRevenue: number;
    weeklyAdminRevenue: number;
    averageOrderValue: number;
    adminCommissionRate: number;
  };
  charts: {
    revenueTrend: Array<{ 
      date: string; 
      sellerRevenue: number;   
      adminRevenue: number;     
    }>;
    categoryDistribution: Array<{ name: string; count: number }>;
    topProducts: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
      totalSold: number;
      revenue: number;
      adminRevenue: number;     
    }>;
  };
  recent: {
    recentOrders: Array<{
      id: string;
      customer: { name: string; email: string };
      _count: { items: number };
      createdAt: string;
    }>;
    recentUsers: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    lowStockProducts: Array<{
      id: string;
      name: string;
      stock: number;
      price: number;
      seller: { name: string };
    }>;
  };
}

export interface Order {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  total: number;
  createdAt: string;
  updatedAt?: string;
  customer: {
    id: string;
    name: string | null;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    medicine: {
      id: string;
      name: string;
      price: number;
      image?: string;
      seller: {
        id: string;
        name: string;
        email: string;
      };
    };
  }>;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    totalRevenue: number;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isDeleted: boolean;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Get admin dashboard stats
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await api.get("/dashboard/admin");
  return response.data?.data || response.data;
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/user");
  return response.data?.data || response.data;
};

// Ban a user
export const banUser = async (userId: string): Promise<User> => {
  const response = await api.patch(`/user/ban/${userId}`);
  return response.data?.data || response.data;
};

// Unban a user
export const unbanUser = async (userId: string): Promise<User> => {
  const response = await api.patch(`/user/unban/${userId}`);
  return response.data?.data || response.data;
};

// Get all orders for admin
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<OrdersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  
  const url = `/orders/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await api.get(url);
  return response.data?.data || response.data;
};

// Get order statistics for admin
export const getOrderStats = async () => {
  const response = await api.get("/orders/admin/stats");
  return response.data?.data || response.data;
};