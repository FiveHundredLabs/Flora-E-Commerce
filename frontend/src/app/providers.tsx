import { useState, type PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './query-client';
import { ErrorBoundary } from './ErrorBoundary';

export function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(createQueryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
