import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function AdminDeposits() {
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ["admin_deposits"],
    queryFn: async () => {
      const { data: deps } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });
      if (!deps?.length) return [];
      const userIds = [...new Set(deps.map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.full_name]));
      return deps.map(d => ({ ...d, user_name: profileMap[d.user_id] || "Unknown" }));
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("deposits").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit status updated");
      queryClient.invalidateQueries({ queryKey: ["admin_deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin_pending_deposits"] });
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
        Manage Deposits
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
              {deposits?.map((d: any) => (
                <TableRow key={d.id} className="border-border/10">
                  <TableCell className="text-section-dark-foreground">
                    {format(new Date(d.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-section-dark-foreground">
                    {d.user_name}
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
                  <TableCell>
                    {d.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => updateStatus.mutate({ id: d.id, status: "approved" })}
                          disabled={updateStatus.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => updateStatus.mutate({ id: d.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!deposits?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No deposits found
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
