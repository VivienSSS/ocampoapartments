import { createFileRoute } from '@tanstack/react-router';
import { pb } from '@/pocketbase';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const healthCheck = await pb.health.check();

    return { healthCheck };
  },
});

function RouteComponent() {
  const { healthCheck } = Route.useLoaderData();

  return (
    <div>
      {healthCheck.message} - {healthCheck.code}
    </div>
  );
}
