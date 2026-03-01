import Header from "@/components/landing/Header";
import AboutSection from "@/components/landing/AboutSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { TrendingUp, Globe, Users, Target, CheckCircle } from "lucide-react";

const stats = [
  { value: "$2.5B+", label: "Assets Managed" },
  { value: "150K+", label: "Active Investors" },
  { value: "45+", label: "Countries Served" },
  { value: "99.9%", label: "Uptime Guarantee" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To democratize access to world-class investment opportunities by providing a secure, transparent, and intuitive platform that empowers individuals to build lasting wealth across multiple asset classes.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Operating across 45+ countries, CoinStamp bridges the gap between traditional finance and the digital economy — giving every investor access to diversified portfolios regardless of location.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "We believe investing is better together. Our community-driven approach includes educational resources, expert webinars, and peer-to-peer insights to help you make confident decisions.",
  },
  {
    icon: TrendingUp,
    title: "Innovation Driven",
    desc: "From AI-powered market analytics to fractional real estate investing, we continuously innovate to bring cutting-edge tools and opportunities to our growing investor base.",
  },
];

const milestones = [
  { year: "2018", event: "CoinStamp founded with a vision to simplify multi-asset investing." },
  { year: "2019", event: "Launched cryptocurrency and forex trading with institutional-grade infrastructure." },
  { year: "2020", event: "Surpassed 50,000 registered users and expanded to 20+ countries." },
  { year: "2021", event: "Introduced fractional real estate and stock investment plans." },
  { year: "2023", event: "Reached $2B+ in total assets under management." },
  { year: "2024", event: "Launched AI-powered analytics and price alert systems." },
];

const About = () => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />

    {/* Hero Banner */}
    <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">About CoinStamp</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
            Building the Future of <span className="text-primary">Multi-Asset Investing</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Since 2018, CoinStamp has been at the forefront of financial innovation — providing individuals and institutions with secure, transparent, and diversified investment solutions across cryptocurrency, forex, stocks, real estate, and more.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-4xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-6">
              <p className="text-3xl font-display font-bold text-primary">{s.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Our Story */}
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-6">
              From Vision to Global Platform
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                CoinStamp was born out of a simple yet powerful idea: that everyone deserves access to the same wealth-building tools previously reserved for institutional investors and high-net-worth individuals.
              </p>
              <p>
                What started as a small team of fintech enthusiasts has grown into a trusted global platform serving over 150,000 investors across 45+ countries. Our proprietary technology combines real-time market analytics, risk management algorithms, and automated portfolio optimization to deliver consistent returns.
              </p>
              <p>
                We are regulated, audited, and committed to the highest standards of compliance and data protection. Every dollar invested on our platform is safeguarded by bank-grade encryption, cold storage solutions, and multi-signature authentication protocols.
              </p>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-16 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{m.year}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pt-1.5">{m.event}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Values / Pillars */}
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">What Drives Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Our Core Values
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every decision we make is guided by a commitment to transparency, innovation, and the financial success of our investors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <v.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Compliance Banner */}
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-10 md:p-14"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Regulated & Compliant
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                CoinStamp adheres to international regulatory standards and undergoes regular third-party audits to ensure the safety and integrity of your investments.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "KYC/AML Compliant",
                "SOC 2 Type II Certified",
                "256-bit SSL Encryption",
                "Cold Storage Custody",
                "Regular Security Audits",
                "GDPR Data Protection",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <AboutSection />
    <WhyChooseUs />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default About;
