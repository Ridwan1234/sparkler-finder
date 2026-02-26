import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer id="contact" className="section-dark border-t border-section-dark-foreground/10">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">C</span>
              </div>
              <span className="font-display font-bold text-xl">CoinStamp</span>
            </div>
            <p className="text-section-dark-foreground/50 text-sm mb-4">
              A trusted multi-asset investment platform providing secure, transparent, and high-yield investment opportunities globally.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-section-dark-foreground/50">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#plans" className="hover:text-primary transition-colors">Investment Plans</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-section-dark-foreground/50">
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> support@coinstamp.org</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> 123 Finance St, New York</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Newsletter</h4>
            <p className="text-section-dark-foreground/50 text-sm mb-3">Subscribe for market updates and investment tips.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-section-dark-foreground/5 border-section-dark-foreground/10 text-section-dark-foreground placeholder:text-section-dark-foreground/30" />
              <Button size="sm" className="bg-primary hover:bg-primary/90 shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-section-dark-foreground/10 py-6">
        <div className="container text-center text-sm text-section-dark-foreground/40">
          © {new Date().getFullYear()} CoinStamp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
