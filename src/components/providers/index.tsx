'use client';

import { EdgeStoreProvider } from '@/lib/edgestore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Toaster } from '../ui/sonner';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <EdgeStoreProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    </EdgeStoreProvider>
  );
};
