import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ServicesSection from "@/components/landing/ServicesSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CryptoTickerSection from "@/components/landing/CryptoTickerSection";
import { CryptoMarquee } from "@/components/dashboard/CryptoMarquee";
import PlansSection from "@/components/landing/PlansSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16 md:pt-20">
        <CryptoMarquee />
      </div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CryptoTickerSection />
      <WhyChooseUs />
      <PlansSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
