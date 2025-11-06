import * as React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { pb } from '@/pocketbase';
import type { BillsResponse } from '@/pocketbase/queries/bills';
import type { MaintenanceRequestsResponse } from '@/pocketbase/queries/maintenanceRequests';

export interface LeaseEndDateDetail {
  tenantName: string;
  tenantFirstName: string;
  tenantLastName: string;
  unitId: string;
  tenancyId: string;
  leaseEndDate: string;
  address?: string;
  branch?: string;
  floorNumber?: number;
  unitLetter?: string;
}

export interface DueDateDetail {
  status: string;
  billId: string;
  tenancyId: string;
  dueDate: string;
  amount?: number;
  tenantFirstName?: string;
  tenantLastName?: string;
}

export interface MaintenanceRequestDetail {
  id: string;
  description: string;
  status: string;
  urgency: string;
  submittedDate: string;
  tenantFirstName: string;
  tenantLastName: string;
  unitLetter: string;
  floorNumber: number;
  address: string;
  workerName: string;
  completedDate?: string;
}

export interface DateDetails {
  leaseEndDates: LeaseEndDateDetail[];
  dueDates: DueDateDetail[];
  maintenanceRequests: MaintenanceRequestDetail[];
}

export function DatePicker({ onDateSelected }: { onDateSelected?: (date: Date | undefined, details: DateDetails) => void }) {
  const [importantDates, setImportantDates] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<Date | undefined>();

  React.useEffect(() => {
    const fetchImportantDates = async () => {
      try {
        const dates = new Set<string>();

        // Fetch bill due dates
        const bills = await pb.collection('bills').getFullList({
          fields: 'dueDate',
        });
        bills.forEach((bill) => {
          if (bill.dueDate) {
            const dateStr = format(new Date(bill.dueDate), 'yyyy-MM-dd');
            dates.add(dateStr);
          }
        });

        // Fetch lease end dates
        const tenancies = await pb.collection('tenancies').getFullList({
          fields: 'leaseEndDate',
        });
        tenancies.forEach((tenancy) => {
          if (tenancy.leaseEndDate) {
            const dateStr = format(new Date(tenancy.leaseEndDate), 'yyyy-MM-dd');
            dates.add(dateStr);
          }
        });

        // Fetch maintenance request submitted dates
        const maintenanceRequests = await pb.collection('maintenance_requests').getFullList({
          fields: 'submittedDate',
        });
        maintenanceRequests.forEach((request: any) => {
          if (request.submittedDate) {
            const dateStr = format(new Date(request.submittedDate), 'yyyy-MM-dd');
            dates.add(dateStr);
          }
        });

        setImportantDates(dates);
      } catch (error) {
        console.error('Failed to fetch important dates:', error);
      }
    };

    fetchImportantDates();
  }, []);

  const handleDateClick = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      // Fetch details for the selected date
      const fetchDateDetails = async () => {
        try {
          const leaseEndDates: LeaseEndDateDetail[] = [];
          const dueDates: DueDateDetail[] = [];
          const maintenanceRequests: MaintenanceRequestDetail[] = [];

          // Fetch bill due dates for this date
          const bills = await pb.collection('bills').getFullList<BillsResponse>({
            expand: 'tenancy.tenant.user',
          });

          // Fetch all bill items to calculate totals
          const billItems = await pb.collection('bill_items').getFullList();
          const billItemsByBillId = new Map<string, any[]>();
          billItems.forEach((item: any) => {
            if (!billItemsByBillId.has(item.bill)) {
              billItemsByBillId.set(item.bill, []);
            }
            billItemsByBillId.get(item.bill)!.push(item);
          });

          bills.forEach((bill) => {
            if (bill.dueDate && format(new Date(bill.dueDate), 'yyyy-MM-dd') === dateStr) {
              const tenantFirstName = bill.expand.tenancy.expand.tenant.expand.user.firstName || 'test';
              const tenantLastName = bill.expand.tenancy.expand.tenant.expand.user.lastName || 'test';
              const items = billItemsByBillId.get(bill.id) || [];
              const totalAmount = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
              dueDates.push({
                status: bill.status || 'Due',
                billId: bill.id,
                tenancyId: bill.tenancy,
                dueDate: bill.dueDate,
                amount: totalAmount,
                tenantFirstName,
                tenantLastName,
              });
            }
          });

          // Fetch lease end dates for this date
          const tenancies = await pb.collection('tenancies').getFullList({
            expand: 'tenant.user,unit.property',
          });
          tenancies.forEach((tenancy: any) => {
            if (tenancy.leaseEndDate && format(new Date(tenancy.leaseEndDate), 'yyyy-MM-dd') === dateStr) {
              const tenantFirstName = tenancy.expand?.tenant?.expand?.user?.firstName || '';
              const tenantLastName = tenancy.expand?.tenant?.expand?.user?.lastName || '';
              const tenantName = `${tenantFirstName} ${tenantLastName}`.trim() || 'Unknown Tenant';
              const propertyAddress = tenancy.expand?.unit?.expand?.property?.address || '';
              const branch = tenancy.expand?.unit?.expand?.property?.branch || '';
              const floorNumber = tenancy.expand?.unit?.floorNumber;
              const unitLetter = tenancy.expand?.unit?.unitLetter || '';
              leaseEndDates.push({
                tenantName,
                tenantFirstName,
                tenantLastName,
                unitId: tenancy.unit,
                tenancyId: tenancy.id,
                leaseEndDate: tenancy.leaseEndDate,
                address: propertyAddress,
                branch,
                floorNumber,
                unitLetter,
              });
            }
          });

          // Fetch maintenance requests for this date
          const requests = await pb.collection('maintenance_requests').getFullList<MaintenanceRequestsResponse>({
            expand: 'tenant.user,unit.property,worker',
          });
          requests.forEach((request: any) => {
            if (request.submittedDate && format(new Date(request.submittedDate), 'yyyy-MM-dd') === dateStr) {
              const tenantFirstName = request.expand?.tenant?.expand?.user?.firstName || '';
              const tenantLastName = request.expand?.tenant?.expand?.user?.lastName || '';
              const unitLetter = request.expand?.unit?.unitLetter || '';
              const floorNumber = request.expand?.unit?.floorNumber || 0;
              const address = request.expand?.unit?.expand?.property?.branch || '';
              const workerName = request.expand?.worker?.name || 'Unassigned';
              maintenanceRequests.push({
                id: request.id,
                description: request.description,
                status: request.status || 'Pending',
                urgency: request.urgency,
                submittedDate: request.submittedDate,
                tenantFirstName,
                tenantLastName,
                unitLetter,
                floorNumber,
                address,
                workerName,
                completedDate: request.completedDate,
              });
            }
          });

          const dateDetails = { leaseEndDates, dueDates, maintenanceRequests };
          onDateSelected?.(date, dateDetails);
        } catch (error) {
          console.error('Failed to fetch date details:', error);
          onDateSelected?.(date, { leaseEndDates: [], dueDates: [], maintenanceRequests: [] });
        }
      };
      fetchDateDetails();
    } else {
      onDateSelected?.(undefined, { leaseEndDates: [], dueDates: [], maintenanceRequests: [] });
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground w-full"
          modifiers={{
            important: (date) => importantDates.has(format(date, 'yyyy-MM-dd')),
          }}
          modifiersClassNames={{
            important: 'font-bold hover:bg-accent hover:rounded-md has-focus:ring-ring [&_button]:font-bold cursor-pointer',
          }}
          selected={selected}
          onDayClick={handleDateClick}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
