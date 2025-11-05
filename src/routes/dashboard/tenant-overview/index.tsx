import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { listAnnouncementsQuery } from '@/pocketbase/queries/announcements';
import { listBillsQuery } from '@/pocketbase/queries/bills';
import type { AnnouncementsResponse } from '@/pocketbase/queries/announcements';
import type { BillsResponse } from '@/pocketbase/queries/bills';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';

interface TenantOverviewData {
    announcements: {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: AnnouncementsResponse[];
    };
    bills: {
        page: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        items: BillsResponse[];
    };
}

export const Route = createFileRoute('/dashboard/tenant-overview/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => ({ context }),
    loader: async ({ context }) => {
        const [announcements, bills] = await Promise.all([
            context.queryClient.fetchQuery(listAnnouncementsQuery(1, 5)),
            context.queryClient.fetchQuery(listBillsQuery(1, 5)),
        ]);
        return { announcements, bills };
    },
});

function RouteComponent() {
    const { announcements, bills } = Route.useLoaderData() as TenantOverviewData;
    const [announcementPage, setAnnouncementPage] = useState(1);

    const ANNOUNCEMENTS_PER_PAGE = 3;
    const totalAnnouncementPages = Math.ceil((announcements.items?.length ?? 0) / ANNOUNCEMENTS_PER_PAGE);
    const startIndex = (announcementPage - 1) * ANNOUNCEMENTS_PER_PAGE;
    const endIndex = startIndex + ANNOUNCEMENTS_PER_PAGE;
    const paginatedAnnouncements = announcements.items?.slice(startIndex, endIndex) ?? [];

    const handlePrevAnnouncements = () => {
        setAnnouncementPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextAnnouncements = () => {
        setAnnouncementPage(prev => Math.min(prev + 1, totalAnnouncementPages));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                    Welcome
                </h1>
                <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-2">
                    Here's your quick overview of announcements and billing information.
                </p>
            </div>

            {/* Announcements & Billing Overview */}
            <div className="space-y-6">
                {/* Announcements Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                        <CardDescription>
                            Latest updates and important notices
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {announcements.items && announcements.items.length > 0 ? (
                            <>
                                <div className="space-y-3">
                                    {paginatedAnnouncements.map((announcement: AnnouncementsResponse) => (
                                        <div
                                            key={announcement.id}
                                            className="border-l-2 border-l-primary pl-4 py-2"
                                        >
                                            <h3 className="font-semibold leading-tight text-sm">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                                {announcement.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date(announcement.created).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {totalAnnouncementPages > 1 && (
                                    <div className="flex items-center justify-between gap-2 pt-4 border-t">
                                        <button
                                            onClick={handlePrevAnnouncements}
                                            disabled={announcementPage === 1}
                                            className="px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {announcementPage} of {totalAnnouncementPages}
                                        </span>
                                        <button
                                            onClick={handleNextAnnouncements}
                                            disabled={announcementPage === totalAnnouncementPages}
                                            className="px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No announcements at the moment.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Billing Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>
                            Outstanding and recent bills
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bills.items && bills.items.length > 0 ? (
                            <div className="space-y-4">
                                {bills.items.filter((bill: BillsResponse) => bill.status !== 'Paid').slice(0, 5).map((bill: BillsResponse) => {
                                    const tenantName = bill.expand?.tenancy?.expand?.tenant?.expand?.user
                                        ? `${bill.expand.tenancy.expand.tenant.expand.user.firstName} ${bill.expand.tenancy.expand.tenant.expand.user.lastName}`
                                        : 'N/A';

                                    return (
                                        <BillCard key={bill.id} bill={bill} tenantName={tenantName} />
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                No bills at the moment.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function BillCard({ bill, tenantName }: { bill: BillsResponse; tenantName: string }) {
    const { data: billItems } = useSuspenseQuery({
        queryKey: [Collections.BillItems, bill.id],
        queryFn: () =>
            pb.collection(Collections.BillItems).getList(1, 100, {
                filter: `bill = '${bill.id}'`,
            }),
    });

    const totalAmount = (billItems?.items ?? []).reduce((sum: number, item: any) => {
        return sum + (item.amount || 0);
    }, 0);

    const chargeTypes = Array.from(
        new Set((billItems?.items ?? []).map((item: any) => item.chargeType).filter(Boolean))
    );

    return (
        <div className="border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors">
            <div className="space-y-3">
                {/* Header with Tenant Name and Status Badge */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        {/* Tenant Name */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Tenant
                            </p>
                            <p className="font-semibold text-sm mt-1">
                                {tenantName}
                            </p>
                            {chargeTypes.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Charge Types
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {chargeTypes.map((chargeType: string) => (
                                            <span
                                                key={chargeType}
                                                className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {chargeType}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badge - Top Right */}
                    <div
                        className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${bill.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : bill.status === 'Overdue'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                    >
                        {bill.status}
                    </div>
                </div>

                {/* Total Amount */}
                <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Total Amount
                    </p>
                    <p className="text-lg font-bold text-primary mt-1">
                        ₱ {totalAmount.toLocaleString()}
                    </p>
                </div>

                {/* Due Date */}
                <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Due Date
                    </p>
                    <p className="text-sm mt-1">
                        {new Date(bill.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
