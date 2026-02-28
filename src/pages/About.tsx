import Header from "@/components/landing/Header";
import AboutSection from "@/components/landing/AboutSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

const About = () => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />
    <AboutSection />
    <WhyChooseUs />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default About;
