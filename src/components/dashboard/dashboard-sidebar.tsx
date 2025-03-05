"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardNavHeader } from "@/components/dashboard/dashboard-nav-header";
import { DashboardNavMain } from "@/components/dashboard/dashboard-nav-main";
import { DashboardNavFooter } from "@/components/dashboard/dashboard-nav-footer";
import { NavDashboard } from "@/lib/nav-links";
import { Session } from "@/lib/auth-client";

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardNavHeader />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={NavDashboard.main} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
