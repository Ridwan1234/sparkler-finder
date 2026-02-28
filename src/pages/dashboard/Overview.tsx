import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function Overview() {
  const { user } = useAuth();

  const { data: deposits } = useQuery({
    queryKey: ["deposits", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("deposits")
        .select("amount, status")
        .eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: withdrawals } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals")
        .select("amount, status")
        .eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: investments } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("amount, status")
        .eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const totalDeposits = deposits?.filter(d => d.status === "approved").reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalWithdrawals = withdrawals?.filter(w => w.status === "approved").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const activeInvestments = investments?.filter(i => i.status === "active").reduce((s, i) => s + Number(i.amount), 0) ?? 0;
  const totalBonuses = transactions?.filter(t => t.type === "bonus").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalInvested = transactions?.filter(t => t.type === "investment").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const balance = totalDeposits + totalBonuses - totalWithdrawals - totalInvested;

  const stats = [
    { label: "Balance", value: `$${balance.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Active Investments", value: `$${activeInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-gold" },
    { label: "Total Deposits", value: `$${totalDeposits.toLocaleString()}`, icon: ArrowDownToLine, color: "text-primary" },
    { label: "Total Withdrawals", value: `$${totalWithdrawals.toLocaleString()}`, icon: ArrowUpFromLine, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        Welcome back, {user?.user_metadata?.full_name || user?.email}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-section-dark-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
