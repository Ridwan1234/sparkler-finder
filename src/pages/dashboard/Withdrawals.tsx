import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBalance } from "@/hooks/useBalance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function Withdrawals() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const { balance } = useBalance(user?.id);

  const { data: withdrawals } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: investments } = useQuery({
    queryKey: ["investments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("investments").select("id, status").eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: plans } = useQuery({
    queryKey: ["investment_plans"],
    queryFn: async () => {
      const { data } = await supabase.from("investment_plans").select("min_amount");
      return data ?? [];
    },
  });

  const hasInvestment = (investments?.length ?? 0) > 0;
  const minWithdrawal = plans?.length ? Math.min(...plans.map(p => Number(p.min_amount))) : 0;

  const create = useMutation({
    mutationFn: async () => {
      const amt = Number(amount);
      if (!amount || amt <= 0) throw new Error("Enter a valid amount");
      if (!wallet.trim()) throw new Error("Enter wallet address");
      if (!hasInvestment) throw new Error("You must have at least one investment to withdraw");
      if (minWithdrawal > 0 && amt < minWithdrawal) throw new Error(`Minimum withdrawal is $${minWithdrawal.toLocaleString()}`);
      if (amt > balance) throw new Error(`Insufficient balance. Available: $${balance.toLocaleString()}`);
      const { error } = await supabase.from("withdrawals").insert({
        user_id: user!.id,
        amount: amt,
        wallet_address: wallet.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("dashboard.withdrawals.withdrawalSubmitted"));
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setAmount("");
      setWallet("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusColor: Record<string, string> = {
    pending: "bg-gold/20 text-gold border-gold/30",
    approved: "bg-primary/20 text-primary border-primary/30",
    rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">{t("dashboard.withdrawals.title")}</h1>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">{t("dashboard.withdrawals.newWithdrawal")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.withdrawals.availableBalance")}: <span className="font-semibold text-section-dark-foreground">${balance.toLocaleString()}</span>
            {minWithdrawal > 0 && <> · {t("dashboard.withdrawals.minWithdrawal")}: <span className="font-semibold">${minWithdrawal.toLocaleString()}</span></>}
          </p>
          {!hasInvestment && (
            <p className="text-sm text-destructive">{t("dashboard.withdrawals.needInvestment")}</p>
          )}
          <Input
            type="number"
            placeholder={t("dashboard.withdrawals.amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
            disabled={!hasInvestment}
          />
          <Input
            placeholder={t("dashboard.withdrawals.walletPlaceholder")}
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
            disabled={!hasInvestment}
          />
          <Button onClick={() => create.mutate()} disabled={create.isPending || !hasInvestment}>
            {t("dashboard.withdrawals.submitWithdrawal")}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">{t("dashboard.withdrawals.withdrawalHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">{t("dashboard.withdrawals.date")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.withdrawals.amount")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.withdrawals.wallet")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.withdrawals.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals?.map((w) => (
                <TableRow key={w.id} className="border-border/10">
                  <TableCell className="text-section-dark-foreground">
                    {w.created_at && !isNaN(new Date(w.created_at).getTime())
                      ? format(new Date(w.created_at), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-section-dark-foreground font-medium">
                    ${Number(w.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono truncate max-w-[120px]">
                    {w.wallet_address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[w.status] ?? ""}>
                      {w.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!withdrawals?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {t("dashboard.withdrawals.noWithdrawals")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
