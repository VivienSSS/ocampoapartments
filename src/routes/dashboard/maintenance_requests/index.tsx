import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/maintenance_requests/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/maintenance_requests/"!</div>;
}
