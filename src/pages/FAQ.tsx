import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("faq.pageLabel")}
        title={t("faq.pageTitle")}
        highlight={t("faq.pageHighlight")}
        description={t("faq.pageDescription")}
      />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default FAQ;
