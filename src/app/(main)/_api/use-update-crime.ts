import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.crime)[':id']['$put']>;
type RequestType = InferRequestType<
  (typeof client.api.crime)[':id']['$put']
>['json'];

export const useUpdateCrime = (crimeId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.crime[':id']['$put']({
        param: { id: crimeId },
        json: data,
      });

      if (!response.ok) {
        throw new Error('Failed to update crime');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch the crimes list
      queryClient.invalidateQueries({ queryKey: ['crimes'] });

      // Update the specific crime in the cache if it exists
      queryClient.invalidateQueries({ queryKey: ['crime', crimeId] });
    },
  });
};
