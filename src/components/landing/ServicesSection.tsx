import { motion } from "framer-motion";
import {
  TrendingUp, Bitcoin, Building2, Landmark, Gem, Cpu,
  Globe, Wallet, CircleDollarSign, Droplets, Wheat, BarChart3,
} from "lucide-react";

const services = [
  { icon: TrendingUp, title: "Forex & Stocks", desc: "Trade global currencies and equities with leverage and real-time analysis." },
  { icon: Bitcoin, title: "Crypto Trading", desc: "Invest in Bitcoin, Ethereum, and 100+ altcoins with competitive spreads." },
  { icon: Building2, title: "Real Estate", desc: "Fractional ownership in premium global properties for passive income." },
  { icon: Landmark, title: "Loaning", desc: "Flexible peer-to-peer lending with attractive interest rates." },
  { icon: Gem, title: "NFTs", desc: "Curated NFT investments in art, gaming, and digital collectibles." },
  { icon: Cpu, title: "Mining", desc: "Cloud mining solutions for Bitcoin and other proof-of-work cryptocurrencies." },
  { icon: Globe, title: "Metaverse", desc: "Early-stage investments in virtual real estate and metaverse projects." },
  { icon: Wallet, title: "Wealth Management", desc: "Personalized portfolio management by expert financial advisors." },
  { icon: CircleDollarSign, title: "Gold", desc: "Digital gold investments backed by physical reserves in secure vaults." },
  { icon: Droplets, title: "Crude Oil", desc: "Commodity trading in crude oil futures and spot markets." },
  { icon: Wheat, title: "Agriculture", desc: "Invest in sustainable farming and agricultural commodity markets." },
  { icon: BarChart3, title: "ETFs", desc: "Diversified exchange-traded funds across multiple sectors and geographies." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 } as const,
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-28 section-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Diverse Investment Opportunities
          </h2>
          <p className="text-section-dark-foreground/60 max-w-2xl mx-auto">
            From traditional assets to cutting-edge digital investments, we offer a complete suite of services.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card rounded-xl p-6 hover:bg-section-dark-foreground/10 hover:border-primary/30 transition-colors group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <s.icon size={32} className="text-primary mb-4 transition-transform" />
              </motion.div>
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-section-dark-foreground/50 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
