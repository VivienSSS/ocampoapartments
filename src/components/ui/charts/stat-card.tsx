'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({
    title,
    value,
    icon,
    description,
    trend,
    className,
}: StatCardProps) {
    return (
        <Card className={cn('', className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{title}</span>
                    {icon && <span className="text-muted-foreground text-lg">{icon}</span>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <p className="text-2xl font-bold">{value}</p>
                    {description && <p className="text-muted-foreground text-xs">{description}</p>}
                    {trend && (
                        <p
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'} {trend.value}% {trend.label}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
