"use client";

import React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { LoadingButton } from "../ui/loading-button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/lib/auth-client";
import { useSession } from "@/components/session-provider";

export const DashboardNavFooter = () => {
  const [pending, setPending] = React.useState(false);
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: (ctx) => {
          setPending(false);
          toast({
            title: "Uh oh! Something went wrong.",
            description:
              ctx.error.message ??
              "Something went wrong with the server. Please try again later.",
            variant: "destructive",
          });
        },
      },
    });
  };
  return (
    <SidebarMenu className="gap-2">
      <SidebarMenuItem>
        <SidebarMenuButton
          size={"lg"}
          className={cn(
            "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          )}
          tooltip={"Profile"}
        >
          <Avatar className={cn("h-8 w-8 rounded-full")}>
            <AvatarImage
              src={session?.user?.image ?? "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{session?.user.name}</span>
            <span className="truncate text-xs">{session?.user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={"Log out"}>
          <LoadingButton
            pending={pending}
            className="hover:bg-primary/90 group-data-[collapsible=icon]:h-8"
            onClick={onSubmit}
            type="button"
            variant={"default"}
          >
            <LogOut className="text-primary-foreground" />
          </LoadingButton>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
