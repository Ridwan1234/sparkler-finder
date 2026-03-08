import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import PlansSection from "@/components/landing/PlansSection";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Clock, BadgeDollarSign } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Deposit Funds",
    description: "Fund your account by depositing cryptocurrency to one of our secure wallet addresses. Your deposit is verified and credited to your balance.",
  },
  {
    icon: BadgeDollarSign,
    title: "Choose a Plan",
    description: "Select an investment plan that matches your goals. Each plan has a fixed duration, ROI percentage, and payout frequency.",
  },
  {
    icon: TrendingUp,
    title: "Earn Returns",
    description: "Your investment generates returns at the plan's payout frequency (daily, weekly, etc.). ROI is calculated on your invested amount and credited automatically.",
  },
  {
    icon: Clock,
    title: "Maturity & Principal",
    description: "When your investment reaches its duration, your initial principal is returned to your available balance. You can reinvest or withdraw at any time.",
  },
];

const PlansPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("plans.pageLabel")}
        title={t("plans.pageTitle")}
        highlight={t("plans.pageHighlight")}
        description={t("plans.pageDescription")}
      />

      {/* How It Works */}
      <section className="py-20 section-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
              Your Investment Journey
            </h2>
            <p className="text-section-dark-foreground/60 max-w-2xl mx-auto">
              From deposit to returns — here's exactly how your money grows on our platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative glass-card rounded-2xl p-6 text-center group hover:border-primary/20 transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-section-dark-foreground/60 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* ROI Example */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-14 max-w-3xl mx-auto glass-card rounded-2xl p-8"
          >
            <h3 className="font-display font-bold text-xl mb-4 text-center">Example: How Returns Are Calculated</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3 text-section-dark-foreground/70">
                <p><span className="text-section-dark-foreground font-medium">Investment:</span> $5,000</p>
                <p><span className="text-section-dark-foreground font-medium">Plan:</span> Golden (9.7% ROI)</p>
                <p><span className="text-section-dark-foreground font-medium">Duration:</span> 30 days</p>
                <p><span className="text-section-dark-foreground font-medium">Payout Frequency:</span> Daily</p>
              </div>
              <div className="space-y-3 text-section-dark-foreground/70">
                <p><span className="text-section-dark-foreground font-medium">Daily Return:</span> $5,000 × 9.7% ÷ 30 = <span className="text-primary font-semibold">$16.17/day</span></p>
                <p><span className="text-section-dark-foreground font-medium">Total ROI:</span> $16.17 × 30 = <span className="text-primary font-semibold">$485.00</span></p>
                <p><span className="text-section-dark-foreground font-medium">At Maturity:</span> Principal ($5,000) returned to balance</p>
                <p><span className="text-section-dark-foreground font-medium">Total Earned:</span> <span className="text-gold font-bold">$5,485.00</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PlansSection />
      <Footer />
    </div>
  );
};

export default PlansPage;
