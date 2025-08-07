"use client";

import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Lightbulb,
  Trophy,
  ShieldAlert,
  LogOut,
  Leaf,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const menuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/initiatives",
    label: "Initiatives",
    icon: Lightbulb,
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
  },
  {
    href: "/anomaly-detection",
    label: "Anomaly Detection",
    icon: ShieldAlert,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
                <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                BHEL GreenView
            </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="profile picture" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@bhel.in</span>
            </div>
             <SidebarMenuButton asChild size="icon" className="ml-auto w-8 h-8 group-data-[collapsible=icon]:hidden" variant="ghost">
                <a href="#">
                    <LogOut />
                </a>
             </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </>
  );
}
