import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.crime)[":id"]["comments"]["$post"]
>;

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, { crimeId: string; content: string }>(
    {
      mutationFn: async ({ crimeId, content }) => {
        const response = await client.api.crime[":id"]["comments"]["$post"]({
          param: { id: crimeId },
          json: { content },
        });

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        return response.json();
      },
      onSuccess: (_, variables) => {
        // Invalidate queries that might be affected by this comment
        queryClient.invalidateQueries({
          queryKey: ["crime", variables.crimeId],
        });
        queryClient.invalidateQueries({
          queryKey: ["crime", variables.crimeId, "comments"],
        });
      },
    }
  );
};
