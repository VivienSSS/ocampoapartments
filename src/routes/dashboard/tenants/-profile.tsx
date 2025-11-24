import { format, differenceInDays } from 'date-fns';
import { Calendar, Facebook, Mail, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentTenantTenancyQuery } from '@/pocketbase/queries/tenancies';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';

interface TenantProfileProps {
  tenant: TenantsResponse;
}

function LeaseContractCard({ tenantId }: { tenantId: string }) {
  const { data: tenancy } = useSuspenseQuery(
    getCurrentTenantTenancyQuery(tenantId),
  );

  if (!tenancy) {
    return null;
  }

  const leaseStartDate = new Date(tenancy.leaseStartDate);
  const leaseEndDate = new Date(tenancy.leaseEndDate);
  const daysRemaining = differenceInDays(leaseEndDate, new Date());
  const totalLeaseDays = differenceInDays(leaseEndDate, leaseStartDate);
  const progressPercentage = Math.max(
    0,
    Math.min(100, ((totalLeaseDays - daysRemaining) / totalLeaseDays) * 100),
  );
  const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
      <CardContent>
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100/50">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Lease Contract
            </h2>
          </CardTitle>
        </CardHeader>

        <div className="space-y-6">
          {/* Lease Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-muted-foreground/10">
              <p className="text-muted-foreground text-sm font-medium mb-1">
                Lease Start Date
              </p>
              <p className="text-lg font-semibold">
                {format(leaseStartDate, 'PPP')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-muted-foreground/10">
              <p className="text-muted-foreground text-sm font-medium mb-1">
                Lease End Date
              </p>
              <p className="text-lg font-semibold">
                {format(leaseEndDate, 'PPP')}
              </p>
            </div>
          </div>

          {/* Lease Duration Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-gradient-to-br from-sky-100/30 via-sky-50/20 to-transparent">
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Total Lease Duration
              </p>
              <p className="text-2xl font-bold text-sky-600">
                {totalLeaseDays} days
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.floor(totalLeaseDays / 365)} year
                {Math.floor(totalLeaseDays / 365) !== 1 ? 's' : ''}{' '}
                {Math.floor((totalLeaseDays % 365) / 30)} month
                {Math.floor((totalLeaseDays % 365) / 30) !== 1 ? 's' : ''}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border bg-gradient-to-br ${isExpired
                ? 'from-red-100/30 via-red-50/20 to-transparent'
                : isExpiringSoon
                  ? 'from-amber-100/30 via-amber-50/20 to-transparent'
                  : 'from-green-100/30 via-green-50/20 to-transparent'
                }`}
            >
              <p className="text-muted-foreground text-sm font-medium mb-2">
                Time Remaining
              </p>
              <p
                className={`text-2xl font-bold ${isExpired
                  ? 'text-red-600'
                  : isExpiringSoon
                    ? 'text-amber-600'
                    : 'text-green-600'
                  }`}
              >
                {isExpired ? 'Expired' : `${Math.max(0, daysRemaining)} days`}
              </p>
              {isExpiringSoon && !isExpired && (
                <p className="text-xs text-amber-600 mt-1 font-medium">
                  Expiring soon! Please renew your lease.
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">
                Lease Progress
              </p>
              <p className="text-sm font-semibold">
                {Math.round(progressPercentage)}%
              </p>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-muted-foreground/10">
              <div
                className={`h-full transition-all duration-300 ${isExpired
                  ? 'bg-red-500'
                  : isExpiringSoon
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Unit Information - TODO: Enable when needed
          <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-200/30 dark:bg-blue-950/10 dark:border-blue-900/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Unit Details
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Unit:</span>{' '}
                    {tenancy.expand.unit.name}
                  </p>
                  <p>
                    <span className="font-medium">Property:</span>{' '}
                    {tenancy.expand.unit.expand.property.name}
                  </p>
                  <p>
                    <span className="font-medium">Floor:</span>{' '}
                    {tenancy.expand.unit.floorNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Lease Terms Info Box */}
          <div className="p-6 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-sm font-bold mb-4 text-foreground">Lease Terms & Conditions</h3>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                The landlord requires <span className="font-semibold text-foreground">one (1) month advance rent payment</span>, <span className="font-semibold text-foreground">two (2) months deposit</span>, and <span className="font-semibold text-foreground">₱2,000 refundable deposit</span> for the water and electricity. If a potential tenant decides to cancel their move-in at the last minute, all payments made, including any deposits or fees, will not be refunded.
              </p>

              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-3">
                <div className="flex gap-3">
                  <span className="text-slate-400 dark:text-slate-600 font-semibold flex-shrink-0">•</span>
                  <span><span className="font-semibold text-foreground">Utilities:</span> Electricity and water included in rent.</span>
                </div>

                <div className="flex gap-3">
                  <span className="text-slate-400 dark:text-slate-600 font-semibold flex-shrink-0">•</span>
                  <span><span className="font-semibold text-foreground">Pets:</span> Small pets allowed with no additional deposit.</span>
                </div>

                <div className="flex gap-3">
                  <span className="text-slate-400 dark:text-slate-600 font-semibold flex-shrink-0">•</span>
                  <span><span className="font-semibold text-foreground">Parking:</span> (1) motorcycle only, additional is ₱500/month.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TenantProfile({ tenant }: TenantProfileProps) {
  const user = tenant.expand.user;
  const fullName = `${user.firstName} ${user.lastName}`;

  // Generate initials for avatar fallback
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <CardHeader className="relative pb-8 px-6">
          {/* Cover Photo Area */}
          <div className="h-36 bg-gradient-to-r from-primary/90 via-primary to-primary/80 rounded-lg -mx-6 -mt-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/20 to-primary/40"></div>
            <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-primary-foreground/10 to-transparent"></div>
          </div>
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative z-10">
            <Avatar className="w-28 h-28 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance leading-tight">
                      {fullName}
                    </h1>
                    <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-2">
                      Tenant Account
                    </p>
                  </div>
                  <Badge
                    variant={user.isActive ? 'default' : 'secondary'}
                    className="w-fit text-sm px-3 py-1 font-medium"
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
          <CardContent className="space-y-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Personal Information
                </h3>
              </CardTitle>
            </CardHeader>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm font-medium">
                  Email Address
                </p>
                <p className="leading-7 font-medium truncate">
                  {user.contactEmail}
                </p>
              </div>
            </div>

            {tenant.phoneNumber && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
                <div className="p-2 rounded-lg bg-emerald-100/50">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-sm font-medium">
                    Phone Number
                  </p>
                  <p className="leading-7 font-medium">{tenant.phoneNumber}</p>
                </div>
              </div>
            )}

            {tenant.facebookName && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
                <div className="p-2 rounded-lg bg-blue-100/50">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-sm font-medium">
                    Facebook Name
                  </p>
                  <p className="leading-7 font-medium">{tenant.facebookName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
          <CardContent className="space-y-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100/50">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Account Details
                </h3>
              </CardTitle>
            </CardHeader>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
              <div className="p-2 rounded-lg bg-primary/10">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm font-medium">
                  Username
                </p>
                <p className="leading-7 font-medium">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
              <div className="p-2 rounded-lg bg-violet-100/50">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm font-medium">
                  Member Since
                </p>
                <p className="leading-7 font-medium">
                  {format(new Date(tenant.created!), 'PPP')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-muted-foreground/10 hover:border-muted-foreground/20">
              <div className="p-2 rounded-lg bg-orange-100/50">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground text-sm font-medium">
                  Last Updated
                </p>
                <p className="leading-7 font-medium">
                  {format(new Date(tenant.updated!), 'PPP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="hover:shadow-lg transition-all duration-300 border-muted-foreground/20">
        <CardContent>
          <CardHeader className="pb-6">
            <CardTitle>
              <h2 className="scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Profile Overview
              </h2>
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 hover:to-primary/5 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/25">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-200">
                {user.isActive ? 'Active' : 'Inactive'}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Account Status
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border bg-gradient-to-br from-emerald-100/30 via-emerald-50/20 to-transparent hover:from-emerald-100/50 hover:via-emerald-50/30 hover:to-emerald-50/10 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/25">
              <div className="text-3xl font-bold text-emerald-600 mb-2 group-hover:scale-105 transition-transform duration-200">
                Tenant
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                User Role
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border bg-gradient-to-br from-violet-100/30 via-violet-50/20 to-transparent hover:from-violet-100/50 hover:via-violet-50/30 hover:to-violet-50/10 transition-all duration-300 group hover:shadow-lg hover:shadow-violet-500/25">
              <div className="text-3xl font-bold text-violet-600 mb-2 group-hover:scale-105 transition-transform duration-200">
                {Math.floor(
                  (Date.now() - new Date(tenant.created!).getTime()) /
                  (1000 * 60 * 60 * 24),
                )}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Days as Member
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Contract Card */}
      <LeaseContractCard tenantId={tenant.id} />
    </div>
  );
}
