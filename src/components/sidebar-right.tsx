import { Bell, BellPlus } from 'lucide-react';
import React from 'react';

import { DatePicker, type DateDetails } from '@/components/date-picker';
import { DateDetails as DateDetailsComponent } from '@/components/date-details';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { pb } from '@/pocketbase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

// This is sample data.
const data = {
  user: {
    name:
      `${pb.authStore.record?.firstName} ${pb.authStore.record?.lastName}` ||
      'Empty',
    email: pb.authStore.record?.email || 'Empty',
    avatar: pb.files.getURL(
      pb.authStore.record ?? {},
      pb.authStore.record?.image,
    ),
    role: pb.authStore.record?.role
  },
  // calendars: [
  //   {
  //     name: 'My Calendars',
  //     items: ['Personal', 'Work', 'Family'],
  //   },
  //   {
  //     name: 'Favorites',
  //     items: ['Holidays', 'Birthdays'],
  //   },
  //   {
  //     name: 'Other',
  //     items: ['Travel', 'Reminders', 'Deadlines'],
  //   },
  // ],
};

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [dateDetails, setDateDetails] = React.useState<DateDetails>({ leaseEndDates: [], dueDates: [], maintenanceRequests: [] });

  const handleDateSelected = (date: Date | undefined, details: DateDetails) => {
    setSelectedDate(date);
    setDateDetails(details);
  };

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-1 lg:flex w-[20%]"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker onDateSelected={handleDateSelected} />
        <SidebarSeparator className="mx-0" />
        <DateDetailsComponent dateDetails={dateDetails} selectedDate={selectedDate} />
        {/* <Calendars calendars={data.calendars} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton>
                  <Bell />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>
                <Item variant="muted" size="sm">
                  <ItemMedia>
                    <BellPlus className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Item</ItemTitle>
                    <ItemDescription>Item</ItemDescription>
                  </ItemContent>
                  <ItemActions />
                </Item>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
