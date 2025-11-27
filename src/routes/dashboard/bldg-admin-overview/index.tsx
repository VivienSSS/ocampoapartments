import { createFileRoute, redirect } from '@tanstack/react-router';
import { pb } from '@/pocketbase';
import {
  maintenanceRequestOverviewStatCardKpiViewQuery,
  maintenanceRequestStatusStatCardKpiViewQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import type {
  MaintenanceRequestOverviewStatCardKpiViewResponse,
  MaintenanceRequestStatusStatCardKpiViewResponse,
} from '@/pocketbase/types';
import { UsersRoleOptions } from '@/pocketbase/types';
import { MaintenanceStatsSection } from './-stats-section';

interface BldgAdminOverviewData {
  statusStats: MaintenanceRequestStatusStatCardKpiViewResponse[];
  overviewStats: MaintenanceRequestOverviewStatCardKpiViewResponse[];
}

export const Route = createFileRoute('/dashboard/bldg-admin-overview/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    // Only building admins can access this page
    if (pb.authStore.record?.role !== UsersRoleOptions['Building Admin']) {
      throw redirect({ to: '/dashboard' });
    }
    return { context };
  },
  loader: async ({ context }) => {
    const [statusStats, overviewStats] = await Promise.all([
      context.queryClient.fetchQuery(
        maintenanceRequestStatusStatCardKpiViewQuery(),
      ),
      context.queryClient.fetchQuery(
        maintenanceRequestOverviewStatCardKpiViewQuery(),
      ),
    ]);
    return { statusStats, overviewStats };
  },
});

function RouteComponent() {
  const { statusStats, overviewStats } =
    Route.useLoaderData() as BldgAdminOverviewData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Overview
        </h1>
        <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-2">
          Comprehensive maintenance management overview.
        </p>
      </div>

      {/* Stats Section */}
      <MaintenanceStatsSection
        statusStats={statusStats}
        overviewStats={overviewStats}
      />
    </div>
  );
}
