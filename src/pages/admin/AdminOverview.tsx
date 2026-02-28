import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";

export default function AdminOverview() {
  const { data: pendingDeposits } = useQuery({
    queryKey: ["admin_pending_deposits"],
    queryFn: async () => {
      const { count } = await supabase
        .from("deposits")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      return count ?? 0;
    },
  });

  const { data: pendingWithdrawals } = useQuery({
    queryKey: ["admin_pending_withdrawals"],
    queryFn: async () => {
      const { count } = await supabase
        .from("withdrawals")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Pending Deposits", value: pendingDeposits ?? 0, icon: ArrowDownToLine, color: "text-gold" },
    { label: "Pending Withdrawals", value: pendingWithdrawals ?? 0, icon: ArrowUpFromLine, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        Admin Overview
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/5 border-border/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-section-dark-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
