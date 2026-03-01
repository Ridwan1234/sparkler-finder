import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James K.",
    role: "Crypto Investor",
    text: "CoinStamp has transformed my investment portfolio. The returns are consistent and the platform is incredibly easy to use.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Forex Trader",
    text: "I've been trading forex for years, and CoinStamp offers the best spreads and execution I've experienced. Truly professional.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "Real Estate Investor",
    text: "The fractional real estate feature is brilliant. I can diversify across multiple properties with minimal capital.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            What Our Investors Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-card border border-border rounded-xl p-8 relative group hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-default"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.08, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="absolute top-4 right-4"
              >
                <Quote size={48} className="text-primary" />
              </motion.div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 + j * 0.05, type: "spring", stiffness: 400 }}
                  >
                    <Star size={16} className="fill-gold text-gold" />
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <span className="text-primary font-bold text-sm">{t.name[0]}</span>
                </motion.div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
