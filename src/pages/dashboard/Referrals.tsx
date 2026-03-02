import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users } from "lucide-react";
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

      <div className="grid gap-6 max-w-lg">
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> {t("dashboard.referrals.yourLink")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("dashboard.referrals.shareDesc")}
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
      </div>
    </div>
  );
}
