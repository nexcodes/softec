import { client } from '@/lib/hono';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type ResponseType = InferResponseType<typeof client.api.media.$post>;
type RequestType = InferRequestType<typeof client.api.media.$post>['json'];

export const useCreateMedia = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await client.api.media.$post({
        json: data,
      });

      if (!response.ok) {
        throw new Error('Failed to create media');
      }

      return await response.json();
    },
  });
};
