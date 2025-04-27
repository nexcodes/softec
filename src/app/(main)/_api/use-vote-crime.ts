import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.crime)[':id']['vote']['$post']
>;

export const useVoteCrime = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, { crimeId: string; value: boolean }>({
    mutationFn: async ({ crimeId, value }) => {
      const response = await client.api.crime[':id']['vote']['$post']({
        param: { id: crimeId },
        json: { value },
      });

      if (!response.ok) {
        throw new Error('Failed to vote on crime');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate queries that might be affected by this vote
      queryClient.invalidateQueries({ queryKey: ['crime', variables.crimeId] });
      queryClient.invalidateQueries({ queryKey: ['crimes'] });
    },
  });
};
