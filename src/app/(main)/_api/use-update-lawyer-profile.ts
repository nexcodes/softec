import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type UpdateLawyerResponse = InferResponseType<typeof client.api.lawyer.lawyer.profile["$put"]>;
type UpdateLawyerParams = Parameters<typeof client.api.lawyer.lawyer.profile["$put"]>[0]["json"];

export const useUpdateLawyerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateLawyerResponse, Error, UpdateLawyerParams>({
    mutationFn: async (data) => {
      const response = await client.api.lawyer.lawyer.profile.$put({
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to update lawyer profile");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate lawyer queries that might be affected
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
      queryClient.invalidateQueries({ queryKey: ["lawyer"] });
    },
  });
};