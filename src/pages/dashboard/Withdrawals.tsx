import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Withdrawals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

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

  const { data: deposits } = useQuery({
    queryKey: ["deposits", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("deposits").select("amount, status").eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: allWithdrawals } = useQuery({
    queryKey: ["withdrawals-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("withdrawals").select("amount, status").eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("amount, type").eq("user_id", user!.id);
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

  const totalDeposits = deposits?.filter(d => d.status === "approved").reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalWithdrawals = allWithdrawals?.filter(w => w.status === "approved").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const totalBonuses = transactions?.filter(t => t.type === "bonus").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalROI = transactions?.filter(t => t.type === "roi").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalPrincipalReturns = transactions?.filter(t => t.type === "principal_return").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalInvested = transactions?.filter(t => t.type === "investment").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const pendingWithdrawals = allWithdrawals?.filter(w => w.status === "pending").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const balance = totalDeposits + totalBonuses + totalROI + totalPrincipalReturns - totalWithdrawals - totalInvested - pendingWithdrawals;

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
      toast.success("Withdrawal request submitted!");
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals-balance"] });
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
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">Withdrawals</h1>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">New Withdrawal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Available balance: <span className="font-semibold text-section-dark-foreground">${balance.toLocaleString()}</span>
            {minWithdrawal > 0 && <> · Min withdrawal: <span className="font-semibold">${minWithdrawal.toLocaleString()}</span></>}
          </p>
          {!hasInvestment && (
            <p className="text-sm text-destructive">You need at least one investment before you can withdraw.</p>
          )}
          <Input
            type="number"
            placeholder="Amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
            disabled={!hasInvestment}
          />
          <Input
            placeholder="Crypto wallet address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
            disabled={!hasInvestment}
          />
          <Button onClick={() => create.mutate()} disabled={create.isPending || !hasInvestment}>
            Submit Withdrawal
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Wallet</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
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
                    No withdrawals yet
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
