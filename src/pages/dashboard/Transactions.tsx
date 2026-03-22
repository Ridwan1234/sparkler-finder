import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { Copy, Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function Transactions() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    if (!transactions) return [];
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter((tx) => {
      const ref = (tx as any).reference_number ?? "";
      return (
        ref.toLowerCase().includes(q) ||
        tx.type.toLowerCase().includes(q) ||
        (tx.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [transactions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopied(ref);
    toast.success(t("dashboard.refCopied", "Reference copied!"));
    setTimeout(() => setCopied(null), 2000);
  };

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
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.searchReference", "Search by reference, type or description...")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-background/10 border-border/20 text-section-dark-foreground"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">{t("dashboard.reference", "Reference")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.date")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.type")}</TableHead>
                <TableHead className="text-muted-foreground">{t("dashboard.transactions.description")}</TableHead>
                <TableHead className="text-muted-foreground text-right">{t("dashboard.transactions.amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((tx) => {
                const ref = (tx as any).reference_number ?? "";
                return (
                  <TableRow key={tx.id} className="border-border/10">
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-primary">{ref || "—"}</span>
                        {ref && (
                          <button
                            type="button"
                            onClick={() => copyRef(ref)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {copied === ref ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                    </TableCell>
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
                );
              })}
              {!paginated.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {search ? t("dashboard.noResults", "No results found") : t("dashboard.transactions.noTransactions")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.pagination", "Page {{page}} of {{total}}", { page: safeCurrentPage, total: totalPages })}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="border-border/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="border-border/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
