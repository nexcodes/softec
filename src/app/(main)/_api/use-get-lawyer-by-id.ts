import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type LawyerResponse = InferResponseType<
  (typeof client.api.lawyer.lawyers)[':id']['$get']
>;

export const useGetLawyerById = (lawyerId: string) => {
  return useQuery({
    queryKey: ['lawyer', lawyerId],
    queryFn: async () => {
      const response = await client.api.lawyer.lawyers[':id'].$get({
        param: { id: lawyerId },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lawyer');
      }

      const data = (await response.json()) as LawyerResponse;
      return data;
    },
    enabled: !!lawyerId, // Only run query if lawyerId exists
  });
};
