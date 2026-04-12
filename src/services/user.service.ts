import { serverApi } from "@/lib/serverAxios";

import { envVars } from "@/config/envVars";
import api from "@/lib/axios";

export const userService = {
  // SERVER SIDE (used in Navbar)
  getSession: async function () {
    try {
      const axiosInstance = await serverApi();

      const res = await axiosInstance.get(
        `${envVars.AUTH_URL}/get-session`
      );

      return { data: res.data, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        data: null,
        error: error?.message || "Failed to fetch session",
      };
    }
  },
};