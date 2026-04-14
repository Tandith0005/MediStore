// src/app/(dashboardLayout)/admin/@content/users/page.tsx
"use client";

import { useState } from "react";
import { useAdminUsers, useBanUser, useUnbanUser } from "@/hooks/useAdminDashboard";
import { Search, Loader2, AlertCircle, UserCheck, UserX, Mail, Calendar, Shield } from "lucide-react";

const AdminUsersPage = () => {
  const { data: users, isLoading, isError, refetch } = useAdminUsers();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const handleBanUser = async (userId: string) => {
    if (confirm("Are you sure you want to ban this user?")) {
      await banUserMutation.mutateAsync(userId);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (confirm("Are you sure you want to unban this user?")) {
      await unbanUserMutation.mutateAsync(userId);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError || !users) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>Failed to load users</p>
          <button onClick={() => refetch()} className="btn btn-sm btn-primary mt-3">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(u => !u.isDeleted).length;
  const bannedUsers = users.filter(u => u.isDeleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Manage Users</h1>
        <p className="text-gray-500 mt-1">View and manage all users in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Banned Users</p>
              <p className="text-2xl font-bold text-red-600">{bannedUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sellers</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === "SELLER").length}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="select select-bordered w-full sm:w-48"
          >
            <option value="all">All Roles</option>
            <option value="CUSTOMER">Customers</option>
            <option value="SELLER">Sellers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold ${
                          user.role === "ADMIN" ? "bg-purple-500" :
                          user.role === "SELLER" ? "bg-blue-500" : "bg-green-500"
                        }`}>
                          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{user.name || "No name"}</p>
                        <p className="text-xs text-gray-500">ID: {user.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${
                      user.role === "ADMIN" ? "badge-primary" :
                      user.role === "SELLER" ? "badge-secondary" : "badge-accent"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isDeleted ? (
                      <span className="badge badge-error gap-1">
                        <UserX className="w-3 h-3" /> Banned
                      </span>
                    ) : (
                      <span className="badge badge-success gap-1">
                        <UserCheck className="w-3 h-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {user.role !== "ADMIN" ? (
                      user.isDeleted ? (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          disabled={unbanUserMutation.isPending}
                          className="btn btn-sm btn-success gap-1"
                        >
                          {unbanUserMutation.isPending && unbanUserMutation.variables === user.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          disabled={banUserMutation.isPending}
                          className="btn btn-sm btn-error gap-1"
                        >
                          {banUserMutation.isPending && banUserMutation.variables === user.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserX className="w-3 h-3" />
                          )}
                          Ban
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">Cannot modify admin</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-white shadow rounded-xl p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total Users: {filteredUsers?.length || 0}</span>
          <span>Showing {filteredUsers?.length || 0} of {users.length} users</span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;