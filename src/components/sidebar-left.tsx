import {
  AudioWaveform,
  BookUser,
  Command,
  Hammer,
  HandCoins,
  Hotel,
  House,
  MapPinHouse,
  Megaphone,
  Pickaxe,
  ReceiptText,
  Search,
  ShieldUser,
} from 'lucide-react';
import type * as React from 'react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavWorkspaces } from '@/components/nav-workspaces';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';

const showNav = () => {
  switch (pb.authStore.record?.role) {
    case UsersRoleOptions.Administrator:
      return [
        {
          title: 'Announcements',
          url: '/dashboard/announcements',
          icon: Megaphone,
        },
        {
          title: 'Apartments',
          url: '/dashboard/apartments',
          icon: Hotel,
        },
        {
          title: 'Billing',
          url: '/dashboard/billing',
          icon: ReceiptText,
        },
        {
          title: 'Maintenance Requests',
          url: '/dashboard/maintenances',
          icon: Hammer,
        },
        {
          title: 'Maintenance Workers',
          url: '/dashboard/maintenanceworkers',
          icon: ShieldUser,
        },
        {
          title: 'Payments',
          url: '/dashboard/payments',
          icon: HandCoins,
        },
        {
          title: 'Properties',
          url: '/dashboard/properties',
          icon: MapPinHouse,
        },
        {
          title: 'Tenants',
          url: '/dashboard/tenants',
          icon: BookUser,
        },
        {
          title: 'Tenancies',
          url: '/dashboard/tenancies',
          icon: House,
        },
      ];
    case UsersRoleOptions['Building Admin']:
      return [
        {
          title: 'Announcements',
          url: '/dashboard/announcements',
          icon: Megaphone,
        },
        {
          title: 'Maintenance Requests',
          url: '/dashboard/maintenances',
          icon: Hammer,
        },
        {
          title: 'Maintenance Workers',
          url: '/dashboard/maintenanceworkers',
          icon: ShieldUser,
        },
      ];
    case UsersRoleOptions.Tenant:
      return [
        {
          title: 'Announcements',
          url: '/dashboard/announcements',
          icon: Megaphone,
        },
        {
          title: 'Billing',
          url: '/dashboard/billing',
          icon: ReceiptText,
        },
        {
          title: 'Maintenance Requests',
          url: '/dashboard/maintenances',
          icon: Hammer,
        },
        {
          title: 'Payment History',
          url: '/dashboard/payments',
          icon: HandCoins,
        },
        {
          title: 'Your information',
          url: '/dashboard/tenants',
          icon: BookUser,
        },
      ];
    default:
      return [];
  }
}

const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navMain: [
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
    ...Array.from(showNav())
  ],
  navSecondary: [
    // {
    //   title: "Calendar",
    //   url: "#",
    //   icon: Calendar,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    // },
    // {
    //   title: "Templates",
    //   url: "#",
    //   icon: Blocks,
    // },
    // {
    //   title: "Trash",
    //   url: "#",
    //   icon: Trash2,
    // },
    // {
    //   title: "Help",
    //   url: "#",
    //   icon: MessageCircleQuestion,
    // },
  ],
  favorites: [
    // {
    //   name: "Project Management & Task Tracking",
    //   url: "#",
    //   emoji: "📊",
    // },
    // {
    //   name: "Family Recipe Collection & Meal Planning",
    //   url: "#",
    //   emoji: "🍳",
    // },
    // {
    //   name: "Fitness Tracker & Workout Routines",
    //   url: "#",
    //   emoji: "💪",
    // },
    // {
    //   name: "Book Notes & Reading List",
    //   url: "#",
    //   emoji: "📚",
    // },
    // {
    //   name: "Sustainable Gardening Tips & Plant Care",
    //   url: "#",
    //   emoji: "🌱",
    // },
    // {
    //   name: "Language Learning Progress & Resources",
    //   url: "#",
    //   emoji: "🗣️",
    // },
    // {
    //   name: "Home Renovation Ideas & Budget Tracker",
    //   url: "#",
    //   emoji: "🏠",
    // },
    // {
    //   name: "Personal Finance & Investment Portfolio",
    //   url: "#",
    //   emoji: "💰",
    // },
    // {
    //   name: "Movie & TV Show Watchlist with Reviews",
    //   url: "#",
    //   emoji: "🎬",
    // },
    // {
    //   name: "Daily Habit Tracker & Goal Setting",
    //   url: "#",
    //   emoji: "✅",
    // },
  ],
  workspaces: [
    // {
    //   name: "Personal Life Management",
    //   emoji: "🏠",
    //   pages: [
    //     {
    //       name: "Daily Journal & Reflection",
    //       url: "#",
    //       emoji: "📔",
    //     },
    //     {
    //       name: "Health & Wellness Tracker",
    //       url: "#",
    //       emoji: "🍏",
    //     },
    //     {
    //       name: "Personal Growth & Learning Goals",
    //       url: "#",
    //       emoji: "🌟",
    //     },
    //   ],
    // },
    // {
    //   name: "Professional Development",
    //   emoji: "💼",
    //   pages: [
    //     {
    //       name: "Career Objectives & Milestones",
    //       url: "#",
    //       emoji: "🎯",
    //     },
    //     {
    //       name: "Skill Acquisition & Training Log",
    //       url: "#",
    //       emoji: "🧠",
    //     },
    //     {
    //       name: "Networking Contacts & Events",
    //       url: "#",
    //       emoji: "🤝",
    //     },
    //   ],
    // },
    // {
    //   name: "Creative Projects",
    //   emoji: "🎨",
    //   pages: [
    //     {
    //       name: "Writing Ideas & Story Outlines",
    //       url: "#",
    //       emoji: "✍️",
    //     },
    //     {
    //       name: "Art & Design Portfolio",
    //       url: "#",
    //       emoji: "🖼️",
    //     },
    //     {
    //       name: "Music Composition & Practice Log",
    //       url: "#",
    //       emoji: "🎵",
    //     },
    //   ],
    // },
    // {
    //   name: "Home Management",
    //   emoji: "🏡",
    //   pages: [
    //     {
    //       name: "Household Budget & Expense Tracking",
    //       url: "#",
    //       emoji: "💰",
    //     },
    //     {
    //       name: "Home Maintenance Schedule & Tasks",
    //       url: "#",
    //       emoji: "🔧",
    //     },
    //     {
    //       name: "Family Calendar & Event Planning",
    //       url: "#",
    //       emoji: "📅",
    //     },
    //   ],
    // },
    // {
    //   name: "Travel & Adventure",
    //   emoji: "🧳",
    //   pages: [
    //     {
    //       name: "Trip Planning & Itineraries",
    //       url: "#",
    //       emoji: "🗺️",
    //     },
    //     {
    //       name: "Travel Bucket List & Inspiration",
    //       url: "#",
    //       emoji: "🌎",
    //     },
    //     {
    //       name: "Travel Journal & Photo Gallery",
    //       url: "#",
    //       emoji: "📸",
    //     },
    //   ],
    // },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
