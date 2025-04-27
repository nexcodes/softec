import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type DeleteLawyerResponse = InferResponseType<
  typeof client.api.lawyer.lawyers.$delete
>;

export const useDeleteLawyer = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteLawyerResponse, Error>({
    mutationFn: async () => {
      const response = await client.api.lawyer.lawyers.$delete();

      if (!response.ok) {
        throw new Error('Failed to delete lawyer');
      }

      return await response.json();
    },
    onSuccess: () => {
      // Invalidate lawyers list query
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
    },
  });
};
