import {
  LayoutDashboard, TrendingUp, Wallet, ArrowDownToLine, ArrowUpFromLine,
  History, User, Users, LogOut, Shield, Bell,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { t } = useTranslation();

  const mainItems = [
    { title: t("dashboard.sidebar.overview"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("dashboard.sidebar.investmentPlans"), url: "/dashboard/plans", icon: TrendingUp },
    { title: t("dashboard.sidebar.myInvestments"), url: "/dashboard/investments", icon: Wallet },
    { title: t("dashboard.sidebar.deposits"), url: "/dashboard/deposits", icon: ArrowDownToLine },
    { title: t("dashboard.sidebar.withdrawals"), url: "/dashboard/withdrawals", icon: ArrowUpFromLine },
    { title: t("dashboard.sidebar.transactions"), url: "/dashboard/transactions", icon: History },
    { title: t("dashboard.sidebar.priceAlerts"), url: "/dashboard/alerts", icon: Bell },
  ];

  const accountItems = [
    { title: t("dashboard.sidebar.profile"), url: "/dashboard/profile", icon: User },
    { title: t("dashboard.sidebar.referrals"), url: "/dashboard/referrals", icon: Users },
  ];

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-5 border-b border-sidebar-border">
          {!collapsed ? (
            <span className="font-display text-lg font-bold text-primary">InvestPro</span>
          ) : (
            <span className="font-display text-lg font-bold text-primary">IP</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{t("dashboard.sidebar.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/dashboard"}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("dashboard.sidebar.account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <LanguageSwitcher />
          </div>
        )}
        {isAdmin && (
          <Button variant="ghost" size={collapsed ? "icon" : "sm"} asChild className="w-full text-gold hover:text-gold hover:bg-gold/10">
            <a href="/admin">
              <Shield className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{t("dashboard.sidebar.adminPanel")}</span>}
            </a>
          </Button>
        )}
        <Button variant="ghost" size={collapsed ? "icon" : "sm"} onClick={signOut} className="w-full text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">{t("dashboard.sidebar.signOut")}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
