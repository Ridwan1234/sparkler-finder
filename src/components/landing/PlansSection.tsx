import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PlansSection = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["investment_plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investment_plans")
        .select("*")
        .order("min_amount", { ascending: true });
      return data ?? [];
    },
  });

  const { data: bonusSetting } = useQuery({
    queryKey: ["site_settings", "first_deposit_bonus_percent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "first_deposit_bonus_percent")
        .maybeSingle();
      return data?.value ?? null;
    },
  });

  const bonusPercent = bonusSetting ? Number(bonusSetting) : null;

  return (
    <section id="plans" className="py-20 lg:py-28 section-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Investment Plans</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-section-dark-foreground/60 max-w-2xl mx-auto">
            Flexible plans designed to suit every investor, from beginners to high-net-worth individuals.
          </p>
          {bonusPercent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-6 inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
                <Gift size={16} />
              </motion.div>
              {bonusPercent}% First Deposit Bonus for New Investors!
            </motion.div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl bg-section-dark-foreground/5" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans?.map((plan, i) => {
              const features: string[] = (plan as any).features ?? [];
              const isPopular = (plan as any).is_popular ?? false;

              return (
                <motion.div
                  key={plan.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`relative rounded-2xl p-6 border transition-all cursor-default ${
                    isPopular
                      ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10"
                      : "glass-card hover:border-primary/20"
                  }`}
                >
                  {isPopular && (
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.3 + i * 0.1 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1"
                    >
                      <Star size={12} /> POPULAR
                    </motion.div>
                  )}
                  <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-display font-bold text-primary">
                      {Number(plan.roi_percentage)}%
                    </span>
                    <span className="text-section-dark-foreground/50 text-sm">/ {plan.roi_frequency_days === 7 ? "Week" : plan.roi_frequency_days === 1 || !plan.roi_frequency_days ? "Day" : `${plan.roi_frequency_days} Days`}</span>
                  </div>
                  <div className="space-y-2 text-sm text-section-dark-foreground/60 mb-6">
                    <p>Min: <span className="text-section-dark-foreground font-medium">${Number(plan.min_amount).toLocaleString()}</span></p>
                    <p>Max: <span className="text-section-dark-foreground font-medium">${Number(plan.max_amount).toLocaleString()}</span></p>
                    <p>Duration: <span className="text-section-dark-foreground font-medium">{plan.duration_days} Days</span></p>
                    <p>Payouts: <span className="text-section-dark-foreground font-medium">{plan.roi_frequency_days === 7 ? "Weekly" : plan.roi_frequency_days === 1 || !plan.roi_frequency_days ? "Daily" : `Every ${plan.roi_frequency_days} days`}</span></p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-section-dark-foreground/70">
                        <Check size={14} className="text-primary flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        className={`w-full ${
                          isPopular ? "bg-primary hover:bg-primary/90" : "bg-section-dark-foreground/10 hover:bg-primary/20 text-section-dark-foreground"
                        }`}
                      >
                        Invest Now
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PlansSection;
