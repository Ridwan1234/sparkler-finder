import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I get started with CoinStamp?",
    a: "Simply create an account, verify your identity, choose an investment plan, and make your first deposit. Our platform guides you through every step.",
  },
  {
    q: "What is the minimum investment amount?",
    a: "Our Standard plan starts at just $100, making it accessible for everyone. Higher-tier plans offer greater returns with higher minimums.",
  },
  {
    q: "How are returns calculated and distributed?",
    a: "Returns are calculated based on your chosen plan's ROI percentage and compounded daily. Earnings are credited to your account balance automatically.",
  },
  {
    q: "Is my investment secure?",
    a: "Absolutely. We use bank-grade encryption, two-factor authentication, and cold storage for digital assets. Your funds are protected by industry-leading security protocols.",
  },
  {
    q: "How do I withdraw my funds?",
    a: "You can request a withdrawal anytime from your dashboard. Withdrawals are processed within 24 hours to your preferred cryptocurrency wallet or bank account.",
  },
  {
    q: "Do you offer a referral program?",
    a: "Yes! Earn commissions by referring friends and family. You'll receive a percentage of their investment returns as a referral bonus.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-28 section-dark">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-section-dark-foreground/5 border border-section-dark-foreground/10 rounded-xl px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left text-section-dark-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-section-dark-foreground/60">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
