import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type CreateLawyerResponse = InferResponseType<typeof client.api.lawyer.lawyer.profile["$post"]>;
type CreateLawyerParams = Parameters<typeof client.api.lawyer.lawyer.profile["$post"]>[0]["json"];

export const useCreateLawyerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateLawyerResponse, Error, CreateLawyerParams>({
    mutationFn: async (data) => {
      const response = await client.api.lawyer.lawyer.profile.$post({
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create lawyer profile");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate user data and lawyer queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    },
  });
};