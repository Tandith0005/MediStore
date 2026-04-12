// app/admin/dashboard/page.tsx
import { fetchDashboardStats } from "@/services/adminDashboard.service";
import { Users, Package, ShoppingCart, Layers } from "lucide-react";


const AdminDashboard = async () => {
  const stats = await fetchDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="text-blue-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-xl font-bold">{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Package className="text-green-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Medicines</p>
            <h2 className="text-xl font-bold">{stats.totalMedicines}</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <ShoppingCart className="text-purple-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <h2 className="text-xl font-bold">{stats.totalOrders}</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <Layers className="text-orange-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Categories</p>
            <h2 className="text-xl font-bold">{stats.totalCategories}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
