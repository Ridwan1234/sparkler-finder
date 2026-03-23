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
import { Copy, Check, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getNetworkByValue } from "@/lib/cryptoNetworks";

export default function Deposits() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const { balance } = useBalance(user?.id);

  const { data: platformWallets } = useQuery({
    queryKey: ["wallet_addresses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_addresses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  const { data: deposits } = useQuery({
    queryKey: ["user_deposits_list", user?.id],
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

  const selectedWallet = platformWallets?.find((w) => w.id === selectedWalletId);

  const create = useMutation({
    mutationFn: async () => {
      if (!amount || Number(amount) <= 0) throw new Error(t("dashboard.deposits.errors.validAmount"));
      if (!selectedWallet) throw new Error(t("dashboard.deposits.errors.selectWallet"));
      const { error } = await supabase.from("deposits").insert({
        user_id: user!.id,
        amount: Number(amount),
        wallet_address: selectedWallet.address,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("dashboard.deposits.depositSubmitted"));
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["user_deposits_list"] });
      setAmount("");
      setSelectedWalletId("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    toast.success(t("dashboard.deposits.addressCopied"));
    setTimeout(() => setCopied(null), 2000);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-gold/20 text-gold border-gold/30",
    approved: "bg-primary/20 text-primary border-primary/30",
    rejected: "bg-destructive/20 text-destructive border-destructive/30",
  };

  const newBalance = balance + (Number(amount) || 0);

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">{t("dashboard.deposits.title")}</h1>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">{t("dashboard.deposits.newDeposit")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="break-words text-sm text-muted-foreground">
            {t("dashboard.deposits.currentBalance")}: <span className="font-semibold text-section-dark-foreground">${balance.toLocaleString()}</span>
            {Number(amount) > 0 && (
              <> · {t("dashboard.deposits.afterDeposit")}: <span className="font-semibold text-primary">${newBalance.toLocaleString()}</span></>
            )}
          </p>
          <Input
            type="number"
            placeholder={t("dashboard.deposits.amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background/10 border-border/20 text-section-dark-foreground"
          />

          {platformWallets && platformWallets.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("dashboard.deposits.selectWallet")}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {platformWallets.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWalletId(w.id)}
                    className={`text-left rounded-lg border p-3 transition-all ${
                      selectedWalletId === w.id
                        ? "border-primary bg-primary/10"
                        : "border-border/20 bg-background/5 hover:border-border/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-section-dark-foreground">
                        {getNetworkByValue(w.network)?.logo ? (
                          <img src={getNetworkByValue(w.network)!.logo} alt={w.network} className="h-5 w-5 rounded-full" />
                        ) : (
                          <Wallet className="h-3.5 w-3.5 text-primary" />
                        )}
                        {w.label}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{getNetworkByValue(w.network)?.label || w.network}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-mono text-muted-foreground truncate flex-1">{w.address}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); copyAddress(w.address); }}
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      >
                        {copied === w.address ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("dashboard.deposits.noWallets")}</p>
          )}

          <Button onClick={() => create.mutate()} disabled={create.isPending || !selectedWalletId}>
            {t("dashboard.deposits.submitDeposit")}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">{t("dashboard.deposits.depositHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">{t("dashboard.reference", "Reference")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.deposits.date")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.deposits.amount")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.deposits.wallet")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.deposits.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits?.map((d) => (
                <TableRow key={d.id} className="border-border/10">
                  <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="block max-w-[120px] truncate text-xs font-mono text-primary sm:max-w-none">{(d as any).reference_number ?? "—"}</span>
                      {(d as any).reference_number && (
                        <button
                          type="button"
                          onClick={() => { navigator.clipboard.writeText((d as any).reference_number); setCopied((d as any).reference_number); toast.success(t("dashboard.refCopied", "Reference copied!")); setTimeout(() => setCopied(null), 2000); }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {copied === (d as any).reference_number ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-section-dark-foreground">
                    {d.created_at && !isNaN(new Date(d.created_at).getTime())
                      ? format(new Date(d.created_at), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-section-dark-foreground font-medium">
                    ${Number(d.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono truncate max-w-[120px]">
                    {d.wallet_address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[d.status] ?? ""}>
                      {t(`dashboard.status.${d.status}` as const, { defaultValue: d.status })}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!deposits?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {t("dashboard.deposits.noDeposits")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
