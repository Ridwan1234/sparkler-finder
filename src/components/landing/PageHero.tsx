import { motion } from "framer-motion";

interface PageHeroProps {
  label: string;
  title: string;
  highlight?: string;
  description: string;
}

const PageHero = ({ label, title, highlight, description }: PageHeroProps) => (
  <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-primary font-medium text-sm uppercase tracking-wider">{label}</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-6">
          {title}{" "}
          {highlight && <span className="text-primary">{highlight}</span>}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  </section>
);

export default PageHero;
