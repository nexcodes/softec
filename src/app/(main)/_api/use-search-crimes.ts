import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type SearchCrimeParams = {
  query: string;
};

type ResponseType = InferResponseType<(typeof client.api.crime.search)['$get']>;

export const useSearchCrimes = (params: SearchCrimeParams, enabled = true) => {
  return useQuery<ResponseType, Error>({
    queryKey: ['crimes', 'search', params.query],
    queryFn: async () => {
      const response = await client.api.crime.search['$get']({
        query: params,
      });

      if (!response.ok) {
        throw new Error('Failed to search crimes');
      }

      return response.json();
    },
    enabled: enabled && !!params.query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
