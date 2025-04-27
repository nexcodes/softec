import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.crime)[':id']['comments']['$get']
>;

export const useGetCrimeComments = (crimeId: string) => {
  return useQuery<ResponseType, Error>({
    queryKey: ['crime', crimeId, 'comments'],
    queryFn: async () => {
      const response = await client.api.crime[':id']['comments']['$get']({
        param: { id: crimeId },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return response.json();
    },
    enabled: !!crimeId, // Only run the query if we have a crime ID
  });
};
