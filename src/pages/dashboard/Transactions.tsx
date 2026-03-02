import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function Transactions() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const typeColor: Record<string, string> = {
    deposit: "bg-primary/20 text-primary border-primary/30",
    withdrawal: "bg-destructive/20 text-destructive border-destructive/30",
    investment: "bg-gold/20 text-gold border-gold/30",
    spot_buy: "bg-primary/20 text-primary border-primary/30",
    spot_sell: "bg-destructive/20 text-destructive border-destructive/30",
    roi: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        {t("dashboard.transactions.title")}
      </h1>

      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.date")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.type")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.description")}</TableHead>
                <TableHead className="text-muted-foreground text-right">{t("dashboard.transactions.amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((tx) => (
                <TableRow key={tx.id} className="border-border/10">
                  <TableCell className="text-section-dark-foreground">
                    {tx.created_at && !isNaN(new Date(tx.created_at).getTime())
                      ? format(new Date(tx.created_at), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColor[tx.type] ?? ""}>
                      {t(`dashboard.transactionTypes.${tx.type}` as const, { defaultValue: tx.type })}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.description ?? "—"}</TableCell>
                  <TableCell className="text-right text-section-dark-foreground font-medium">
                    ${Number(tx.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {!transactions?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {t("dashboard.transactions.noTransactions")}
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
