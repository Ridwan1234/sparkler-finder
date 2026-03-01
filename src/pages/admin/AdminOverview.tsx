import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownToLine, ArrowUpFromLine, Clock, Users, DollarSign,
  TrendingUp, Activity, AlertTriangle, ArrowRight, Wallet, PieChart as PieChartIcon,
  CheckCircle2, XCircle, BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const PIE_COLORS = [
  "hsl(152, 87%, 30%)",
  "hsl(45, 93%, 58%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(350, 65%, 55%)",
  "hsl(170, 60%, 40%)",
];

export default function AdminOverview() {
  const navigate = useNavigate();

  // Pending deposits
  const { data: pendingDeposits } = useQuery({
    queryKey: ["admin_pending_deposits"],
    queryFn: async () => {
      const { count } = await supabase.from("deposits").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  // Pending withdrawals
  const { data: pendingWithdrawals } = useQuery({
    queryKey: ["admin_pending_withdrawals"],
    queryFn: async () => {
      const { count } = await supabase.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  // Total users
  const { data: totalUsers } = useQuery({
    queryKey: ["admin_total_users"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  // All deposits for stats
  const { data: allDeposits } = useQuery({
    queryKey: ["admin_all_deposits_stats"],
    queryFn: async () => {
      const { data } = await supabase.from("deposits").select("amount, status, created_at").order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  // All withdrawals for stats
  const { data: allWithdrawals } = useQuery({
    queryKey: ["admin_all_withdrawals_stats"],
    queryFn: async () => {
      const { data } = await supabase.from("withdrawals").select("amount, status, created_at").order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  // Active investments
  const { data: investments } = useQuery({
    queryKey: ["admin_investments_stats"],
    queryFn: async () => {
      const { data } = await supabase.from("investments").select("amount, status, plan_id, investment_plans(name)");
      return data ?? [];
    },
  });

  // Recent transactions (all users)
  const { data: recentTx } = useQuery({
    queryKey: ["admin_recent_tx"],
    queryFn: async () => {
      const { data: txs } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(8);
      if (!txs?.length) return [];
      const userIds = [...new Set(txs.map(t => t.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.full_name]));
      return txs.map(t => ({ ...t, user_name: nameMap[t.user_id] || "Unknown" }));
    },
  });

  // Recent pending deposits
  const { data: recentPendingDeposits } = useQuery({
    queryKey: ["admin_recent_pending_deposits"],
    queryFn: async () => {
      const { data: deps } = await supabase.from("deposits").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(5);
      if (!deps?.length) return [];
      const userIds = [...new Set(deps.map(d => d.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.full_name]));
      return deps.map(d => ({ ...d, user_name: nameMap[d.user_id] || "Unknown" }));
    },
  });

  // Computed stats
  const totalDepositsApproved = allDeposits?.filter(d => d.status === "approved").reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalDepositsAll = allDeposits?.reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalWithdrawalsApproved = allWithdrawals?.filter(w => w.status === "approved").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const totalPendingDepositAmount = allDeposits?.filter(d => d.status === "pending").reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalPendingWithdrawalAmount = allWithdrawals?.filter(w => w.status === "pending").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const activeInvestmentCount = investments?.filter(i => i.status === "active").length ?? 0;
  const activeInvestmentValue = investments?.filter(i => i.status === "active").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const netFlow = totalDepositsApproved - totalWithdrawalsApproved;

  // Deposit volume by day (last 30 days)
  const depositChartData = (() => {
    if (!allDeposits?.length) return [];
    const approved = allDeposits.filter(d => d.status === "approved");
    const grouped: Record<string, number> = {};
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    approved.forEach(d => {
      const ts = new Date(d.created_at).getTime();
      if (ts >= thirtyDaysAgo) {
        const day = format(new Date(d.created_at), "MMM d");
        grouped[day] = (grouped[day] ?? 0) + Number(d.amount);
      }
    });
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
  })();

  // Investment allocation pie
  const pieData = (() => {
    if (!investments?.length) return [];
    const active = investments.filter(i => i.status === "active");
    const grouped: Record<string, number> = {};
    active.forEach(inv => {
      const name = (inv.investment_plans as any)?.name ?? "Unknown";
      grouped[name] = (grouped[name] ?? 0) + Number(inv.amount);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  })();

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/10", prefix: "" },
    { label: "Approved Deposits", value: `$${totalDepositsApproved.toLocaleString()}`, icon: ArrowDownToLine, color: "text-primary", bg: "bg-primary/10", prefix: "" },
    { label: "Approved Withdrawals", value: `$${totalWithdrawalsApproved.toLocaleString()}`, icon: ArrowUpFromLine, color: "text-destructive", bg: "bg-destructive/10", prefix: "" },
    { label: "Net Cash Flow", value: `$${netFlow.toLocaleString()}`, icon: DollarSign, color: netFlow >= 0 ? "text-primary" : "text-destructive", bg: netFlow >= 0 ? "bg-primary/10" : "bg-destructive/10", prefix: "" },
    { label: "Active Investments", value: `${activeInvestmentCount} ($${activeInvestmentValue.toLocaleString()})`, icon: TrendingUp, color: "text-gold", bg: "bg-gold/10", prefix: "" },
    { label: "Pending Actions", value: `${(pendingDeposits ?? 0) + (pendingWithdrawals ?? 0)}`, icon: Clock, color: "text-gold", bg: "bg-gold/10", prefix: "" },
  ];

  const typeColor: Record<string, string> = {
    deposit: "bg-primary/20 text-primary border-primary/30",
    withdrawal: "bg-destructive/20 text-destructive border-destructive/30",
    investment: "bg-gold/20 text-gold border-gold/30",
    roi: "bg-primary/20 text-primary border-primary/30",
    bonus: "bg-gold/20 text-gold border-gold/30",
    principal_return: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-section-dark-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Platform overview and pending actions</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/admin/deposits")} className="gap-1.5">
            <ArrowDownToLine className="h-3.5 w-3.5" /> Deposits
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/admin/withdrawals")} className="gap-1.5 border-border/20 text-section-dark-foreground">
            <ArrowUpFromLine className="h-3.5 w-3.5" /> Withdrawals
          </Button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="bg-card/5 border-border/10 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`p-1.5 rounded-md ${s.bg}`}>
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-section-dark-foreground">{s.prefix}{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Urgent: Pending Actions */}
      {((pendingDeposits ?? 0) > 0 || (pendingWithdrawals ?? 0) > 0) && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {(pendingDeposits ?? 0) > 0 && (
            <motion.button
              onClick={() => navigate("/admin/deposits")}
              className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-2 rounded-lg text-sm hover:bg-gold/20 transition-colors"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="h-4 w-4" />
              {pendingDeposits} deposit{(pendingDeposits ?? 0) > 1 ? "s" : ""} awaiting approval — ${totalPendingDepositAmount.toLocaleString()}
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
          {(pendingWithdrawals ?? 0) > 0 && (
            <motion.button
              onClick={() => navigate("/admin/withdrawals")}
              className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm hover:bg-destructive/20 transition-colors"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <AlertTriangle className="h-4 w-4" />
              {pendingWithdrawals} withdrawal{(pendingWithdrawals ?? 0) > 1 ? "s" : ""} awaiting approval — ${totalPendingWithdrawalAmount.toLocaleString()}
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Charts Row: Deposit Volume + Investment Allocation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Deposit Volume Chart */}
        <Card className="bg-card/5 border-border/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Deposit Volume (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {depositChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depositChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(155, 20%, 18%)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(155, 25%, 9%)", border: "1px solid hsl(155, 20%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(150, 10%, 90%)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
                    />
                    <Bar dataKey="amount" fill="hsl(152, 87%, 30%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No deposit data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investment Allocation Pie */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-gold" /> Investment Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name" stroke="none">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(155, 25%, 9%)", border: "1px solid hsl(155, 20%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(150, 10%, 90%)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-sm text-muted-foreground">No active investments</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-column: Pending Deposits Queue + Recent Transactions */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-2">
        {/* Pending Deposits Queue */}
        <motion.div variants={fadeUp}>
          <Card className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> Pending Deposits
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" onClick={() => navigate("/admin/deposits")}>
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentPendingDeposits && recentPendingDeposits.length > 0 ? (
                recentPendingDeposits.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2.5 border-b border-border/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                        <ArrowDownToLine className="h-3.5 w-3.5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-section-dark-foreground">{d.user_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.created_at && !isNaN(new Date(d.created_at).getTime())
                            ? format(new Date(d.created_at), "MMM d, h:mm a")
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold">${Number(d.amount).toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px] bg-gold/20 text-gold border-gold/30">pending</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-primary/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up! No pending deposits</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={fadeUp}>
          <Card className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTx && recentTx.length > 0 ? (
                <div className="space-y-1">
                  {recentTx.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`text-[10px] ${typeColor[t.type] ?? ""}`}>
                          {t.type}
                        </Badge>
                        <div>
                          <p className="text-sm text-section-dark-foreground">{t.user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.description ?? t.type} · {t.created_at && !isNaN(new Date(t.created_at).getTime())
                              ? format(new Date(t.created_at), "MMM d, h:mm a")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${
                        ["roi", "bonus", "principal_return", "deposit"].includes(t.type)
                          ? "text-primary"
                          : t.type === "investment" ? "text-gold" : "text-section-dark-foreground"
                      }`}>
                        ${Number(t.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">No transactions yet</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-4">
        {[
          { onClick: () => navigate("/admin/deposits"), icon: ArrowDownToLine, color: "text-primary", title: "Manage Deposits", desc: "Review & approve" },
          { onClick: () => navigate("/admin/withdrawals"), icon: ArrowUpFromLine, color: "text-destructive", title: "Manage Withdrawals", desc: "Process requests" },
          { onClick: () => navigate("/admin/users"), icon: Users, color: "text-gold", title: "User Management", desc: "View all accounts" },
          { onClick: () => navigate("/admin/settings"), icon: Wallet, color: "text-primary", title: "Platform Settings", desc: "Plans & wallets" },
        ].map((action) => (
          <motion.button
            key={action.title}
            variants={fadeUp}
            onClick={action.onClick}
            className="group bg-card/5 border border-border/10 rounded-xl p-4 text-left hover:border-primary/20 transition-all duration-300"
            whileHover={{ y: -3, boxShadow: "0 8px 30px hsl(152, 87%, 30%, 0.08)" }}
            whileTap={{ scale: 0.98 }}
          >
            <action.icon className={`h-5 w-5 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
            <p className="font-semibold text-section-dark-foreground text-sm">{action.title}</p>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
