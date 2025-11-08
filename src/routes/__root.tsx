import type { TypedPocketBase } from '@/pocketbase/types';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  pocketbase: TypedPocketBase;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <main className="bg-sidebar text-sidebar-foreground">
        <Outlet />
      </main>
    </React.Fragment>
  );
}
