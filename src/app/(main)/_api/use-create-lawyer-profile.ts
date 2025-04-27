import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  typeof client.api.lawyer.lawyer.profile.$post
>;
type RequestType = InferRequestType<
  typeof client.api.lawyer.lawyer.profile.$post
>["json"];

export const useCreateLawyerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.lawyer.lawyer.profile.$post({
        json: data,
      });

      if (!response.ok) {
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
