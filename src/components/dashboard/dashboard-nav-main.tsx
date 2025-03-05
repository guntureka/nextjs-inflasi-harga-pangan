"use client";

import React, { Suspense } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Session } from "@/lib/auth-client";
import { useSession } from "../session-provider";

interface DashboardNavMain {
  items: {
    title: string;
    href: string;
    image?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    role?: string[];
    items?: {
      title: string;
      href: string;
      image?: string;
      icon?: LucideIcon;
      isActive?: boolean;
      role?: string[];
    }[];
  }[];
}

export const DashboardNavMain = ({ items }: DashboardNavMain) => {
  const session = useSession();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Suspense fallback={null}>
          {items.map((item) =>
            item.items ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className={cn(
                            "",
                            !item.role ||
                              item.role?.includes(session?.user?.role || "")
                              ? ""
                              : "hidden"
                          )}
                        >
                          <Link href={subItem.href}>
                            <SidebarMenuButton>
                              <span>{subItem.title}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  "",
                  !item.role || item.role?.includes(session?.user?.role || "")
                    ? ""
                    : "hidden"
                )}
              >
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </Suspense>
      </SidebarMenu>
    </SidebarGroup>
  );
};
