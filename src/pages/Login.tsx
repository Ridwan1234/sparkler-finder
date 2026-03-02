import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({ title: t("auth.loginFailed"), description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen section-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> {t("auth.backToHome")}
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-card/5 border border-border/10 rounded-2xl p-8 backdrop-blur-sm"
          whileHover={{ borderColor: "hsl(152, 87%, 30%, 0.2)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-2">
            <motion.div
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-primary-foreground font-display font-bold text-lg">C</span>
            </motion.div>
            <span className="font-display font-bold text-xl text-section-dark-foreground">CoinStamp</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-display text-2xl font-bold text-section-dark-foreground mt-6 mb-1">
            {t("auth.welcomeBack")}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-8">
            {t("auth.signInDesc")}
          </motion.p>

          <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="text-section-dark-foreground/80">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                required
                className="bg-section-dark border-border/20 text-section-dark-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/40 focus:shadow-[0_0_15px_hsl(152,87%,30%,0.1)]"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-section-dark-foreground/80">{t("auth.password")}</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("auth.forgotPassword")}</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  required
                  className="bg-section-dark border-border/20 text-section-dark-foreground placeholder:text-muted-foreground/50 pr-10 transition-all focus:border-primary/40 focus:shadow-[0_0_15px_hsl(152,87%,30%,0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-section-dark-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full relative overflow-hidden group" disabled={loading}>
                <span className="relative z-10">{loading ? t("auth.signingIn") : t("auth.signIn")}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Button>
            </motion.div>
          </motion.form>

          <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">{t("auth.signUp")}</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
