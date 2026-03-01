import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Footer = () => {
  return (
    <footer id="contact" className="section-dark border-t border-section-dark-foreground/10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="container py-16"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">C</span>
              </div>
              <span className="font-display font-bold text-xl">CoinStamp</span>
            </div>
            <p className="text-section-dark-foreground/50 text-sm mb-4">
              A trusted multi-asset investment platform providing secure, transparent, and high-yield investment opportunities globally.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-section-dark-foreground/50">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Investment Plans", href: "/plans" },
                { label: "FAQs", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-section-dark-foreground/50">
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> support@coinstamp.org</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> 123 Finance St, New York</li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Newsletter</h4>
            <p className="text-section-dark-foreground/50 text-sm mb-3">Subscribe for market updates and investment tips.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-section-dark-foreground/5 border-section-dark-foreground/10 text-section-dark-foreground placeholder:text-section-dark-foreground/30" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 shrink-0">Subscribe</Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="border-t border-section-dark-foreground/10 py-6"
      >
        <div className="container text-center text-sm text-section-dark-foreground/40">
          © {new Date().getFullYear()} CoinStamp. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
