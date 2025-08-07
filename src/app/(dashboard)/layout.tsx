import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = false; // This will be dynamic in a real app

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex-1 bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
