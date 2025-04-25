import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type DeleteLawyerResponse = InferResponseType<typeof client.api.lawyer.lawyers[":id"]["$delete"]>;

export const useDeleteLawyer = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteLawyerResponse, Error, string>({
    mutationFn: async (lawyerId) => {
      const response = await client.api.lawyer.lawyers[":id"].$delete({
        param: { id: lawyerId }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete lawyer");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate lawyers list query
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
  });
};