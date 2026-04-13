import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authClient.getSession();
      return res.data; // { user, session } | null
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};