import { motion } from "framer-motion";
import { Award, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "Years of consistent returns with transparent reporting and audited results.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency & Security",
    desc: "Bank-grade encryption, 2FA, and cold storage for maximum asset protection.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "Dedicated support team available round the clock via live chat and email.",
  },
];

const AboutSection = () => {
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
          <span className="text-primary font-medium text-sm uppercase tracking-wider">About Us</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Experienced Trading Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CoinStamp is a leading multi-asset investment platform offering diverse opportunities across cryptocurrency, forex, stocks, real estate, and more.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors"
              >
                <f.icon size={28} className="text-primary" />
              </motion.div>
              <h3 className="font-display font-semibold text-xl mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
