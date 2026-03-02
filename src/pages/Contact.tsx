import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import PageHero from "@/components/landing/PageHero";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.messageSent"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("contact.label")}
        title={t("contact.title")}
        highlight={t("contact.highlight")}
        description={t("contact.description")}
      />
      <section className="py-20 lg:py-28 section-dark">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">{t("contact.email")}</h3>
                  <p className="text-section-dark-foreground/60 text-sm">support@coinstamp.org</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">{t("contact.phone")}</h3>
                  <p className="text-section-dark-foreground/60 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">{t("contact.office")}</h3>
                  <p className="text-section-dark-foreground/60 text-sm">123 Finance St, New York, NY 10001</p>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-4 bg-section-dark-foreground/5 border border-section-dark-foreground/10 rounded-xl p-6"
            >
              <Input
                placeholder={t("contact.namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-background/10 border-section-dark-foreground/10 text-section-dark-foreground"
              />
              <Input
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="bg-background/10 border-section-dark-foreground/10 text-section-dark-foreground"
              />
              <Textarea
                placeholder={t("contact.messagePlaceholder")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="bg-background/10 border-section-dark-foreground/10 text-section-dark-foreground"
              />
              <Button type="submit" className="w-full gap-2">
                <Send size={16} /> {t("contact.sendMessage")}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
