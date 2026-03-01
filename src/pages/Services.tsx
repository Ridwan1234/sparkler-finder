import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import ServicesSection from "@/components/landing/ServicesSection";
import Footer from "@/components/landing/Footer";

const Services = () => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />
    <PageHero
      label="Our Services"
      title="Comprehensive"
      highlight="Investment Solutions"
      description="From cryptocurrency and forex to real estate and stocks, we offer a full spectrum of investment services designed to help you grow and protect your wealth."
    />
    <ServicesSection />
    <Footer />
  </div>
);

export default Services;
