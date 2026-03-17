import Header from "@/components/landing/Header";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { BarChart3, Shield, Smartphone, Layers, UserPlus, ClipboardList, Rocket, TrendingUp, Target, Heart } from "lucide-react";

const About = () => {
  const whyChoose = [
    { icon: ClipboardList, title: "Structured Investment Plans", desc: "Choose from multiple investment packages designed to suit different capital levels and investment goals." },
    { icon: BarChart3, title: "Market Trend Strategy", desc: "Our system follows market movements across crypto and stocks to guide investment positioning." },
    { icon: Shield, title: "Secure Platform", desc: "Your account and investment activity are protected with secure systems and account management tools." },
    { icon: Smartphone, title: "Simple and Accessible", desc: "Our platform is designed to make investing straightforward, allowing anyone to participate in modern financial markets." },
    { icon: Layers, title: "Portfolio Diversification", desc: "Gain exposure to both cryptocurrency and stock market opportunities through one platform." },
  ];

  const steps = [
    { icon: UserPlus, step: "1", title: "Create Your Account", desc: "Sign up on HarborForge and set up your secure investor account." },
    { icon: ClipboardList, step: "2", title: "Choose an Investment Plan", desc: "Select the investment package that best fits your financial goals." },
    { icon: Rocket, step: "3", title: "Start Investing", desc: "Fund your account and activate your investment plan." },
    { icon: TrendingUp, step: "4", title: "Earn Returns", desc: "Track your investment growth and returns directly from your dashboard." },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
              About <span className="text-primary">HarborForge</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium mb-4">
              A Modern Platform for Smarter Investing
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Description */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              HarborForge is an innovative investment platform designed to give individuals access to opportunities within the global cryptocurrency and stock markets.
            </p>
            <p>
              Our platform follows market trends across major assets such as Bitcoin and leading stocks, allowing investors to participate in the growth of these markets through structured investment packages.
            </p>
            <p>
              By combining market analysis, strategic allocation, and structured plans, HarborForge provides investors with a simple way to participate in markets that traditionally require significant expertise.
            </p>
            <p>
              Whether you are new to investing or an experienced investor, HarborForge offers flexible plans that can align with your financial goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose HarborForge */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Advantages</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">Why Choose HarborForge</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Getting Started</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">How It Works</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center p-6 rounded-2xl hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 relative">
                  <s.icon size={28} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Target size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Our mission is to make modern investing more accessible by providing individuals with a structured platform to participate in high-growth financial markets.
              </p>
              <p>
                HarborForge aims to empower investors with opportunities to grow their capital while maintaining a simple and transparent investment experience.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default About;
