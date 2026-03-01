import { motion } from "framer-motion";
import {
  TrendingUp, Bitcoin, Gem, Cpu,
  Globe, BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 } as const,
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    { icon: TrendingUp, title: t("services.forexStocks"), desc: t("services.forexDesc") },
    { icon: Bitcoin, title: t("services.cryptoTrading"), desc: t("services.cryptoDesc") },
    { icon: Gem, title: t("services.nfts"), desc: t("services.nftsDesc") },
    { icon: Cpu, title: t("services.mining"), desc: t("services.miningDesc") },
    { icon: Globe, title: t("services.metaverse"), desc: t("services.metaverseDesc") },
    { icon: BarChart3, title: t("services.etfs"), desc: t("services.etfsDesc") },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 section-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("services.label")}</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("services.title")}</h2>
          <p className="text-section-dark-foreground/60 max-w-2xl mx-auto">{t("services.description")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card rounded-xl p-6 hover:bg-section-dark-foreground/10 hover:border-primary/30 transition-colors group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <s.icon size={32} className="text-primary mb-4 transition-transform" />
              </motion.div>
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-section-dark-foreground/50 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
