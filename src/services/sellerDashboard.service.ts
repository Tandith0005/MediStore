import api from "@/lib/axios";

export interface SellerDashboardStats {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    averageRating: number;
  };
  charts: {
    revenueTrend: Array<{ date: string; revenue: number }>;
    topProducts: Array<{
      id: string;
      name: string;
      sold: number;
      revenue: number;
      rating: number;
    }>;
  };
  recent: {
    recentOrders: Array<{
      id: string;
      status: string;
      customer: { name: string; email: string };
      items: Array<{ medicine: { name: string }; quantity: number }>;
      total: number;
      createdAt: string;
    }>;
    lowStockProducts: Array<{
      id: string;
      name: string;
      stock: number;
      price: number;
    }>;
    recentReviews: Array<{
      id: string;
      rating: number;
      comment: string;
      user: { name: string; image: string };
      medicine: { name: string };
      createdAt: string;
    }>;
  };
}

export interface Order {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  customer: { name: string; email: string };
  items: Array<{ id: string; medicine: { name: string }; quantity: number }>;
  total: number;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: { name: string };
  manufacturer: string;
  createdAt: string;
}

// Get seller dashboard stats
export const getSellerDashboardStats = async () => {
  const response = await api.get<SellerDashboardStats>("/dashboard/seller");
  return response.data.data || response.data;
};

// Get seller orders
export const getSellerOrders = async () => {
  const response = await api.get<Order[]>("/orders/seller");
  return response.data.data || response.data;
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch("/orders/status", { orderId, status });
  return response.data.data || response.data;
};

// Get seller's medicines
export const getSellerMedicines = async () => {
  const response = await api.get<Medicine[]>("/medicine/my");
  return response.data.data || response.data;
};

// Delete medicine
export const deleteSellerMedicine = async (id: string) => {
  await api.delete(`/medicine/${id}`);
};

// Create medicine
export const createSellerMedicine = async (data: FormData) => {
  const response = await api.post("/medicine", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data || response.data;
};