import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Total Invested", value: "$120M+", icon: TrendingUp },
  { label: "Secure Transactions", value: "99.9%", icon: Shield },
];

const HeroSection = () => {
  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-gold blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              #1 Trusted Investment Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-section-dark-foreground leading-tight mb-6">
              Smart Solution For{" "}
              <span className="text-primary">Business</span>{" "}
              Investment
            </h1>
            <p className="text-lg text-section-dark-foreground/60 mb-8 max-w-lg">
              Invest in crypto, forex, stocks, real estate and more with our secure, transparent, and high-yield investment platform trusted by thousands worldwide.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base px-8">
                  Get Started <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-section-dark-foreground/20 text-section-dark-foreground hover:bg-section-dark-foreground/10 text-base px-8">
                  Login
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <stat.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-display font-bold text-section-dark-foreground">{stat.value}</p>
                    <p className="text-xs text-section-dark-foreground/50">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <TrendingUp size={64} className="text-primary mx-auto mb-4" />
                  <p className="text-2xl font-display font-bold text-section-dark-foreground">Grow Your</p>
                  <p className="text-2xl font-display font-bold text-primary">Wealth</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
