import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Check, Clock, AlertCircle, Users } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { MaintenanceRequestsResponse } from '@/pocketbase/queries/maintenanceRequests';
import { UsersRoleOptions } from '@/pocketbase/types';

interface MaintenanceCardsProps {
    data: MaintenanceRequestsResponse[];
}

const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
        case 'Urgent':
            return 'bg-destructive text-destructive-foreground';
        case 'Normal':
            return 'bg-secondary text-secondary-foreground';
        case 'Low':
            return 'bg-accent text-accent-foreground';
        default:
            return 'bg-muted text-muted-foreground';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Check className="w-4 h-4 text-primary" />;
        case 'Acknowledged':
            return <Clock className="w-4 h-4 text-secondary" />;
        case 'Pending':
            return <AlertCircle className="w-4 h-4 text-accent" />;
        default:
            return null;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'bg-primary/10 dark:bg-primary/20';
        case 'Acknowledged':
            return 'bg-secondary/10 dark:bg-secondary/20';
        case 'Pending':
            return 'bg-accent/10 dark:bg-accent/20';
        default:
            return 'bg-muted';
    }
};

export function MaintenanceRequestCards({ data }: MaintenanceCardsProps) {
    const navigate = useNavigate({ from: '/dashboard/maintenances' });
    const searchQuery = useSearch({ from: '/dashboard/maintenances/' });
    const { user: currentUser } = useRouteContext({ from: "/dashboard/maintenances/" })

    const handleCardSelect = (id: string, checked: boolean) => {
        if (checked) {
            const selected = [...(searchQuery.selected || [])];
            selected.push(id);
            navigate({
                search: (prev) => ({
                    ...prev,
                    selected,
                }),
            });
        } else {
            navigate({
                search: (prev) => ({
                    ...prev,
                    selected: (searchQuery.selected || []).filter((selectedId: string) => selectedId !== id),
                }),
            });
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="col-span-full flex items-center justify-center py-12">
                <p className="text-muted-foreground">No maintenance requests found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((request) => {
                const tenant = request.expand?.tenant;
                const user = tenant?.expand?.user;
                const unit = request.expand?.unit;
                const worker = request.expand?.worker;
                const isSelected = (searchQuery.selected || []).includes(request.id);

                const tenantName = user
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'Unknown';
                const unitAddress = unit
                    ? `Floor ${unit.floorNumber || ''}, Unit Letter ${unit.unitLetter || 'N/A'}`
                    : 'N/A';
                const workerName = worker?.name || 'Unassigned';
                const submittedDate = request.submittedDate
                    ? format(new Date(request.submittedDate), 'PPP')
                    : 'N/A';

                return (
                    <Card
                        key={request.id}
                        className={`flex flex-col transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''
                            } ${getStatusColor(request.status)}`}
                    >
                        <CardHeader className="pb-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {getStatusIcon(request.status)}
                                        <CardTitle className="text-base line-clamp-2">
                                            {tenantName}
                                        </CardTitle>
                                    </div>
                                    <CardDescription>{unitAddress}</CardDescription>
                                </div>
                                <CardAction className="col-start-auto row-start-auto flex items-center gap-1">
                                    {currentUser.role !== UsersRoleOptions.Tenant && <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                            handleCardSelect(request.id, checked as boolean)
                                        }
                                        aria-label="Select request"
                                    />}
                                </CardAction>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-3 pt-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Description
                                </p>
                                <p className="text-sm line-clamp-3 leading-relaxed">
                                    {request.description}
                                </p>
                            </div>

                            <Separator className="my-2" />

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Urgency
                                    </p>
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs ${getUrgencyColor(request.urgency)}`}
                                    >
                                        {request.urgency}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Status
                                    </p>
                                    <Badge variant="secondary" className={`text-xs ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="font-medium text-muted-foreground">Worker</p>
                                    <p className="truncate">{workerName}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground">Submitted</p>
                                    <p className="truncate">{submittedDate}</p>
                                </div>
                            </div>

                            {request.completedDate && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Completed Date
                                    </p>
                                    <p className="text-sm">
                                        {format(new Date(request.completedDate), 'PPP')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
