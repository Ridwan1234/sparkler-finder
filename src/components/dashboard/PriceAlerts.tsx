import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCryptoTicker } from "@/hooks/useCryptoPrices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, BellRing, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface PriceAlert {
  id: string;
  coin: string;
  target_price: number;
  direction: string;
  is_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

export default function PriceAlerts() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: ticker } = useCryptoTicker();

  const [coin, setCoin] = useState("BTC");
  const [direction, setDirection] = useState("above");
  const [targetPrice, setTargetPrice] = useState("");

  // Fetch alerts
  const { data: alerts } = useQuery({
    queryKey: ["price_alerts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PriceAlert[];
    },
    enabled: !!user,
  });

  // Create alert
  const createAlert = useMutation({
    mutationFn: async () => {
      const price = parseFloat(targetPrice);
      if (isNaN(price) || price <= 0) throw new Error(t("dashboard.alerts.invalidPrice"));
      const { error } = await supabase.from("price_alerts").insert({
        user_id: user!.id,
        coin,
        target_price: price,
        direction,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
      setTargetPrice("");
      toast.success(t("dashboard.alerts.alertCreated"));
    },
    onError: (e) => toast.error(e.message),
  });

  // Delete alert
  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("price_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
      toast.success(t("dashboard.alerts.alertRemoved"));
    },
  });

  // Alert checking is now handled globally by usePriceAlertChecker in DashboardLayout

  const COIN_MAP: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum", BNB: "binancecoin" };

  return (
    <Card className="bg-card/5 border-border/10">
      <CardHeader>
        <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-gold" /> {t("dashboard.alerts.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create form */}
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("dashboard.alerts.coin")}</label>
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger className="w-24 h-9 bg-background/10 border-border/20 text-section-dark-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BNB">BNB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("dashboard.alerts.direction")}</label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="w-28 h-9 bg-background/10 border-border/20 text-section-dark-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">{t("dashboard.alerts.above")} ↑</SelectItem>
                <SelectItem value="below">{t("dashboard.alerts.below")} ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 flex-1 min-w-[120px]">
            <label className="text-xs text-muted-foreground">{t("dashboard.alerts.targetPrice")}</label>
            <Input
              type="number"
              placeholder={t("dashboard.alerts.targetPricePlaceholder")}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="h-9 bg-background/10 border-border/20 text-section-dark-foreground"
            />
          </div>
          <Button
            size="sm"
            onClick={() => createAlert.mutate()}
            disabled={!targetPrice || createAlert.isPending}
            className="gap-1 h-9"
          >
            <Plus className="h-3.5 w-3.5" /> {t("dashboard.alerts.add")}
          </Button>
        </div>

        {/* Current price hint */}
        {ticker && (
          <p className="text-xs text-muted-foreground">
            {t("dashboard.alerts.currentPrice", { coin })}: ${ticker.find((tickerItem) => tickerItem.id === COIN_MAP[coin])?.current_price.toLocaleString() ?? "—"}
          </p>
        )}

        {/* Alerts list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts && alerts.length > 0 ? (
            alerts.map((a) => (
              <div
                key={a.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  a.is_triggered
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background/5 border-border/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {a.is_triggered ? (
                    <BellRing className="h-4 w-4 text-primary" />
                  ) : (
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-section-dark-foreground text-sm">{a.coin}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          a.direction === "above"
                            ? "text-primary border-primary/30"
                            : "text-destructive border-destructive/30"
                        }`}
                      >
                        {a.direction === "above" ? (
                          <TrendingUp className="h-2.5 w-2.5 mr-1" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5 mr-1" />
                        )}
                        {a.direction === "above" ? t("dashboard.alerts.above") : t("dashboard.alerts.below")}
                      </Badge>
                      <span className="text-sm text-section-dark-foreground">
                        ${a.target_price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {a.is_triggered ? t("dashboard.alerts.triggered") : t("dashboard.alerts.watching")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteAlert.mutate(a.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("dashboard.alerts.noAlerts")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.alerts.createHint")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
