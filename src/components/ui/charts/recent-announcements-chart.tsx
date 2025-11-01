'use client';

import { useQuery } from '@tanstack/react-query';
import { recentAnnouncementsChartViewQuery } from '@/pocketbase/queries/announcements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RecentAnnouncementsChart() {
    const { data, isLoading, isError } = useQuery(recentAnnouncementsChartViewQuery());

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    if (isError || !data || data.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-destructive text-sm">No announcements</div>
                </CardContent>
            </Card>
        );
    }

    // Get latest 5 announcements
    const latest = data.slice(0, 5);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {latest.map((item) => (
                        <div key={item.id} className="border-b pb-2 last:border-b-0">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            <p className="text-muted-foreground text-xs">
                                {typeof item.messagePreview === 'string' ? item.messagePreview.substring(0, 50) + '...' : 'No message'}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">By: {item.email}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
