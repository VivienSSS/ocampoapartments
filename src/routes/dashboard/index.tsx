import { createFileRoute, redirect } from '@tanstack/react-router';
import { PortfolioOverviewStats } from '@/components/ui/charts';
import { UsersRoleOptions } from '@/pocketbase/types';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.user.role !== UsersRoleOptions.Administrator) {
      if (context.user.role === UsersRoleOptions.Tenant) {
        throw redirect({ to: '/dashboard/tenant-overview' });
      }
    }
  },
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your property portfolio.
        </p>
      </div>

      {/* Portfolio Overview */}
      <section>
        <PortfolioOverviewStats />
      </section>
    </div>
  );
}
