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
import { revenuePerPropertyChartViewQuery } from '@/pocketbase/queries/properties';

const chartConfig = {
  currentMonthlyRevenue: {
    label: 'Current Revenue',
    color: 'var(--chart-1)',
  },
  totalPotentialMonthlyRevenue: {
    label: 'Potential Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function RevenuePerPropertyChart() {
  const { data, isLoading, isError } = useQuery(
    revenuePerPropertyChartViewQuery(),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Revenue per Property
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
            Revenue per Property
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

  // Transform data for chart
  const chartData = data.map((item) => ({
    address:
      item.address?.replace(/<[^>]*>/g, '').substring(0, 15) + '...' ||
      'Property',
    currentMonthlyRevenue: item.currentMonthlyRevenue || 0,
    totalPotentialMonthlyRevenue: item.totalPotentialMonthlyRevenue || 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Revenue per Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="address"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="currentMonthlyRevenue"
                fill="var(--color-currentMonthlyRevenue)"
                radius={4}
              />
              <Bar
                dataKey="totalPotentialMonthlyRevenue"
                fill="var(--color-totalPotentialMonthlyRevenue)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
