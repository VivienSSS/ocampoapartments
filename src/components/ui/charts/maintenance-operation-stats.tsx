'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Users, Wrench } from 'lucide-react';
import { maintenanceOperationStatCardKpiViewQuery } from '@/pocketbase/queries/maintenanceRequests';
import { StatCard } from './stat-card';

export function MaintenanceOperationStats() {
  const { data, isLoading, isError } = useQuery(
    maintenanceOperationStatCardKpiViewQuery(),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data || data.length === 0) {
    return <div>Error loading maintenance data</div>;
  }

  const record = data[0];

  return (
    <>
      <StatCard
        title="Total Requests"
        value={record.total_requests || 0}
        icon={<AlertCircle className="h-4 w-4" />}
        description="All time"
      />
      <StatCard
        title="Pending Requests"
        value={record.pending_requests || 0}
        icon={<Wrench className="h-4 w-4" />}
        description="Awaiting action"
      />
      <StatCard
        title="Completed"
        value={record.completed_requests || 0}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Resolved requests"
      />
      <StatCard
        title="Available Workers"
        value={record.available_workers || 0}
        icon={<Users className="h-4 w-4" />}
        description={`of ${record.total_workers || 0}`}
      />
    </>
  );
}
