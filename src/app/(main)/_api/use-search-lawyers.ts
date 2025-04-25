import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type SearchLawyersResponse = InferResponseType<typeof client.api.lawyer.lawyers.search["$get"]>;

interface SearchLawyersParams {
  specialization: string;
  page?: number;
  limit?: number;
}

export const useSearchLawyers = (params: SearchLawyersParams) => {
  const { specialization, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["lawyers", "search", specialization, { page, limit }],
    queryFn: async () => {
      const response = await client.api.lawyer.lawyers.search.$get({
        query: { 
          specialization,
          page: page.toString(), 
          limit: limit.toString() 
        }
      });

      if (!response.ok) {
        throw new Error("Failed to search lawyers");
      }

      const data = await response.json() as SearchLawyersResponse;
      return data;
    },
    enabled: !!specialization, // Only run query if search term exists
  });
};