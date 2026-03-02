import PriceAlerts from "@/components/dashboard/PriceAlerts";
import { useTranslation } from "react-i18next";

export default function AlertsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">
        {t("dashboard.alerts.title")}
      </h1>
      <p className="text-muted-foreground text-sm">
        {t("dashboard.alerts.description")}
      </p>
      <PriceAlerts />
    </div>
  );
}
