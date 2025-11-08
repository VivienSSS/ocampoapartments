import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  // Track which nav item is active (clicked or matches current path).
  const [activeTitle, setActiveTitle] = React.useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const path = window.location.pathname;
    const match = items.find(
      (i) => i.url && (i.url === path || path.startsWith(i.url)),
    );
    return match?.title ?? '';
  });

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = activeTitle === item.title;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              onClick={() => setActiveTitle(item.title)}
              // apply the primary color and its foreground using CSS variables from globals.css
              className={
                isActive
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]'
                  : undefined
              }
            >
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
