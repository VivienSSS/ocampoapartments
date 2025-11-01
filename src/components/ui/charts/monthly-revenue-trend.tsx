'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { monthlyRevenueTrendStatCardKpiViewQuery } from '@/pocketbase/queries/payments';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
    monthlyRevenue: {
        label: 'Monthly Revenue',
        color: 'var(--chart-1)',
    },
    paymentCount: {
        label: 'Payment Count',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

export function MonthlyRevenueTrendChart() {
    const { data, isLoading, isError } = useQuery(monthlyRevenueTrendStatCardKpiViewQuery());

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
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
                    <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
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
        month: item.month || 'Unknown',
        monthlyRevenue: item.monthlyRevenue || 0,
        paymentCount: item.paymentCount || 0,
    }));

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="monthlyRevenue"
                                stroke="var(--color-monthlyRevenue)"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
