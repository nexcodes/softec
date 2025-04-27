import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCrime = (crimeId: string) => {
  return useQuery({
    queryKey: ["crime", crimeId],
    queryFn: async () => {
      const response = await client.api.crime[":id"]["$get"]({
        param: { id: crimeId },
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve crime");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!crimeId,
  });
};
