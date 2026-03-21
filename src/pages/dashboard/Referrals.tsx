import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users, DollarSign, Percent, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Referrals() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: referralBonuses } = useQuery({
    queryKey: ["referral_bonuses", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("amount, created_at, description")
        .eq("user_id", user!.id)
        .eq("type", "referral_bonus")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: bonusPercent } = useQuery({
    queryKey: ["referral_bonus_percent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "referral_bonus_percent")
        .single();
      return data?.value ?? "5";
    },
  });

  const { data: referredCount } = useQuery({
    queryKey: ["referred_count", profile?.referral_code],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("referred_by", profile!.referral_code!);
      return count ?? 0;
    },
    enabled: !!profile?.referral_code,
  });

  const totalEarned = referralBonuses?.reduce((s, b) => s + Number(b.amount), 0) ?? 0;

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/signup?ref=${profile.referral_code}`
    : "";

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success(t("dashboard.referrals.linkCopied"));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        {t("dashboard.referrals.title")}
      </h1>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-card/5 border-border/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("dashboard.referrals.totalEarned")}</p>
              <p className="text-lg font-bold text-section-dark-foreground">${totalEarned.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("dashboard.referrals.referredUsers")}</p>
              <p className="text-lg font-bold text-section-dark-foreground">{referredCount ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("dashboard.referrals.bonusRate")}</p>
              <p className="text-lg font-bold text-section-dark-foreground">{bonusPercent}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Referral link */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> {t("dashboard.referrals.yourLink")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("dashboard.referrals.shareDesc", { percent: bonusPercent })}
            </p>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-background/10 border-border/20 text-section-dark-foreground font-mono text-xs"
              />
              <Button size="icon" variant="outline" onClick={copy} className="border-border/20 text-section-dark-foreground shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.referrals.yourCode")}: <span className="text-primary font-mono font-semibold">{profile?.referral_code}</span>
            </p>
          </CardContent>
        </Card>

        {/* Bonus history */}
        {referralBonuses && referralBonuses.length > 0 && (
          <Card className="bg-card/5 border-border/10">
            <CardHeader>
              <CardTitle className="text-section-dark-foreground text-lg">
                {t("dashboard.referrals.bonusHistory")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referralBonuses.map((b, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                    <div>
                      <p className="text-sm text-section-dark-foreground">{b.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-500">+${Number(b.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
