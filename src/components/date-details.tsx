import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { format } from 'date-fns';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FieldGroup, FieldSet, Field, FieldContent } from '@/components/ui/field';
import type { DateDetails } from '@/components/date-picker';

export function DateDetails({ dateDetails, selectedDate }: { dateDetails: DateDetails; selectedDate: Date | undefined }) {
    if (!selectedDate || (dateDetails.leaseEndDates.length === 0 && dateDetails.dueDates.length === 0)) {
        return null;
    }

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
                                <AccordionItem key={`lease-${index}`} value={`lease-${index}`} className="border-b">
                                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                                        <span className="text-sidebar-foreground">
                                            {lease.tenantName} <span className="text-muted-foreground ml-1">→ Lease End</span>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <FieldSet className="gap-3">
                                            <FieldGroup>
                                                <Field orientation="vertical">
                                                    <FieldContent>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Tenant Name</p>
                                                                <p className="text-sm">{lease.tenantName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Address</p>
                                                                <p className="text-sm">{lease.branch ? `${lease.branch}, Floor ${lease.floorNumber}, Unit Letter ${lease.unitLetter}` : 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Lease End Date</p>
                                                                <p className="text-sm">{format(new Date(lease.leaseEndDate), 'PPP')}</p>
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
                                <AccordionItem key={`due-${index}`} value={`due-${index}`} className="border-b">
                                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                                        <span className="text-sidebar-foreground">
                                            <span className="text-muted-foreground">Bill</span> <span className="text-muted-foreground ml-1">→ {due.status}</span>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <FieldSet className="gap-3">
                                            <FieldGroup>
                                                <Field orientation="vertical">
                                                    <FieldContent>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Tenant Name</p>
                                                                <p className="text-sm">{`${due.tenantFirstName} ${due.tenantLastName}`}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Total Amount</p>
                                                                <p className="text-sm">{`₱${(due.amount || 0).toFixed(2)}`}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                                                                <p className="text-sm">{format(new Date(due.dueDate), 'PPP')}</p>
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
                </Accordion>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
