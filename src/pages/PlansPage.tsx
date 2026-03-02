import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import PlansSection from "@/components/landing/PlansSection";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

const PlansPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("plans.pageLabel")}
        title={t("plans.pageTitle")}
        highlight={t("plans.pageHighlight")}
        description={t("plans.pageDescription")}
      />
      <PlansSection />
      <Footer />
    </div>
  );
};

export default PlansPage;
