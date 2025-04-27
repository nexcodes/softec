"use client";

import React from "react";
import { Toaster } from "../ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
