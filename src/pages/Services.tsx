import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import ServicesSection from "@/components/landing/ServicesSection";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("services.pageLabel")}
        title={t("services.pageTitle")}
        highlight={t("services.pageHighlight")}
        description={t("services.pageDescription")}
      />
      <ServicesSection />
      <Footer />
    </div>
  );
};

export default Services;
