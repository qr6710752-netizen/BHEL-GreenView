
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
  User,
  Gamepad2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

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
  {
    href: "/games",
    label: "Games",
    icon: Gamepad2,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

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
                isActive={pathname.startsWith(item.href) && (item.href === "/" ? pathname === "/" : true)}
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
        {user && (
          <div className="flex items-center gap-3">
              <Avatar>
                  <AvatarImage src={user.photoURL ?? `https://placehold.co/40x40.png`} alt="User Avatar" data-ai-hint="profile picture" />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-foreground">{user.displayName || "User"}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
               <SidebarMenuButton asChild size="icon" className="ml-auto w-8 h-8 group-data-[collapsible=icon]:hidden" variant="ghost" onClick={handleLogout}>
                  <a href="#">
                      <LogOut />
                  </a>
               </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
