import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

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
          <span className="text-primary font-medium text-sm uppercase tracking-wider">{t("aboutPage.subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            {t("aboutPage.title")} <span className="text-primary">{t("aboutPage.titleHighlight")}</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-muted-foreground">{t("aboutPage.description")}</p>
            <p className="text-muted-foreground">{t("aboutPage.description2")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
