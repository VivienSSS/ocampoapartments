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
                <PortfolioOverviewStats />
            </section>
        </div>
    );
}
