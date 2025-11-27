import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { routeTree } from './routeTree.gen';
import './styles/globals.css';
import { pb } from '@/pocketbase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PocketbaseContext } from './pocketbase/context';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient: queryClient, pocketbase: pb },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

router.options.context;

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <PocketbaseContext.Provider value={pb}>
        <ThemeProvider defaultTheme="light" storageKey="apartment-system">
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </PocketbaseContext.Provider>
    </React.StrictMode>,
  );
}
