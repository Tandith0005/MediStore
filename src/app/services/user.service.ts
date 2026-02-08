import {
  cookies,
  //  headers
} from "next/headers";

// import { toast } from "react-toastify";

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      // const allHeaders = await headers();

      // IMPORTANT: Use the ACTUAL backend URL here for the server-to-server call
      const BACKEND_URL = "https://medi-store-server-tau.vercel.app/api/auth";

      const res = await fetch(`${BACKEND_URL}/get-session`, {
        headers: {
          // Pass the cookies manually from the browser to the backend
          cookie: cookieStore.toString(),
          // Pass the origin so better-auth doesn't get confused
          origin: "https://level-2-assignment-4-blue.vercel.app",
        },
        cache: "no-store",
      });

      if (!res.ok) return { data: null, error: "Network response was not ok" };

      const session = await res.json();
      return { data: session, error: null };
    } catch (error) {
      console.error("Session Fetch Error:", error);
      return { data: null, error: error };
    }
  },

  logout: async function () {
    try {
      const cookieStore = await cookies();
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
        method: "POST",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }
  },
};