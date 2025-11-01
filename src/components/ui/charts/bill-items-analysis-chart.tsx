'use client';

import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { billItemAnalysisStatCardKpiViewQuery } from '@/pocketbase/queries/bills';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
    chargeType: {
        label: 'Charge Type',
    },
    itemCount: {
        label: 'Item Count',
        color: 'var(--chart-1)',
    },
    totalAmount: {
        label: 'Total Amount',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

export function BillItemAnalysisChart() {
    const { data, isLoading, isError } = useQuery(billItemAnalysisStatCardKpiViewQuery());

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Bill Items Analysis</CardTitle>
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
                    <CardTitle className="text-base font-semibold">Bill Items Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-destructive">
                        Error loading chart data
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Transform data for pie chart
    const chartData = data.map((item) => ({
        name: item.chargeType,
        value: item.totalAmount || 0,
        itemCount: item.itemCount || 0,
    }));

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                    Bill Items Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
