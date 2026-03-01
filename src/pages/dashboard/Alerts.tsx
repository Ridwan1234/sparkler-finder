import PriceAlerts from "@/components/dashboard/PriceAlerts";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">
        Price Alerts
      </h1>
      <p className="text-muted-foreground text-sm">
        Set price thresholds for BTC, ETH, and BNB. You'll receive in-app notifications when prices cross your targets.
      </p>
      <PriceAlerts />
    </div>
  );
}
