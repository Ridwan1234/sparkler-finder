import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/hooks/useBalance";
import { useCryptoChart, useCryptoTicker } from "@/hooks/useCryptoPrices";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine,
  Clock, ArrowRight, Gift, Wallet, Activity, PieChart as PieChartIcon
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import PriceAlerts from "@/components/dashboard/PriceAlerts";

const PIE_COLORS = [
  "hsl(152, 87%, 30%)",
  "hsl(45, 93%, 58%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(350, 65%, 55%)",
  "hsl(170, 60%, 40%)",
];

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartCoin, setChartCoin] = useState<"BTC" | "ETH" | "BNB">("BTC");
  const [chartDays, setChartDays] = useState(30);
  const {
    balance, activeInvestments, totalROI, totalDeposits,
    totalWithdrawals, totalBonuses, pendingWithdrawals,
  } = useBalance(user?.id);

  // Live crypto data
  const { data: ticker } = useCryptoTicker();
  const { data: chartData, isLoading: chartLoading } = useCryptoChart(chartCoin, chartDays);
  const COIN_MAP: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum", BNB: "binancecoin" };
  const activeTicker = ticker?.find((t) => t.id === COIN_MAP[chartCoin]);
  const isUp = (activeTicker?.price_change_percentage_24h ?? 0) >= 0;

  // Recent transactions
  const { data: recentTx } = useQuery({
    queryKey: ["recent_transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions").select("*").eq("user_id", user!.id)
        .order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
    enabled: !!user,
  });

  // Active investments with plans
  const { data: activeInvList } = useQuery({
    queryKey: ["active_investments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments").select("*, investment_plans(*)")
        .eq("user_id", user!.id).eq("status", "active")
        .order("expires_at", { ascending: true }).limit(3);
      return data ?? [];
    },
    enabled: !!user,
  });

  // All investments for pie chart
  const { data: allInvestments } = useQuery({
    queryKey: ["all_investments_pie", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments").select("amount, investment_plans(name)")
        .eq("user_id", user!.id).eq("status", "active");
      return data ?? [];
    },
    enabled: !!user,
  });

  // Pending deposits count
  const { data: pendingDeposits } = useQuery({
    queryKey: ["pending_deposits_count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("deposits").select("id", { count: "exact", head: true })
        .eq("user_id", user!.id).eq("status", "pending");
      return count ?? 0;
    },
    enabled: !!user,
  });

  // Build pie data
  const pieData = (() => {
    if (!allInvestments || allInvestments.length === 0) return [];
    const grouped: Record<string, number> = {};
    allInvestments.forEach((inv) => {
      const name = (inv.investment_plans as any)?.name ?? "Unknown";
      grouped[name] = (grouped[name] ?? 0) + Number(inv.amount);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  })();

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

      {/* Live Crypto Chart + Portfolio Pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Crypto Chart — 2/3 width */}
        <Card className="bg-card/5 border-border/10 lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Market Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {chartCoin}/USD
                {activeTicker && (
                  <span className={`ml-2 font-semibold ${isUp ? "text-primary" : "text-destructive"}`}>
                    {isUp ? "+" : ""}{activeTicker.price_change_percentage_24h.toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={chartCoin} onValueChange={(v) => setChartCoin(v as "BTC" | "ETH" | "BNB")}>
                <TabsList className="h-8 bg-background/10">
                  {(["BTC", "ETH", "BNB"] as const).map((c) => (
                    <TabsTrigger key={c} value={c} className="text-xs px-2.5 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{c}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Tabs value={String(chartDays)} onValueChange={(v) => setChartDays(Number(v))}>
                <TabsList className="h-8 bg-background/10">
                  {[{ v: "7", l: "7D" }, { v: "30", l: "30D" }, { v: "90", l: "90D" }].map((p) => (
                    <TabsTrigger key={p.v} value={p.v} className="text-xs px-2.5 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{p.l}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* Ticker row */}
            <div className="flex gap-4 mb-4 overflow-x-auto pb-1">
              {(["BTC", "ETH", "BNB"] as const).map((sym) => {
                const t = ticker?.find((x) => x.id === COIN_MAP[sym]);
                const up = (t?.price_change_percentage_24h ?? 0) >= 0;
                return (
                  <div key={sym} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap ${chartCoin === sym ? "border-primary/30 bg-primary/5" : "border-border/10"}`}>
                    {t?.image && <img src={t.image} alt={sym} className="w-4 h-4 rounded-full" />}
                    <span className="font-semibold text-section-dark-foreground">{sym}</span>
                    <span className="text-section-dark-foreground">{t ? `$${t.current_price.toLocaleString()}` : "—"}</span>
                    <span className={`flex items-center gap-0.5 ${up ? "text-primary" : "text-destructive"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {t ? `${t.price_change_percentage_24h.toFixed(1)}%` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-64">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData ?? []} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashPriceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(152, 87%, 30%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(152, 87%, 30%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(155, 20%, 18%)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ background: "hsl(155, 25%, 9%)", border: "1px solid hsl(155, 20%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(150, 10%, 90%)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, chartCoin]}
                    />
                    <Area type="monotone" dataKey="price" stroke="hsl(152, 87%, 30%)" strokeWidth={2} fill="url(#dashPriceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation Pie — 1/3 width */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-gold" /> Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(155, 25%, 9%)", border: "1px solid hsl(155, 20%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(150, 10%, 90%)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <PieChartIcon className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                <p className="text-sm text-muted-foreground">No active investments</p>
                <Button size="sm" variant="outline" className="border-border/20 text-section-dark-foreground" onClick={() => navigate("/dashboard/plans")}>
                  Start Investing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Two-column: Active Investments + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Investments */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Active Investments
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" onClick={() => navigate("/dashboard/investments")}>
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
            <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" onClick={() => navigate("/dashboard/transactions")}>
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
        <button onClick={() => navigate("/dashboard/plans")} className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-primary/30 transition-all">
          <TrendingUp className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Start Investing</p>
          <p className="text-xs text-muted-foreground mt-1">Browse plans and grow your portfolio</p>
        </button>
        <button onClick={() => navigate("/dashboard/referrals")} className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-gold/30 transition-all">
          <Gift className="h-6 w-6 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Refer Friends</p>
          <p className="text-xs text-muted-foreground mt-1">Share your link and earn rewards</p>
        </button>
        <button onClick={() => navigate("/dashboard/profile")} className="group bg-card/5 border border-border/10 rounded-xl p-5 text-left hover:border-primary/30 transition-all">
          <Wallet className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-section-dark-foreground text-sm">Manage Profile</p>
          <p className="text-xs text-muted-foreground mt-1">Update your account details</p>
        </button>
      </div>
    </div>
  );
}
