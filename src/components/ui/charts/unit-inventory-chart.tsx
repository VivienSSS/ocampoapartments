'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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
import { unitInventoryChartViewQuery } from '@/pocketbase/queries/properties';

const chartConfig = {
  capacity: {
    label: 'Capacity',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function UnitInventoryChart() {
  const { data, isLoading, isError } = useQuery(unitInventoryChartViewQuery());

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Unit Inventory
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
            Unit Inventory
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
    floor: item.floorNumber || 0,
    price: item.price || 0,
    capacity: item.capacity || 0,
    unitLetter: item.unitLetter || '',
    available: item.isAvailable ? 'Available' : 'Occupied',
    fill: item.isAvailable ? 'var(--chart-1)' : 'var(--chart-2)',
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Unit Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="floor" name="Floor" tick={{ fontSize: 12 }} />
              <YAxis dataKey="price" name="Price" tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter name="Units" data={chartData} fill="var(--chart-1)">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill as string} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
