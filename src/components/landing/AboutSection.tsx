import { motion } from "framer-motion";
import { Award, ShieldCheck, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Award, title: t("about.provenTrackRecord"), desc: t("about.provenDesc") },
    { icon: ShieldCheck, title: t("about.transparencySecurity"), desc: t("about.transparencyDesc") },
    { icon: Headphones, title: t("about.support247"), desc: t("about.supportDesc") },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("about.label")}</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">{t("about.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("about.description")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors"
              >
                <f.icon size={28} className="text-primary" />
              </motion.div>
              <h3 className="font-display font-semibold text-xl mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
