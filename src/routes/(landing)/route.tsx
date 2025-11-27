import { createFileRoute, Outlet } from '@tanstack/react-router';
import { LandingLayout } from '@/components/layouts/landing-layout';

export const Route = createFileRoute('/(landing)')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LandingLayout>
      <Outlet />
    </LandingLayout>
  );
}
