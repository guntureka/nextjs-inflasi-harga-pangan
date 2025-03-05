"use client";

import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";
import { Home } from "lucide-react";

export const DashboardNavHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={"/"}>
          <SidebarMenuButton>
            <Home />
            <span>Home</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
