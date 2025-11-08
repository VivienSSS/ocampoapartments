'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { billsByStatusChartViewQuery } from '@/pocketbase/queries/bills';

const chartConfig = {
  billCount: {
    label: 'Total Bills',
    color: 'var(--chart-1)',
  },
  totalAmount: {
    label: 'Total Amount',
    color: 'var(--chart-2)',
  },
  overdueCount: {
    label: 'Overdue Bills',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function BillsByStatusChart() {
  const { data, isLoading, isError } = useQuery(billsByStatusChartViewQuery());

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Bills by Status
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

  if (isError || !data) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Bills by Status
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

  // Transform data for the chart
  const chartData = data.map((item) => ({
    status: item.status,
    billCount: item.billCount || 0,
    totalAmount: item.totalAmount || 0,
    overdueCount: item.overdueCount || 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bills by Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="billCount" fill="var(--color-billCount)" radius={4} />
            <Bar
              dataKey="totalAmount"
              fill="var(--color-totalAmount)"
              radius={4}
            />
            <Bar
              dataKey="overdueCount"
              fill="var(--color-overdueCount)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
