import { format } from 'date-fns';
import type { DateDetails } from '@/components/date-picker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function DateDetails({
  dateDetails,
  selectedDate,
}: {
  dateDetails: DateDetails;
  selectedDate: Date | undefined;
}) {
  if (
    !selectedDate ||
    (dateDetails.leaseEndDates.length === 0 &&
      dateDetails.dueDates.length === 0 &&
      dateDetails.maintenanceRequests.length === 0)
  ) {
    return null;
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel className="text-sidebar-foreground text-sm">
        {format(selectedDate, 'PPP')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <Accordion type="single" collapsible className="w-full">
          {dateDetails.leaseEndDates.length > 0 && (
            <>
              {dateDetails.leaseEndDates.map((lease, index) => (
                <AccordionItem
                  key={`lease-${index}`}
                  value={`lease-${index}`}
                  className="border-b"
                >
                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                    <span className="text-sidebar-foreground">
                      {lease.tenantName}{' '}
                      <span className="text-muted-foreground ml-1">
                        → Lease End
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <FieldSet className="gap-3">
                      <FieldGroup>
                        <Field orientation="vertical">
                          <FieldContent>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Tenant Name
                                </p>
                                <p className="text-sm">{lease.tenantName}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Address
                                </p>
                                <p className="text-sm">
                                  {lease.branch
                                    ? `${lease.branch}, Floor ${lease.floorNumber}, Unit Letter ${lease.unitLetter}`
                                    : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Lease End Date
                                </p>
                                <p className="text-sm">
                                  {format(new Date(lease.leaseEndDate), 'PPP')}
                                </p>
                              </div>
                            </div>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          )}
          {dateDetails.dueDates.length > 0 && (
            <>
              {dateDetails.dueDates.map((due, index) => (
                <AccordionItem
                  key={`due-${index}`}
                  value={`due-${index}`}
                  className="border-b"
                >
                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                    <span className="text-sidebar-foreground">
                      <span className="text-muted-foreground">Bill</span>{' '}
                      <span className="text-muted-foreground ml-1">
                        → {due.status}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <FieldSet className="gap-3">
                      <FieldGroup>
                        <Field orientation="vertical">
                          <FieldContent>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Tenant Name
                                </p>
                                <p className="text-sm">{`${due.tenantFirstName} ${due.tenantLastName}`}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Total Amount
                                </p>
                                <p className="text-sm">{`₱${(due.amount || 0).toFixed(2)}`}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Due Date
                                </p>
                                <p className="text-sm">
                                  {format(new Date(due.dueDate), 'PPP')}
                                </p>
                              </div>
                            </div>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          )}
          {dateDetails.maintenanceRequests.length > 0 && (
            <>
              {dateDetails.maintenanceRequests.map((request, index) => (
                <AccordionItem
                  key={`maintenance-${index}`}
                  value={`maintenance-${index}`}
                  className="border-b"
                >
                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                    <span className="text-sidebar-foreground flex items-center gap-2">
                      <span className="text-muted-foreground">Maintenance</span>
                      <Badge
                        variant={getUrgencyColor(request.urgency)}
                        className="text-xs"
                      >
                        {request.urgency}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <FieldSet className="gap-3">
                      <FieldGroup>
                        <Field orientation="vertical">
                          <FieldContent>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Tenant Name
                                </p>
                                <p className="text-sm">{`${request.tenantFirstName} ${request.tenantLastName}`}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Unit
                                </p>
                                <p className="text-sm">{`Floor ${request.floorNumber}, Unit ${request.unitLetter}`}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Address
                                </p>
                                <p className="text-sm">
                                  {request.address || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Description
                                </p>
                                <p className="text-sm line-clamp-2">
                                  {request.description}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Status
                                </p>
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant={getStatusColor(request.status)}
                                    className="text-xs"
                                  >
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Assigned Worker
                                </p>
                                <p className="text-sm">{request.workerName}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Submitted Date
                                </p>
                                <p className="text-sm">
                                  {format(
                                    new Date(request.submittedDate),
                                    'PPP',
                                  )}
                                </p>
                              </div>
                              {request.completedDate && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">
                                    Completed Date
                                  </p>
                                  <p className="text-sm">
                                    {format(
                                      new Date(request.completedDate),
                                      'PPP',
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </>
          )}
        </Accordion>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
