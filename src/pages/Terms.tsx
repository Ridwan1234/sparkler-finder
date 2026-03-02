import Header from "@/components/landing/Header";
import PageHero from "@/components/landing/PageHero";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, FileText, Lock, AlertTriangle, Scale, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the HarborForge platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
      "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the platform. Your continued use of the platform after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    icon: Shield,
    title: "2. Account Registration & Security",
    content: [
      "To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.",
      "You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately of any unauthorized use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "3. Investment Risks & Disclaimers",
    content: [
      "All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results. Cryptocurrency and digital asset markets are highly volatile.",
      "HarborForge does not provide financial, tax, or legal advice. You should consult with qualified professionals before making any investment decisions.",
      "Returns mentioned on the platform are projected estimates and are not guaranteed. Market conditions may affect actual returns.",
    ],
  },
  {
    icon: Scale,
    title: "4. User Conduct & Prohibited Activities",
    content: [
      "You agree not to use the platform for any unlawful purpose, including but not limited to money laundering, terrorist financing, fraud, or any activity that violates applicable laws.",
      "You shall not attempt to gain unauthorized access to any portion of the platform, other accounts, computer systems, or networks connected to the platform.",
      "Any form of market manipulation, impersonation, or abuse of the referral system is strictly prohibited and may result in immediate account termination.",
    ],
  },
  {
    icon: Lock,
    title: "5. Deposits, Withdrawals & Fees",
    content: [
      "All deposit and withdrawal transactions are subject to verification and processing times. We reserve the right to hold transactions for security review.",
      "Minimum and maximum deposit/withdrawal amounts are determined by your selected investment plan and account status.",
      "We may charge fees for certain transactions or services. All applicable fees will be clearly disclosed before you confirm any transaction.",
    ],
  },
  {
    icon: Eye,
    title: "6. Privacy Policy",
    content: [
      "We collect and process personal information in accordance with applicable data protection laws. Information collected includes but is not limited to: name, email address, phone number, wallet addresses, and transaction history.",
      "Your personal data is used to provide and improve our services, process transactions, communicate with you, and comply with legal obligations.",
      "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.",
      "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to provide our services.",
      "You have the right to access, correct, or delete your personal data at any time by contacting our support team or through your account settings.",
    ],
  },
];

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20" />
      <PageHero
        label={t("terms.label")}
        title={t("terms.title")}
        highlight={t("terms.highlight")}
        description={t("terms.description")}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm mb-10"
          >
            {t("terms.lastUpdated")}: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </motion.p>

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {t("terms.questionsTitle")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("terms.questionsDesc")}{" "}
              <a href="mailto:support@harborforge.org" className="text-primary hover:underline">
                support@harborforge.org
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
