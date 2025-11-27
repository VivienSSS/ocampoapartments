'use client';

import { Check, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  MaintenanceRequestOverviewStatCardKpiViewResponse,
  MaintenanceRequestStatusStatCardKpiViewResponse,
} from '@/pocketbase/types';

export function MaintenanceStatsSection({
  statusStats,
  overviewStats,
}: {
  statusStats: MaintenanceRequestStatusStatCardKpiViewResponse[];
  overviewStats: MaintenanceRequestOverviewStatCardKpiViewResponse[];
}) {
  return (
    <div className="space-y-6">
      <RoutineChecksCard />
      <MaintenanceRequestStatusStats stats={statusStats} />
      <MaintenanceRequestOverviewStats stats={overviewStats} />
    </div>
  );
}

function RoutineChecksCard() {
  return (
    <Card className="border-secondary bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Routine Checks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Daily
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Sweeping the floors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Cleaning the walls</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Taking out the trash</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Weekly
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Checking the rooms</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Mopping floors in the inside</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Cleaning the public toilet</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Monthly
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Room checking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Utilities checking</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenanceRequestStatusStats({
  stats,
}: {
  stats: MaintenanceRequestStatusStatCardKpiViewResponse[];
}) {
  return (
    <Card className="border-secondary bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Request Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats && stats.length > 0 ? (
            stats.map((item) => (
              <div
                key={`${item.id}-${item.status}`}
                className="p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.status || 'Unknown'}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {item.totalRequests || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Requests
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No status data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenanceRequestOverviewStats({
  stats,
}: {
  stats: MaintenanceRequestOverviewStatCardKpiViewResponse[];
}) {
  return (
    <Card className="border-secondary bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Request Overview by Urgency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats && stats.length > 0 ? (
            stats.map((item) => {
              return (
                <div
                  key={`${item.id}-${item.urgency}`}
                  className="p-4 bg-background rounded-md border border-border hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.urgency} Priority
                    </span>
                    <UrgencyBadge urgency={item.urgency} />
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {item.requestCount || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {item.assignedCount || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Assigned
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No overview data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
  small = false,
}: {
  status?: string;
  small?: boolean;
}) {
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    Pending: {
      bg: 'bg-secondary',
      text: 'text-muted-foreground',
      icon: <Clock className="w-3 h-3" />,
    },
    Acknowledged: {
      bg: 'bg-input',
      text: 'text-foreground',
      icon: <Clock className="w-3 h-3" />,
    },
    Completed: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status || 'Pending'] || statusConfig['Pending'];

  if (small) {
    return (
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        {status}
      </div>
    );
  }

  return (
    <Badge className={`${config.bg} ${config.text} border-0`}>{status}</Badge>
  );
}

function UrgencyBadge({
  urgency,
  small = false,
}: {
  urgency?: string;
  small?: boolean;
}) {
  const urgencyConfig: Record<string, { bg: string; text: string }> = {
    Urgent: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
    },
    Normal: {
      bg: 'bg-secondary',
      text: 'text-muted-foreground',
    },
    Low: {
      bg: 'bg-primary/10',
      text: 'text-primary',
    },
  };

  const config = urgencyConfig[urgency || 'Normal'] || urgencyConfig['Normal'];
  const sizeClass = small ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <Badge
      className={`${config.bg} ${config.text} border-0 font-medium ${sizeClass}`}
    >
      {urgency}
    </Badge>
  );
}
