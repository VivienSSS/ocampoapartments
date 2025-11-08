'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { maintenanceRequestOverviewStatCardKpiViewQuery } from '@/pocketbase/queries/maintenanceRequests';

const chartConfig = {
  requestCount: {
    label: 'Request Count',
    color: 'var(--chart-1)',
  },
  assignedCount: {
    label: 'Assigned Count',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function MaintenanceOverviewChart() {
  const { data, isLoading, isError } = useQuery(
    maintenanceRequestOverviewStatCardKpiViewQuery(),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Maintenance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Maintenance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-destructive">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data
  const chartData = data.map((item) => ({
    status: item.status || 'Unknown',
    requestCount: item.requestCount || 0,
    assignedCount: item.assignedCount || 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Maintenance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="requestCount"
                fill="var(--color-requestCount)"
                radius={4}
              />
              <Bar
                dataKey="assignedCount"
                fill="var(--color-assignedCount)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
