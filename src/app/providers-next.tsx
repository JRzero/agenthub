"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/modules/auth/auth-provider";
import { ThemeProvider } from "@/modules/settings/theme-provider";

export function ProvidersNext({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60_000,
            gcTime: 30 * 60_000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={queryClient}><ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider></QueryClientProvider>;
}
