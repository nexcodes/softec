import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCrimeData {
  title: string;
  description: string;
  location: string;
  userId?: string;
  isLive?: boolean;
}

export const useCreateCrime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCrimeData) => {
      const response = await client.api.crime.$post({
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to create crime");
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      toast.success("Crime registered successfully!");
      // Invalidate and refetch the crimes list after a successful creation
      queryClient.invalidateQueries({ queryKey: ["crimes"] });
    },
  });
};
