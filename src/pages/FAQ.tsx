import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const FAQ = () => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />
    <PageHero
      label="FAQ"
      title="Frequently Asked"
      highlight="Questions"
      description="Find answers to the most common questions about our platform, investment plans, security, and more."
    />
    <FAQSection />
    <Footer />
  </div>
);

export default FAQ;
