import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { usePriceAlertChecker } from "@/hooks/usePriceAlertChecker";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout() {
  usePriceAlertChecker();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-section-dark">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-sidebar-border px-4">
            <SidebarTrigger className="text-section-dark-foreground" />
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
