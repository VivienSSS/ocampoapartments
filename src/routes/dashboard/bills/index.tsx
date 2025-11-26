import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/bills/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/bills/"!</div>;
}
