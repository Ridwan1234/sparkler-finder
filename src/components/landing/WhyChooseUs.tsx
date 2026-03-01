import { motion } from "framer-motion";
import { BarChart2, Headphones, ShieldCheck, Percent } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    { icon: BarChart2, title: t("whyChooseUs.realTimeData"), desc: t("whyChooseUs.realTimeDesc") },
    { icon: Headphones, title: t("whyChooseUs.support247"), desc: t("whyChooseUs.supportDesc") },
    { icon: ShieldCheck, title: t("whyChooseUs.higherSecurity"), desc: t("whyChooseUs.securityDesc") },
    { icon: Percent, title: t("whyChooseUs.lowerCommissions"), desc: t("whyChooseUs.commissionsDesc") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("whyChooseUs.label")}</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("whyChooseUs.title")}</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="text-center p-6 rounded-2xl hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
              >
                <f.icon size={30} className="text-primary" />
              </motion.div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
