import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default function Overview() {
  const { user } = useAuth();
  const { balance, activeInvestments, totalROI, totalDeposits, totalWithdrawals } = useBalance(user?.id);

  const stats = [
    { label: "Balance", value: `$${balance.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Active Investments", value: `$${activeInvestments.toLocaleString()}`, icon: TrendingUp, color: "text-gold" },
    { label: "Total ROI Earned", value: `$${totalROI.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
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
