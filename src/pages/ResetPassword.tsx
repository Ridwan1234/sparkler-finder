import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: t("auth.error"), description: t("auth.passwordsNoMatch"), variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: t("auth.error"), description: t("auth.passwordMinLength"), variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: t("auth.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("auth.passwordUpdated"), description: t("auth.passwordUpdatedDesc") });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen section-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card/5 border border-border/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-1">{t("auth.setNewPassword")}</h1>
          <p className="text-muted-foreground text-sm mb-8">{t("auth.newPasswordDesc")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-section-dark-foreground/80">{t("auth.newPassword")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.newPasswordPlaceholder")}
                  required
                  className="bg-section-dark border-border/20 text-section-dark-foreground placeholder:text-muted-foreground/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-section-dark-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-section-dark-foreground/80">{t("auth.confirmNewPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("auth.confirmNewPlaceholder")}
                required
                className="bg-section-dark border-border/20 text-section-dark-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.updating") : t("auth.updatePassword")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline font-medium">{t("auth.backToLogin")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
