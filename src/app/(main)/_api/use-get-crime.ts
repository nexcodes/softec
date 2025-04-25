import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.crime)[":id"]["$get"]>;

export const useGetCrime = (crimeId: string) => {
  return useQuery<ResponseType, Error>({
    queryKey: ["crime", crimeId],
    queryFn: async () => {
      const response = await client.api.crime[":id"]["$get"]({
        param: { id: crimeId },
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve crime");
      }
      return response.json();
    },
    enabled: !!crimeId, // Only run the query if we have a crime ID
  });
};