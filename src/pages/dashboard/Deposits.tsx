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

export default function Deposits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const { data: deposits } = useQuery({
    queryKey: ["deposits", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount");
      if (!wallet.trim()) throw new Error("Enter wallet address");
      const { error } = await supabase.from("deposits").insert({
        user_id: user!.id,
        amount: Number(amount),
        wallet_address: wallet.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit request submitted!");
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
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
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">Deposits</h1>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">New Deposit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="number"
            placeholder="Amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
          />
          <Input
            placeholder="Crypto wallet address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
          />
          <Button onClick={() => create.mutate()} disabled={create.isPending}>
            Submit Deposit
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">Deposit History</CardTitle>
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
              {deposits?.map((d) => (
                <TableRow key={d.id} className="border-border/10">
                  <TableCell className="text-section-dark-foreground">
                    {format(new Date(d.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-section-dark-foreground font-medium">
                    ${Number(d.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono truncate max-w-[120px]">
                    {d.wallet_address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[d.status] ?? ""}>
                      {d.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!deposits?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No deposits yet
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
