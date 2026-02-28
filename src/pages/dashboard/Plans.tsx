import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, Gift } from "lucide-react";

export default function Plans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["investment_plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investment_plans")
        .select("*")
        .order("min_amount", { ascending: true });
      return data ?? [];
    },
  });

  const { data: bonusSetting } = useQuery({
    queryKey: ["site_settings", "first_deposit_bonus_percent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "first_deposit_bonus_percent")
        .maybeSingle();
      return data?.value ?? null;
    },
  });

  const { data: hasDeposits } = useQuery({
    queryKey: ["user_has_deposits", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("deposits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "approved");
      return (count ?? 0) > 0;
    },
    enabled: !!user,
  });

  // Fetch balance components
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
  const totalBonuses = transactions?.filter(t => t.type === "bonus").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalInvested = transactions?.filter(t => t.type === "investment").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalROI = transactions?.filter(t => t.type === "roi").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const balance = totalDeposits + totalBonuses + totalROI - totalWithdrawals - totalInvested;

  const bonusPercent = bonusSetting ? Number(bonusSetting) : null;
  const showBonus = bonusPercent && !hasDeposits;

  const invest = useMutation({
    mutationFn: async ({ planId, amount }: { planId: string; amount: number }) => {
      const plan = plans?.find((p) => p.id === planId);
      if (!plan) throw new Error("Plan not found");
      if (amount < Number(plan.min_amount) || amount > Number(plan.max_amount))
        throw new Error(`Amount must be between $${plan.min_amount} and $${plan.max_amount}`);
      if (amount > balance)
        throw new Error(`Insufficient balance. Your available balance is $${balance.toLocaleString()}`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

      const { error } = await supabase.from("investments").insert({
        user_id: user!.id,
        plan_id: planId,
        amount,
        expires_at: expiresAt.toISOString(),
      });
      if (error) throw error;

      // Deduct from balance
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user!.id,
        amount,
        type: "investment",
        description: `Investment in ${plan.name} plan`,
      });
      if (txError) throw txError;
    },
    onSuccess: () => {
      toast.success("Investment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setSelectedPlan(null);
      setAmount("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const tierColors: Record<string, string> = {
    Standard: "border-muted-foreground/30",
    Silver: "border-muted-foreground/50",
    Golden: "border-gold/50",
    Diamond: "border-primary/50",
  };

  if (isLoading) return <div className="text-section-dark-foreground">Loading plans...</div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        Investment Plans
      </h1>

      {showBonus && (
        <div className="mb-6 flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-5 py-3 rounded-xl text-sm font-semibold">
          <Gift size={18} />
          🎉 You're eligible for a {bonusPercent}% first deposit bonus! Make your first deposit to claim it.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans?.map((plan) => {
          const isPopular = (plan as any).is_popular ?? false;

          return (
            <Card
              key={plan.id}
              className={`bg-card/5 border-2 ${tierColors[plan.name] ?? "border-border/10"} transition-all hover:scale-[1.02] relative`}
            >
              {isPopular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground border-0">
                  POPULAR
                </Badge>
              )}
              <CardHeader className="text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-section-dark-foreground">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-3xl font-bold text-gold">{Number(plan.roi_percentage)}% ROI</p>
                <p className="text-sm text-muted-foreground">{plan.duration_days} days</p>
                <p className="text-sm text-muted-foreground">
                  ${Number(plan.min_amount).toLocaleString()} – ${Number(plan.max_amount).toLocaleString()}
                </p>
                {selectedPlan === plan.id ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-background/10 border-border/20 text-section-dark-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={invest.isPending}
                        onClick={() => invest.mutate({ planId: plan.id, amount: Number(amount) })}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border/20 text-section-dark-foreground"
                        onClick={() => setSelectedPlan(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setSelectedPlan(plan.id)}>
                    Invest Now
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
