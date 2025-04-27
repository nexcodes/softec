import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetMapAnalytics = () => {
  return useQuery({
    queryKey: ["map"],
    queryFn: async () => {
      const response = await client.api.crime.map.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch map analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
