'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { financialStatCardKpiViewQuery } from '@/pocketbase/queries/bills';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chartConfig = {
    total_paid: {
        label: 'Total Paid',
        color: 'var(--chart-1)',
    },
    total_outstanding: {
        label: 'Outstanding',
        color: 'var(--chart-2)',
    },
    total_bill_amount: {
        label: 'Total Billed',
        color: 'var(--chart-3)',
    },
    payment_collection_rate: {
        label: 'Collection Rate %',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

export function FinancialOverviewChart() {
    const { data, isLoading, isError } = useQuery(financialStatCardKpiViewQuery());

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Financial Overview</CardTitle>
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
                    <CardTitle className="text-base font-semibold">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-destructive">
                        Error loading chart data
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Transform data - for a single data point, create a simple display
    const record = data[0];
    const chartData = [
        {
            name: 'Financial Summary',
            total_paid: record.total_paid || 0,
            total_outstanding: record.total_outstanding || 0,
            total_bill_amount: record.total_bill_amount || 0,
        },
    ];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                    Financial Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <ChartContainer config={chartConfig} className="h-[160px] w-full">
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="total_paid"
                                    stroke="var(--color-total_paid)"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_outstanding"
                                    stroke="var(--color-total_outstanding)"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_bill_amount"
                                    stroke="var(--color-total_bill_amount)"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="rounded-lg border p-2">
                            <p className="text-muted-foreground text-xs font-medium">Total Billed</p>
                            <p className="text-sm font-semibold">
                                ₱{record.total_bill_amount?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div className="rounded-lg border p-2">
                            <p className="text-muted-foreground text-xs font-medium">Total Paid</p>
                            <p className="text-sm font-semibold">
                                ₱{record.total_paid?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div className="rounded-lg border p-2">
                            <p className="text-muted-foreground text-xs font-medium">Outstanding</p>
                            <p className="text-sm font-semibold">
                                ₱{record.total_outstanding?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div className="rounded-lg border p-2">
                            <p className="text-muted-foreground text-xs font-medium">Collection Rate</p>
                            <p className="text-sm font-semibold">
                                {typeof record.payment_collection_rate === 'number' ? record.payment_collection_rate.toFixed(2) : '0'}%
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
