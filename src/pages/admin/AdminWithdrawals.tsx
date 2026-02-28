import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();

  const { data: withdrawals } = useQuery({
    queryKey: ["admin_withdrawals"],
    queryFn: async () => {
      const { data: wds } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });
      if (!wds?.length) return [];
      const userIds = [...new Set(wds.map(w => w.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.full_name]));
      return wds.map(w => ({ ...w, user_name: profileMap[w.user_id] || "Unknown" }));
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("withdrawals").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Withdrawal status updated");
      queryClient.invalidateQueries({ queryKey: ["admin_withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin_pending_withdrawals"] });
    },
    onError: () => toast.error("Failed to update"),
  });

  const statusColor: Record<string, string> = {
    pending: "bg-gold/20 text-gold border-gold/30",
    approved: "bg-primary/20 text-primary border-primary/30",
    rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        Manage Withdrawals
      </h1>
      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Wallet</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals?.map((w: any) => (
                <TableRow key={w.id} className="border-border/10">
                  <TableCell className="text-section-dark-foreground">
                    {format(new Date(w.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-section-dark-foreground">
                    {w.user_name}
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
                  <TableCell>
                    {w.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => updateStatus.mutate({ id: w.id, status: "approved" })}
                          disabled={updateStatus.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => updateStatus.mutate({ id: w.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!withdrawals?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No withdrawals found
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
