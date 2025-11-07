import { createFileRoute, redirect } from '@tanstack/react-router';
import {
    maintenanceRequestStatusStatCardKpiViewQuery,
    maintenanceRequestOverviewStatCardKpiViewQuery,
    highPriorityUnresolvedRequestsStatCardKpiViewQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';
import { MaintenanceStatsSection } from './-stats-section';

interface BldgAdminOverviewData {
    statusStats: any;
    overviewStats: any;
    highPriorityStats: any;
}

export const Route = createFileRoute('/dashboard/bldg-admin-overview/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        // Only building admins can access this page
        if (pb.authStore.record?.role !== UsersRoleOptions["Building Admin"]) {
            throw redirect({ to: '/dashboard' });
        }
        return { context };
    },
    loader: async ({ context }) => {
        const [statusStats, overviewStats, highPriorityStats] = await Promise.all([
            context.queryClient.fetchQuery(maintenanceRequestStatusStatCardKpiViewQuery()),
            context.queryClient.fetchQuery(maintenanceRequestOverviewStatCardKpiViewQuery()),
            context.queryClient.fetchQuery(highPriorityUnresolvedRequestsStatCardKpiViewQuery()),
        ]);
        return { statusStats, overviewStats, highPriorityStats };
    },
});

function RouteComponent() {
    const { statusStats, overviewStats, highPriorityStats } = Route.useLoaderData() as BldgAdminOverviewData;

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
                highPriorityStats={highPriorityStats}
            />
        </div>
    );
}
