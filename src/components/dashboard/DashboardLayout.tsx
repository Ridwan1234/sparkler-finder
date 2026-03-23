import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { usePriceAlertChecker } from "@/hooks/usePriceAlertChecker";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout() {
  usePriceAlertChecker();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-section-dark">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="h-14 flex items-center justify-between border-b border-sidebar-border px-4">
            <SidebarTrigger className="text-section-dark-foreground" />
            <ThemeToggle />
          </header>
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
