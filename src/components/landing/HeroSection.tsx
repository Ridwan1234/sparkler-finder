import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Total Invested", value: "$120M+", icon: TrendingUp },
  { label: "Secure Transactions", value: "99.9%", icon: Shield },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const HeroSection = () => {
  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-gold blur-[100px]"
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          style={{ top: `${20 + i * 15}%`, left: `${10 + i * 18}%` }}
          animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6"
            >
              #1 Trusted Investment Platform
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-section-dark-foreground leading-tight mb-6"
            >
              Smart Solution For{" "}
              <span className="gradient-text">Business</span>{" "}
              Investment
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-section-dark-foreground/60 mb-8 max-w-lg"
            >
              Invest in crypto, forex, stocks, real estate and more with our secure, transparent, and high-yield investment platform trusted by thousands worldwide.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base px-8 shimmer-bg animate-shimmer">
                    Get Started <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="border-section-dark-foreground/20 text-section-dark-foreground hover:bg-section-dark-foreground/10 text-base px-8">
                    Login
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="flex flex-wrap gap-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.08 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <stat.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-display font-bold text-section-dark-foreground">{stat.value}</p>
                    <p className="text-xs text-section-dark-foreground/50">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-80 h-80">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-dashed border-primary/15"
              />
              <motion.div
                className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-center">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrendingUp size={64} className="text-primary mx-auto mb-4" />
                  </motion.div>
                  <p className="text-2xl font-display font-bold text-section-dark-foreground">Grow Your</p>
                  <p className="text-2xl font-display font-bold gradient-text">Wealth</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
