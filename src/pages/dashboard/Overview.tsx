import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/hooks/useBalance";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DollarSign, TrendingUp, ArrowDownToLine, ArrowUpFromLine,
  Clock, ArrowRight, Gift, Wallet, Activity
} from "lucide-react";
import { format, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [chartCoin, setChartCoin] = useState<"BTC" | "ETH" | "BNB">("BTC");
  const {
    balance, activeInvestments, totalROI, totalDeposits,
    totalWithdrawals, totalBonuses, pendingWithdrawals, totalPrincipalReturns
  } = useBalance(user?.id);

  // Recent transactions
  const { data: recentTx } = useQuery({
    queryKey: ["recent_transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
    enabled: !!user,
  });

  // Active investments with plans
  const { data: activeInvList } = useQuery({
    queryKey: ["active_investments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, investment_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("expires_at", { ascending: true })
        .limit(3);
      return data ?? [];
    },
    enabled: !!user,
  });

  // Pending deposits count
  const { data: pendingDeposits } = useQuery({
    queryKey: ["pending_deposits_count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("deposits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "pending");
      return count ?? 0;
    },
    enabled: !!user,
  });

  // Generate simulated crypto price data
  const chartData = useMemo(() => {
    const days = chartPeriod === "7d" ? 7 : chartPeriod === "30d" ? 30 : 90;
    const basePrices: Record<string, { base: number; vol: number }> = {
      BTC: { base: 67400, vol: 2200 },
      ETH: { base: 3520, vol: 180 },
      BNB: { base: 605, vol: 25 },
    };
    const { base, vol } = basePrices[chartCoin];
    return Array.from({ length: days }, (_, i) => {
      const seed = chartCoin.charCodeAt(0) + days;
      const noise = Math.sin(seed + i * 0.7) * vol + Math.cos(seed * 0.3 + i * 1.1) * vol * 0.5;
      return {
        date: format(subDays(new Date(), days - 1 - i), "MMM d"),
        price: Math.round(base + noise),
      };
    });
  }, [chartCoin, chartPeriod]);

  const priceChange = chartData.length >= 2 ? chartData[chartData.length - 1].price - chartData[0].price : 0;
  const priceChangePercent = chartData.length >= 2 ? ((priceChange / chartData[0].price) * 100).toFixed(2) : "0";


  const stats = [
    { label: "Available Balance", value: `$${balance.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Investments", value: `$${activeInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-gold", bg: "bg-gold/10" },
    { label: "Total ROI Earned", value: `$${totalROI.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Deposits", value: `$${totalDeposits.toLocaleString()}`, icon: ArrowDownToLine, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Withdrawals", value: `$${totalWithdrawals.toLocaleString()}`, icon: ArrowUpFromLine, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Bonuses Earned", value: `$${totalBonuses.toLocaleString()}`, icon: Gift, color: "text-gold", bg: "bg-gold/10" },
  ];

  const typeColor: Record<string, string> = {
    deposit: "bg-primary/20 text-primary border-primary/30",
    withdrawal: "bg-destructive/20 text-destructive border-destructive/30",
    investment: "bg-gold/20 text-gold border-gold/30",
    roi: "bg-primary/20 text-primary border-primary/30",
    bonus: "bg-gold/20 text-gold border-gold/30",
    principal_return: "bg-primary/20 text-primary border-primary/30",
  };

  const now = Date.now();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="font-display text-2xl font-bold text-section-dark-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
        </h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/dashboard/deposits")} className="gap-1.5">
            <ArrowDownToLine className="h-3.5 w-3.5" /> Deposit
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/dashboard/withdrawals")} className="gap-1.5 border-border/20 text-section-dark-foreground">
            <ArrowUpFromLine className="h-3.5 w-3.5" /> Withdraw
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
              <div className={`p-1.5 rounded-md ${s.bg}`}>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-section-dark-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending alerts */}
      {(pendingDeposits! > 0 || pendingWithdrawals > 0) && (
        <div className="flex flex-wrap gap-3">
          {pendingDeposits! > 0 && (
            <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-2 rounded-lg text-sm">
              <Clock className="h-4 w-4" />
              {pendingDeposits} deposit{pendingDeposits! > 1 ? "s" : ""} pending approval
            </div>
          )}
          {pendingWithdrawals > 0 && (
            <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-2 rounded-lg text-sm">
              <Clock className="h-4 w-4" />
              ${pendingWithdrawals.toLocaleString()} in pending withdrawals
            </div>
          )}
        </div>
      )}

      {/* Two-column: Active Investments + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Investments */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Active Investments
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs gap-1"
              onClick={() => navigate("/dashboard/investments")}
            >
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeInvList && activeInvList.length > 0 ? (
              activeInvList.map((inv) => {
                const plan = inv.investment_plans;
                const startMs = new Date(inv.started_at).getTime();
                const endMs = new Date(inv.expires_at).getTime();
                const totalDuration = endMs - startMs || 1;
                const elapsed = now - startMs;
                const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                const remaining = Math.max(0, endMs - now);
                const daysLeft = Math.ceil(remaining / (24 * 60 * 60 * 1000));

                return (
                  <div key={inv.id} className="bg-background/5 border border-border/10 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-section-dark-foreground text-sm">{plan?.name ?? "Plan"}</p>
                        <p className="text-xs text-muted-foreground">${Number(inv.amount).toLocaleString()} invested</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gold">{Number(plan?.roi_percentage ?? 0)}% ROI</p>
                        <p className="text-xs text-muted-foreground">{daysLeft}d left</p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 space-y-2">
                <Wallet className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                <p className="text-sm text-muted-foreground">No active investments</p>
                <Button size="sm" variant="outline" className="border-border/20 text-section-dark-foreground" onClick={() => navigate("/dashboard/plans")}>
                  Browse Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" /> Recent Transactions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs gap-1"
              onClick={() => navigate("/dashboard/transactions")}
            >
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentTx && recentTx.length > 0 ? (
              <div className="space-y-2">
                {recentTx.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-[10px] ${typeColor[t.type] ?? ""}`}>
                        {t.type}
                      </Badge>
                      <div>
                        <p className="text-sm text-section-dark-foreground">{t.description ?? t.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.created_at && !isNaN(new Date(t.created_at).getTime())
                            ? format(new Date(t.created_at), "MMM d, yyyy")
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${
                      ["roi", "bonus", "principal_return"].includes(t.type)
                        ? "text-primary"
                        : t.type === "investment" ? "text-gold" : "text-section-dark-foreground"
                    }`}>
                      {["roi", "bonus", "principal_return"].includes(t.type) ? "+" : ""}${Number(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => navigate("/dashboard/plans")}
          className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-primary/30 transition-all"
        >
          <TrendingUp className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Start Investing</p>
          <p className="text-xs text-muted-foreground mt-1">Browse plans and grow your portfolio</p>
        </button>
        <button
          onClick={() => navigate("/dashboard/referrals")}
          className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-gold/30 transition-all"
        >
          <Gift className="h-6 w-6 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Refer Friends</p>
          <p className="text-xs text-muted-foreground mt-1">Share your link and earn rewards</p>
        </button>
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-primary/30 transition-all"
        >
          <Wallet className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Manage Profile</p>
          <p className="text-xs text-muted-foreground mt-1">Update your account details</p>
        </button>
      </div>
    </div>
  );
}
