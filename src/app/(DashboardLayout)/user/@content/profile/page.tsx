"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useDeleteUserAccount, useUpdateUserProfile, useUserProfile } from "@/hooks/useProfile";
import { UserProfile } from "@/services/profile.service";



export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const deleteAccountMutation = useDeleteUserAccount();

  const [formData, setFormData] = useState<Pick<UserProfile, "name" | "phone" | "address">>({
    name: null,
    phone: null,
    address: null,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone ?? null,
        address: profile.address ?? null,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({
      name: formData.name ?? "",
      phone: formData.phone ?? undefined,
      address: formData.address ?? undefined,
    });
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure? This action is permanent and cannot be undone."
    );
    if (confirmed) {
      await deleteAccountMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      {/* Profile Info Cards */}
      <div className="bg-white rounded-xl shadow-sm border divide-y">
        <div className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold">{profile.name ?? "Not provided"}</p>
          </div>
        </div>

        <div className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
        </div>

        <div className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Type</p>
            <p className="font-semibold capitalize">{profile.role}</p>
          </div>
        </div>

        {profile.phone && (
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{profile.phone}</p>
            </div>
          </div>
        )}

        {profile.address && (
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold">{profile.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="label-text">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="label-text">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
              placeholder="Enter your address"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="btn btn-primary"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2 text-red-600 mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-600 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteAccountMutation.isPending}
          className="btn btn-error"
        >
          {deleteAccountMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Delete Account"
          )}
        </button>
      </div>
    </div>
  );
}