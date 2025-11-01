import { createFileRoute } from '@tanstack/react-router';
import { PortfolioOverviewStats, MonthlyRevenueTrendChart } from '@/components/ui/charts';

export const Route = createFileRoute('/dashboard/')({
    component: RouteComponent,
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
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-4">
                    Portfolio Overview
                </h2>
                <PortfolioOverviewStats />
            </section>

            {/* Revenue Trends */}
            <section>
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-4">
                    Revenue Trends
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <MonthlyRevenueTrendChart />
                </div>
            </section>
        </div>
    );
}
