import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import PlansSection from "@/components/landing/PlansSection";
import Footer from "@/components/landing/Footer";

const PlansPage = () => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />
    <PageHero
      label="Investment Plans"
      title="Choose Your"
      highlight="Growth Strategy"
      description="Select from our range of expertly crafted investment plans tailored to different risk appetites and financial goals. Start building your wealth today."
    />
    <PlansSection />
    <Footer />
  </div>
);

export default PlansPage;
