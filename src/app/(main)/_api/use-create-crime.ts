import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.crime.$post>;
type RequestType = InferRequestType<typeof client.api.crime.$post>['json'];

export const useCreateCrime = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const response = await client.api.crime.$post({
        json: values,
      });

      if (!response.ok) {
        throw new Error('Failed to create crime');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      toast.success('Crime registered successfully!');
      // Invalidate and refetch the crimes list after a successful creation
      queryClient.invalidateQueries({ queryKey: ['crimes'] });
    },
  });
};
