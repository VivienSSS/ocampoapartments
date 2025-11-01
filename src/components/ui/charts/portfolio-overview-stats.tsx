'use client';

import { useQuery } from '@tanstack/react-query';
import { porfolioStatCardKpiViewQuery } from '@/pocketbase/queries/payments';
import { StatCard } from './stat-card';
import { Home, Users, Lightbulb, TrendingUp } from 'lucide-react';

export function PortfolioOverviewStats() {
    const { data, isLoading, isError } = useQuery(porfolioStatCardKpiViewQuery());

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data || data.length === 0) {
        return <div>Error loading portfolio data</div>;
    }

    const record = data[0];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Properties"
                value={record.total_properties || 0}
                icon={<Home className="h-4 w-4" />}
                description="Active properties"
            />
            <StatCard
                title="Total Units"
                value={record.total_units || 0}
                icon={<Lightbulb className="h-4 w-4" />}
                description={`${record.occupied_units || 0} occupied`}
            />
            <StatCard
                title="Active Tenants"
                value={record.total_active_tenants || 0}
                icon={<Users className="h-4 w-4" />}
                description="Current tenancies"
            />
            <StatCard
                title="Occupancy Rate"
                value={`${typeof record.overall_occupancy_rate === 'number' ? record.overall_occupancy_rate.toFixed(1) : '0'}%`}
                icon={<TrendingUp className="h-4 w-4" />}
                description="Across all units"
            />
            <StatCard
                title="Monthly Potential"
                value={`₱${(record.total_monthly_potential_revenue || 0).toLocaleString()}`}
                description="Revenue potential"
                className="sm:col-span-2 lg:col-span-4"
            />
        </div>
    );
}
