import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatches,
} from '@tanstack/react-router';
import React from 'react';
import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarRight } from '@/components/sidebar-right';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { pb } from '@/pocketbase';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: () => {
    if (!pb.authStore.isValid) throw redirect({ to: '/login' }); // for fail
  },
});

function RouteComponent() {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) => {
      return match.pathname !== '/' && match.pathname !== '/dashboard';
    })
    .map((match, index, array) => {
      const isLast = index === array.length - 1;
      const title =
        match.pathname
          .split('/')
          .filter(Boolean)
          .pop()
          ?.replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()) ?? '';

      return (
        <React.Fragment key={match.id}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={match.pathname}>{title}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });

  return (
    <SidebarProvider>
      <SidebarLeft variant="sidebar" />
      <SidebarInset className="m-4 rounded-md overflow-x-auto">
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbs}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
