import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const update = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim(), phone: phone.trim() })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("dashboard.profile.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error(t("dashboard.profile.updateFailed")),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        {t("dashboard.profile.title")}
      </h1>

      <Card className="bg-card/5 border-border/10 max-w-lg">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground text-lg">{t("dashboard.profile.personalInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.email")}</label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-background/5 border-border/20 text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.fullName")}</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background/10 border-border/20 text-section-dark-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.phone")}</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background/10 border-border/20 text-section-dark-foreground"
            />
          </div>
          <Button onClick={() => update.mutate()} disabled={update.isPending}>
            {t("dashboard.profile.saveChanges")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
