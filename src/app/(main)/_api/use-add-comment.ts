import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.crime)[':id']['comments']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.crime)[':id']['comments']['$post']
>['json'];

export const useAddComment = (crimeId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.crime[':id']['comments']['$post']({
        param: { id: crimeId },
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate queries that might be affected by this comment
      queryClient.invalidateQueries({
        queryKey: ['crime', crimeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['crime', crimeId, 'comments'],
      });
    },
  });
};
