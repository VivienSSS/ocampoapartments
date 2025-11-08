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
import { outstandingReceivablesChartViewQuery } from '@/pocketbase/queries/tenants';

const chartConfig = {
  totalOutstanding: {
    label: 'Outstanding Amount',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function OutstandingReceivablesChart() {
  const { data, isLoading, isError } = useQuery(
    outstandingReceivablesChartViewQuery(),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Outstanding Receivables
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
            Outstanding Receivables
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

  // Transform data for chart - top 10
  const chartData = data
    .sort(
      (a, b) =>
        (typeof b.totalOutstanding === 'number' ? b.totalOutstanding : 0) -
        (typeof a.totalOutstanding === 'number' ? a.totalOutstanding : 0),
    )
    .slice(0, 10)
    .map((item) => ({
      name: `${item.firstName} ${item.lastName}`.substring(0, 12),
      totalOutstanding: item.totalOutstanding || 0,
    }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Top Outstanding Receivables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="totalOutstanding"
                fill="var(--color-totalOutstanding)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
