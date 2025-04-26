import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type LawyersResponse = InferResponseType<(typeof client.api.lawyer)["$get"]>;

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const useGetLawyers = (params: PaginationParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["lawyers", { page, limit }],
    queryFn: async () => {
      const response = await client.api.lawyer.$get({
        query: { page: page.toString(), limit: limit.toString() },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lawyers");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
