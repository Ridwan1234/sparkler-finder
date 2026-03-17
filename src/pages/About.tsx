import Header from "@/components/landing/Header";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { BarChart3, Shield, Smartphone, Layers, ClipboardList, UserPlus, Rocket, TrendingUp, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const whyChoose = [
    { icon: ClipboardList, title: t("aboutPage.whyStructuredTitle"), desc: t("aboutPage.whyStructuredDesc") },
    { icon: BarChart3, title: t("aboutPage.whyMarketTitle"), desc: t("aboutPage.whyMarketDesc") },
    { icon: Shield, title: t("aboutPage.whySecureTitle"), desc: t("aboutPage.whySecureDesc") },
    { icon: Smartphone, title: t("aboutPage.whySimpleTitle"), desc: t("aboutPage.whySimpleDesc") },
    { icon: Layers, title: t("aboutPage.whyDiversifyTitle"), desc: t("aboutPage.whyDiversifyDesc") },
  ];

  const steps = [
    { icon: UserPlus, step: "1", title: t("aboutPage.step1Title"), desc: t("aboutPage.step1Desc") },
    { icon: ClipboardList, step: "2", title: t("aboutPage.step2Title"), desc: t("aboutPage.step2Desc") },
    { icon: Rocket, step: "3", title: t("aboutPage.step3Title"), desc: t("aboutPage.step3Desc") },
    { icon: TrendingUp, step: "4", title: t("aboutPage.step4Title"), desc: t("aboutPage.step4Desc") },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("aboutPage.label")}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
              {t("aboutPage.title")} <span className="text-primary">{t("aboutPage.titleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium mb-4">
              {t("aboutPage.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Description */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>{t("aboutPage.desc1")}</p>
            <p>{t("aboutPage.desc2")}</p>
            <p>{t("aboutPage.desc3")}</p>
            <p>{t("aboutPage.desc4")}</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose HarborForge */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("aboutPage.whyLabel")}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("aboutPage.whyTitle")}</h2>
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
            <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("aboutPage.howLabel")}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("aboutPage.howTitle")}</h2>
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
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{t("aboutPage.missionTitle")}</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>{t("aboutPage.missionP1")}</p>
              <p>{t("aboutPage.missionP2")}</p>
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
