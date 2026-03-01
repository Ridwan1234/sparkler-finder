import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCryptoTicker } from "@/hooks/useCryptoPrices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PriceAlert {
  id: string;
  coin: string;
  target_price: number;
  direction: string;
  is_triggered: boolean;
}

const COIN_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
};

/**
 * Global hook that polls live prices and triggers in-app notifications
 * for any untriggered price alerts. Mount once in DashboardLayout.
 */
export function usePriceAlertChecker() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: ticker } = useCryptoTicker();

  const { data: alerts } = useQuery({
    queryKey: ["price_alerts_global", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("is_triggered", false);
      if (error) throw error;
      return (data ?? []) as PriceAlert[];
    },
    enabled: !!user,
    refetchInterval: 60_000, // Re-check every minute
  });

  useEffect(() => {
    if (!ticker || !alerts || alerts.length === 0) return;

    alerts.forEach((alert) => {
      const t = ticker.find((x) => x.id === COIN_MAP[alert.coin]);
      if (!t) return;

      const triggered =
        (alert.direction === "above" && t.current_price >= alert.target_price) ||
        (alert.direction === "below" && t.current_price <= alert.target_price);

      if (triggered) {
        supabase
          .from("price_alerts")
          .update({ is_triggered: true, triggered_at: new Date().toISOString() })
          .eq("id", alert.id)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["price_alerts"] });
            queryClient.invalidateQueries({ queryKey: ["price_alerts_global"] });
          });

        toast.success(
          `🔔 ${alert.coin} is now ${alert.direction} $${alert.target_price.toLocaleString()}! Current: $${t.current_price.toLocaleString()}`,
          { duration: 10000 }
        );
      }
    });
  }, [ticker, alerts, queryClient]);
}
