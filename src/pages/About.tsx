import Header from "@/components/landing/Header";
import AboutSection from "@/components/landing/AboutSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { TrendingUp, Globe, Users, Target, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "$2.5B+", label: t("about.assetsManaged") },
    { value: "150K+", label: t("about.activeInvestors") },
    { value: "45+", label: t("about.countriesServed") },
    { value: "99.9%", label: t("about.uptimeGuarantee") },
  ];

  const values = [
    { icon: Target, title: t("about.ourMission"), desc: t("about.missionDesc") },
    { icon: Globe, title: t("about.globalReach"), desc: t("about.globalReachDesc") },
    { icon: Users, title: t("about.communityFirst"), desc: t("about.communityDesc") },
    { icon: TrendingUp, title: t("about.innovationDriven"), desc: t("about.innovationDesc") },
  ];

  const milestoneYears = ["2018", "2019", "2020", "2021", "2023", "2024"] as const;

  const compliance = [
    "KYC/AML Compliant",
    "SOC 2 Type II Certified",
    "256-bit SSL Encryption",
    "Cold Storage Custody",
    "Regular Security Audits",
    "GDPR Data Protection",
  ];

  return (
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
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("about.pageLabel")}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
              {t("about.pageTitle")} <span className="text-primary">{t("about.pageTitleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              {t("about.pageDescription")}
            </p>
          </motion.div>

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
              <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("about.ourStory")}</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-6">
                {t("about.storyTitle")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.storyP1")}</p>
                <p>{t("about.storyP2")}</p>
                <p>{t("about.storyP3")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {milestoneYears.map((year, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-16 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{year}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed pt-1.5">{t(`about.milestones.${year}`)}</p>
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
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("about.whatDrivesUs")}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
              {t("about.coreValues")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.coreValuesDesc")}
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
                  {t("about.regulatedCompliant")}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t("about.regulatedDesc")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compliance.map((item) => (
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
};

export default About;
