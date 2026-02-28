import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

export default function Plans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["investment_plans"],
    queryFn: async () => {
      const { data } = await supabase.from("investment_plans").select("*");
      return data ?? [];
    },
  });

  const invest = useMutation({
    mutationFn: async ({ planId, amount }: { planId: string; amount: number }) => {
      const plan = plans?.find((p) => p.id === planId);
      if (!plan) throw new Error("Plan not found");
      if (amount < Number(plan.min_amount) || amount > Number(plan.max_amount))
        throw new Error(`Amount must be between $${plan.min_amount} and $${plan.max_amount}`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

      const { error } = await supabase.from("investments").insert({
        user_id: user!.id,
        plan_id: planId,
        amount,
        expires_at: expiresAt.toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Investment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["investments"] });
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans?.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-card/5 border-2 ${tierColors[plan.name] ?? "border-border/10"} transition-all hover:scale-[1.02]`}
          >
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
        ))}
      </div>
    </div>
  );
}
