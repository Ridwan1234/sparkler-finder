import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

export interface LegalSection {
  icon: LucideIcon;
  title: string;
  content: string[];
}

interface LegalPageProps {
  label: string;
  title: string;
  highlight?: string;
  description: string;
  sections: LegalSection[];
  effectiveDate?: string;
  lastUpdated?: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const LegalPage = ({
  label,
  title,
  highlight,
  description,
  sections,
  effectiveDate,
  lastUpdated,
}: LegalPageProps) => (
  <div className="min-h-screen">
    <Header />
    <div className="pt-20" />
    <PageHero label={label} title={title} highlight={highlight} description={description} />

    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-muted-foreground text-sm mb-10 space-y-1">
          {effectiveDate && <p>Effective date: {effectiveDate}</p>}
          <p>
            Last updated:{" "}
            {lastUpdated ??
              new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>


        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-lg md:text-xl font-semibold text-card-foreground">
                  {section.title}
                </h2>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-3">
                {section.content.map((paragraph, j) => (
                  <p key={j} className="text-muted-foreground text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Questions?</h3>
          <p className="text-muted-foreground text-sm">
            Contact our support team at{" "}
            <a href="mailto:support@harborforge.org" className="text-primary hover:underline">
              support@harborforge.org
            </a>
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default LegalPage;
