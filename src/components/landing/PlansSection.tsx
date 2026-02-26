import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Standard",
    roi: "3.5%",
    period: "Weekly",
    min: "$100",
    max: "$4,999",
    duration: "30 Days",
    features: ["Daily Compounding", "24/7 Support", "Instant Withdrawal"],
    popular: false,
  },
  {
    name: "Silver",
    roi: "5%",
    period: "Weekly",
    min: "$5,000",
    max: "$24,999",
    duration: "45 Days",
    features: ["Daily Compounding", "Priority Support", "Instant Withdrawal", "Referral Bonus"],
    popular: false,
  },
  {
    name: "Golden",
    roi: "8%",
    period: "Weekly",
    min: "$25,000",
    max: "$99,999",
    duration: "60 Days",
    features: ["Daily Compounding", "VIP Support", "Instant Withdrawal", "Referral Bonus", "Dedicated Manager"],
    popular: true,
  },
  {
    name: "Diamond",
    roi: "12%",
    period: "Weekly",
    min: "$100,000",
    max: "Unlimited",
    duration: "90 Days",
    features: ["Daily Compounding", "VIP Support", "Priority Withdrawal", "Referral Bonus", "Dedicated Manager", "Custom Strategy"],
    popular: false,
  },
];

const PlansSection = () => {
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
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 border transition-all ${
                plan.popular
                  ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10"
                  : "bg-section-dark-foreground/5 border-section-dark-foreground/10 hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} /> POPULAR
                </div>
              )}
              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-display font-bold text-primary">{plan.roi}</span>
                <span className="text-section-dark-foreground/50 text-sm">/ {plan.period}</span>
              </div>
              <div className="space-y-2 text-sm text-section-dark-foreground/60 mb-6">
                <p>Min: <span className="text-section-dark-foreground font-medium">{plan.min}</span></p>
                <p>Max: <span className="text-section-dark-foreground font-medium">{plan.max}</span></p>
                <p>Duration: <span className="text-section-dark-foreground font-medium">{plan.duration}</span></p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-section-dark-foreground/70">
                    <Check size={14} className="text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  className={`w-full ${
                    plan.popular ? "bg-primary hover:bg-primary/90" : "bg-section-dark-foreground/10 hover:bg-primary/20 text-section-dark-foreground"
                  }`}
                >
                  Invest Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
