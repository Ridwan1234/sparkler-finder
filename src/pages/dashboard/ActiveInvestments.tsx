import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Completed";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function ActiveInvestments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const now = useCountdown();
  const queryClient = useQueryClient();
  const prevCompletedIds = useRef<Set<string>>(new Set());

  const { data: investments, isLoading } = useQuery({
    queryKey: ["active_investments", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("*, investment_plans(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const active = investments?.filter((i) => i.status === "active") ?? [];
  const completed = investments?.filter((i) => i.status === "completed") ?? [];

  useEffect(() => {
    if (!completed.length) return;
    const currentIds = new Set(completed.map((c) => c.id));
    if (prevCompletedIds.current.size > 0) {
      for (const inv of completed) {
        if (!prevCompletedIds.current.has(inv.id)) {
          const plan = inv.investment_plans;
          const roi = plan ? Number((inv.amount * plan.roi_percentage / 100).toFixed(2)) : 0;
          toast.success(`🎉 ${t("dashboard.investments.investmentCompleted")}`, {
            description: `${plan?.name ?? ""} — $${Number(inv.amount).toLocaleString()} → +$${roi.toLocaleString()}`,
            duration: 8000,
          });
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["deposits"] });
        }
      }
    }
    prevCompletedIds.current = currentIds;
  }, [completed, queryClient, t]);

  if (isLoading) return <div className="text-section-dark-foreground">{t("common.loading")}</div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        {t("dashboard.investments.title")}
      </h1>

      {active.length === 0 && completed.length === 0 && (
        <Card className="bg-card/5 border-border/10">
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("dashboard.investments.noInvestments")}
          </CardContent>
        </Card>
      )}

      {active.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-section-dark-foreground mb-4 flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" /> {t("dashboard.investments.active")} ({active.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {active.map((inv) => {
              const plan = inv.investment_plans;
              const startMs = new Date(inv.started_at).getTime();
              const endMs = new Date(inv.expires_at).getTime();
              const validDates = !isNaN(startMs) && !isNaN(endMs);
              const totalDuration = validDates ? endMs - startMs : 1;
              const elapsed = validDates ? now - startMs : 0;
              const remaining = validDates ? Math.max(0, endMs - now) : 0;
              const progress = validDates
                ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
                : 0;
              const totalROI = plan
                ? Number((inv.amount * plan.roi_percentage / 100).toFixed(2))
                : 0;
              const freqDays = (plan as any)?.roi_frequency_days ?? 1;
              const totalPeriods = plan ? Math.floor(plan.duration_days / freqDays) : 1;
              const periodROI = plan
                ? Number((inv.amount * plan.roi_percentage / 100 / totalPeriods).toFixed(2))
                : 0;
              const daysElapsed = validDates
                ? Math.min(Math.floor(elapsed / (24 * 60 * 60 * 1000)), plan?.duration_days ?? 0)
                : 0;
              const periodsElapsed = Math.min(Math.floor(daysElapsed / freqDays), totalPeriods);
              const earnedSoFar = Number((periodROI * periodsElapsed).toFixed(2));

              return (
                <Card key={inv.id} className="bg-card/5 border-primary/20 border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-section-dark-foreground">
                        {plan?.name ?? "Unknown Plan"}
                      </span>
                      <Badge className="bg-primary/20 text-primary border-primary/30" variant="outline">
                        {t("dashboard.investments.active")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.invested")}</p>
                        <p className="font-semibold text-section-dark-foreground flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {Number(inv.amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.roiPer")} {freqDays === 1 ? t("dashboard.investments.day") : `${freqDays}d`}</p>
                        <p className="font-semibold text-gold flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          ${periodROI.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.earnedSoFar")}</p>
                        <p className="font-semibold text-primary">
                          ${earnedSoFar.toLocaleString()} / ${totalROI.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.duration")}</p>
                        <p className="font-semibold text-section-dark-foreground">
                          {t("dashboard.investments.day")} {daysElapsed} / {plan?.duration_days ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t("dashboard.investments.progress")}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">{t("dashboard.investments.timeRemaining")}</p>
                      <p className="text-lg font-bold text-primary font-mono">
                        {formatTimeLeft(remaining)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-section-dark-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" /> {t("dashboard.investments.completed")} ({completed.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((inv) => {
              const plan = inv.investment_plans;
              const earnedROI = plan
                ? Number((inv.amount * plan.roi_percentage / 100).toFixed(2))
                : 0;

              return (
                <Card key={inv.id} className="bg-card/5 border-border/10">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-section-dark-foreground">
                        {plan?.name ?? "Unknown Plan"}
                      </span>
                      <Badge className="bg-gold/20 text-gold border-gold/30" variant="outline">
                        {t("dashboard.investments.completed")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.invested")}</p>
                        <p className="font-semibold text-section-dark-foreground">
                          ${Number(inv.amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("dashboard.investments.roiEarned")}</p>
                        <p className="font-semibold text-gold">
                          +${earnedROI.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
