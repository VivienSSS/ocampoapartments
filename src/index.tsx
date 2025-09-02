import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { routeTree } from './routeTree.gen';
import './styles/globals.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="pocketbase-template-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>,
  );
}
