'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Align staleTime with the refetchInterval used for letters (30s)
            // This ensures data is considered fresh for the duration of the polling interval
            staleTime: 30 * 1000,
            // Prevent refetch on window focus since we're polling
            refetchOnWindowFocus: false,
            // Retry failed requests up to 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
