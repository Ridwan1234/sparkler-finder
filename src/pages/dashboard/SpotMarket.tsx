import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/hooks/useBalance";
import { useCryptoTicker } from "@/hooks/useCryptoPrices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const SUPPORTED_COINS = ["BTC", "ETH", "BNB"] as const;
type Coin = (typeof SUPPORTED_COINS)[number];

export default function SpotMarket() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { balance } = useBalance(user?.id);
  const { data: ticker } = useCryptoTicker();

  const [buyCoin, setBuyCoin] = useState<Coin>("BTC");
  const [buyUsd, setBuyUsd] = useState("");
  const [sellCoin, setSellCoin] = useState<Coin>("BTC");
  const [sellQty, setSellQty] = useState("");

  const { data: positions } = useQuery({
    queryKey: ["spot_positions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spot_positions")
        .select("*")
        .eq("user_id", user!.id)
        .order("coin_symbol", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ["spot_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spot_orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const coinPrice = useMemo(() => {
    const map: Record<string, number> = { BTC: 0, ETH: 0, BNB: 0 };
    ticker?.forEach((item) => {
      const sym = item.symbol.toUpperCase();
      if (sym in map) map[sym] = Number(item.current_price);
    });
    return map;
  }, [ticker]);

  const portfolio = useMemo(() => {
    const totalCost = positions?.reduce((sum, p) => sum + Number(p.invested_usd), 0) ?? 0;
    const totalValue =
      positions?.reduce((sum, p) => sum + Number(p.quantity) * (coinPrice[p.coin_symbol] ?? 0), 0) ?? 0;
    return { totalCost, totalValue, pnl: totalValue - totalCost };
  }, [positions, coinPrice]);

  const buyMutation = useMutation({
    mutationFn: async () => {
      const usd = Number(buyUsd);
      const price = coinPrice[buyCoin];
      if (!usd || usd <= 0)
        throw new Error(t("dashboard.spot.errors.validAmount", { defaultValue: "Enter a valid USD amount" }));
      if (!price || price <= 0)
        throw new Error(
          t("dashboard.spot.errors.priceUnavailable", { defaultValue: "Live price is unavailable right now" }),
        );
      if (usd > balance)
        throw new Error(t("dashboard.spot.errors.insufficientBalance", { defaultValue: "Insufficient balance" }));

      const qty = Number((usd / price).toFixed(8));
      const existing = positions?.find((p) => p.coin_symbol === buyCoin);

      if (existing) {
        const newQty = Number(existing.quantity) + qty;
        const newInvested = Number(existing.invested_usd) + usd;
        const newAvg = newInvested / newQty;

        const { error: updateError } = await supabase
          .from("spot_positions")
          .update({
            quantity: newQty,
            invested_usd: newInvested,
            avg_buy_price: newAvg,
          })
          .eq("id", existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("spot_positions").insert({
          user_id: user!.id,
          coin_symbol: buyCoin,
          quantity: qty,
          invested_usd: usd,
          avg_buy_price: price,
        });
        if (insertError) throw insertError;
      }

      const { error: orderError } = await supabase.from("spot_orders").insert({
        user_id: user!.id,
        coin_symbol: buyCoin,
        order_type: "buy",
        quantity: qty,
        price_usd: price,
        total_usd: usd,
      });
      if (orderError) throw orderError;

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user!.id,
        type: "spot_buy",
        amount: usd,
        description: `Bought ${qty.toLocaleString()} ${buyCoin} @ $${price.toLocaleString()}`,
      });
      if (txError) throw txError;
    },
    onSuccess: () => {
      toast.success(t("dashboard.spot.buySuccess", { defaultValue: "Buy order executed" }));
      setBuyUsd("");
      queryClient.invalidateQueries({ queryKey: ["spot_positions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["spot_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sellMutation = useMutation({
    mutationFn: async () => {
      const qty = Number(sellQty);
      const position = positions?.find((p) => p.coin_symbol === sellCoin);
      const price = coinPrice[sellCoin];

      if (!position)
        throw new Error(t("dashboard.spot.errors.noHolding", { defaultValue: "No holding found for this coin" }));
      if (!qty || qty <= 0)
        throw new Error(t("dashboard.spot.errors.validQuantity", { defaultValue: "Enter a valid quantity" }));
      if (qty > Number(position.quantity))
        throw new Error(
          t("dashboard.spot.errors.exceedsHolding", { defaultValue: "Sell quantity exceeds your holding" }),
        );
      if (!price || price <= 0)
        throw new Error(
          t("dashboard.spot.errors.priceUnavailable", { defaultValue: "Live price is unavailable right now" }),
        );

      const proceeds = Number((qty * price).toFixed(2));
      const costBasis = Number((qty * Number(position.avg_buy_price)).toFixed(2));
      const realizedPnl = Number((proceeds - costBasis).toFixed(2));
      const remainingQty = Number(position.quantity) - qty;

      if (remainingQty <= 0.00000001) {
        const { error: deleteError } = await supabase.from("spot_positions").delete().eq("id", position.id);
        if (deleteError) throw deleteError;
      } else {
        const remainingInvested = Math.max(0, Number(position.invested_usd) - costBasis);
        const { error: updateError } = await supabase
          .from("spot_positions")
          .update({
            quantity: remainingQty,
            invested_usd: remainingInvested,
            avg_buy_price: remainingQty > 0 ? remainingInvested / remainingQty : 0,
          })
          .eq("id", position.id);
        if (updateError) throw updateError;
      }

      const { error: orderError } = await supabase.from("spot_orders").insert({
        user_id: user!.id,
        coin_symbol: sellCoin,
        order_type: "sell",
        quantity: qty,
        price_usd: price,
        total_usd: proceeds,
        realized_pnl: realizedPnl,
      });
      if (orderError) throw orderError;

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user!.id,
        type: "spot_sell",
        amount: proceeds,
        description: `Sold ${qty.toLocaleString()} ${sellCoin} @ $${price.toLocaleString()}`,
      });
      if (txError) throw txError;
    },
    onSuccess: () => {
      toast.success(t("dashboard.spot.sellSuccess", { defaultValue: "Sell order executed" }));
      setSellQty("");
      queryClient.invalidateQueries({ queryKey: ["spot_positions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["spot_orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const selectedSellPosition = positions?.find((p) => p.coin_symbol === sellCoin);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">
        {t("dashboard.spot.title", { defaultValue: "Spot Market" })}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {t("dashboard.spot.cashBalance", { defaultValue: "Cash Balance" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-section-dark-foreground">${balance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {t("dashboard.spot.holdingsValue", { defaultValue: "Holdings Value" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-section-dark-foreground">
              ${portfolio.totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {t("dashboard.spot.unrealizedPnl", { defaultValue: "Unrealized P/L" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-semibold ${portfolio.pnl >= 0 ? "text-primary" : "text-destructive"}`}>
              {portfolio.pnl >= 0 ? "+" : ""}${portfolio.pnl.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground">
              {t("dashboard.spot.buy", { defaultValue: "Buy" })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={buyCoin} onValueChange={(v) => setBuyCoin(v as Coin)}>
              <SelectTrigger className="bg-background/10 border-border/20 text-section-dark-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_COINS.map((coin) => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.spot.currentPrice", { defaultValue: "Current Price" })}: $
              {coinPrice[buyCoin]?.toLocaleString() ?? "—"}
            </p>
            <Input
              type="number"
              value={buyUsd}
              onChange={(e) => setBuyUsd(e.target.value)}
              placeholder={t("dashboard.spot.usdAmount", { defaultValue: "USD amount" })}
              className="bg-background/10 border-border/20 text-section-dark-foreground"
            />
            <Button onClick={() => buyMutation.mutate()} disabled={buyMutation.isPending}>
              {buyMutation.isPending ? t("common.loading") : t("dashboard.spot.buyNow", { defaultValue: "Buy Now" })}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground">
              {t("dashboard.spot.sell", { defaultValue: "Sell" })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={sellCoin} onValueChange={(v) => setSellCoin(v as Coin)}>
              <SelectTrigger className="bg-background/10 border-border/20 text-section-dark-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_COINS.map((coin) => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.spot.availableQty", { defaultValue: "Available Qty" })}:{" "}
              {Number(selectedSellPosition?.quantity ?? 0).toLocaleString()}
            </p>
            <Input
              type="number"
              value={sellQty}
              onChange={(e) => setSellQty(e.target.value)}
              placeholder={t("dashboard.spot.quantity", { defaultValue: "Coin quantity" })}
              className="bg-background/10 border-border/20 text-section-dark-foreground"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-border/20 text-section-dark-foreground"
                onClick={() => setSellQty(String(selectedSellPosition?.quantity ?? ""))}
              >
                {t("dashboard.spot.max", { defaultValue: "Max" })}
              </Button>
              <Button onClick={() => sellMutation.mutate()} disabled={sellMutation.isPending}>
                {sellMutation.isPending
                  ? t("common.loading")
                  : t("dashboard.spot.sellNow", { defaultValue: "Sell Now" })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground">
            {t("dashboard.spot.holdings", { defaultValue: "Your Holdings" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead>{t("dashboard.spot.spot", { defaultValue: "Spot" })}</TableHead>
                <TableHead>{t("dashboard.spot.quantity", { defaultValue: "Quantity" })}</TableHead>
                <TableHead>{t("dashboard.spot.avgPrice", { defaultValue: "Avg Buy Price" })}</TableHead>
                <TableHead>{t("dashboard.spot.currentValue", { defaultValue: "Current Value" })}</TableHead>
                <TableHead>{t("dashboard.spot.pnl", { defaultValue: "P/L" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions?.map((p) => {
                const value = Number(p.quantity) * (coinPrice[p.coin_symbol] ?? 0);
                const pnl = value - Number(p.invested_usd);
                return (
                  <TableRow key={p.id} className="border-border/10">
                    <TableCell className="text-section-dark-foreground font-medium">{p.coin_symbol}</TableCell>
                    <TableCell>{Number(p.quantity).toLocaleString()}</TableCell>
                    <TableCell>${Number(p.avg_buy_price).toLocaleString()}</TableCell>
                    <TableCell>${value.toLocaleString()}</TableCell>
                    <TableCell className={pnl >= 0 ? "text-primary" : "text-destructive"}>
                      {pnl >= 0 ? "+" : ""}${pnl.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!positions?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("dashboard.spot.noHoldings", { defaultValue: "No holdings yet" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground">
            {t("dashboard.spot.orders", { defaultValue: "Recent Spot Orders" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead>{t("dashboard.deposits.date")}</TableHead>
                <TableHead>{t("dashboard.spot.coin", { defaultValue: "Coin" })}</TableHead>
                <TableHead>{t("dashboard.spot.side", { defaultValue: "Side" })}</TableHead>
                <TableHead>{t("dashboard.spot.quantity", { defaultValue: "Quantity" })}</TableHead>
                <TableHead>{t("dashboard.spot.price", { defaultValue: "Price" })}</TableHead>
                <TableHead>{t("dashboard.spot.total", { defaultValue: "Total" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((o) => (
                <TableRow key={o.id} className="border-border/10">
                  <TableCell>{format(new Date(o.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{o.coin_symbol}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        o.order_type === "buy"
                          ? "text-primary border-primary/30"
                          : "text-destructive border-destructive/30"
                      }
                    >
                      {o.order_type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{Number(o.quantity).toLocaleString()}</TableCell>
                  <TableCell>${Number(o.price_usd).toLocaleString()}</TableCell>
                  <TableCell>${Number(o.total_usd).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {!orders?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("dashboard.spot.noOrders", { defaultValue: "No spot orders yet" })}
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
