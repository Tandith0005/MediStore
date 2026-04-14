
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};