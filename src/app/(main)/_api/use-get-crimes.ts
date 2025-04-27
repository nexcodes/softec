import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export const useGetCrimes = () => {
  return useQuery({
    queryKey: ['crimes'],
    queryFn: async () => {
      const response = await client.api.crime.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch crimes');
      }

      const { data } = await response.json();

      return data;
    },
  });
};
