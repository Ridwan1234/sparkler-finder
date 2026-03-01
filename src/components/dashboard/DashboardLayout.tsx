import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { usePriceAlertChecker } from "@/hooks/usePriceAlertChecker";

export default function DashboardLayout() {
  // Global price alert checker — runs everywhere in the dashboard
  usePriceAlertChecker();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-section-dark">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-sidebar-border px-4">
            <SidebarTrigger className="text-section-dark-foreground" />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
