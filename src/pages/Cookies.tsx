import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Database, Eye, FileText, IdCard, Lock, Scale, Search, Shield, ShieldCheck, UserCheck, Wallet } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Introduction",
    content: [
      "This Cookie Policy explains how HARBORFORGE uses cookies and similar technologies when you access our website, mobile applications, and related services (collectively, the \"Platform\").",
      "By continuing to use the Platform, you consent to the use of cookies in accordance with this Policy, except where your consent is required by applicable law.",
    ],
  },
  {
    icon: Shield,
    title: "2. What Are Cookies?",
    content: [
      "Cookies are small text files placed on your device when you visit a website.",
      "They help websites:",
      "• Remember user preferences.",
      "• Improve website functionality.",
      "• Maintain secure sessions.",
      "• Analyze website performance.",
      "• Protect against fraud.",
      "• Enhance user experience.",
      "Cookies generally do not contain information that directly identifies an individual, although they may be associated with other information that can identify a user.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Types of Cookies We Use",
    content: [
      "A. Essential Cookies",
      "These cookies are necessary for the operation of the Platform.",
      "They enable functions such as:",
      "• User authentication.",
      "• Secure login.",
      "• Session management.",
      "• Fraud prevention.",
      "• Navigation.",
      "• Website security.",
      "Without these cookies, certain services may not function properly.",
      "B. Performance Cookies",
      "Performance cookies help us understand how visitors use the Platform.",
      "These cookies may collect information regarding:",
      "• Page visits.",
      "• Loading times.",
      "• Errors.",
      "• Navigation paths.",
      "• User interactions.",
      "This information is generally used to improve the Platform.",
      "C. Functional Cookies",
      "Functional cookies remember user preferences including:",
      "• Language selection.",
      "• Region.",
      "• Display preferences.",
      "• User settings.",
      "• Dashboard customization.",
      "D. Security Cookies",
      "Security cookies assist in:",
      "• Detecting suspicious login attempts.",
      "• Preventing account compromise.",
      "• Identifying unauthorized access.",
      "• Protecting user sessions.",
      "E. Analytics Cookies",
      "Analytics technologies may help us understand:",
      "• Visitor numbers.",
      "• Traffic sources.",
      "• Device types.",
      "• Browser usage.",
      "• Feature popularity.",
      "Analytics information is generally aggregated and used to improve the Platform.",
    ],
  },
  {
    icon: Scale,
    title: "4. Third-Party Cookies",
    content: [
      "Certain third-party service providers may place cookies on the Platform in connection with services such as:",
      "• Website analytics.",
      "• Cloud hosting.",
      "• Customer support tools.",
      "• Fraud detection.",
      "• Security monitoring.",
      "• Identity verification services.",
      "HARBORFORGE does not control third-party cookie practices. Users should review the privacy policies of those providers.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Why We Use Cookies",
    content: [
      "Cookies help HARBORFORGE:",
      "• Secure user accounts.",
      "• Improve website performance.",
      "• Personalize user experience.",
      "• Maintain login sessions.",
      "• Remember user preferences.",
      "• Detect fraud.",
      "• Improve investment dashboards.",
      "• Analyze Platform performance.",
      "• Maintain Platform stability.",
    ],
  },
  {
    icon: Lock,
    title: "6. Managing Cookies",
    content: [
      "Most web browsers allow users to:",
      "• Accept cookies.",
      "• Reject cookies.",
      "• Delete existing cookies.",
      "• Block specific cookies.",
      "• Receive notifications before cookies are stored.",
      "Disabling certain cookies may affect the functionality and performance of the Platform.",
    ],
  },
  {
    icon: Wallet,
    title: "7. Cookie Retention",
    content: [
      "Some cookies remain on your device only during your browsing session, while others may remain for a longer period to remember your preferences or support security features.",
      "Cookie retention periods may vary depending on the purpose of the cookie.",
    ],
  },
  {
    icon: Database,
    title: "8. Data Protection",
    content: [
      "Information collected through cookies is handled in accordance with the HARBORFORGE Privacy Policy.",
      "Reasonable security measures are implemented to protect information collected through cookies from unauthorized access, disclosure, alteration, or destruction.",
    ],
  },
  {
    icon: Eye,
    title: "9. International Users",
    content: [
      "Users accessing the Platform from different jurisdictions may be subject to different legal requirements regarding cookies.",
      "Where required by applicable law, HARBORFORGE will request consent before placing non-essential cookies on a user's device.",
    ],
  },
  {
    icon: Search,
    title: "10. Updates to This Policy",
    content: [
      "HARBORFORGE may revise this Cookie Policy from time to time.",
      "Any material changes will be published on the Platform and become effective on the date indicated.",
      "Continued use of the Platform after the effective date constitutes acceptance of the updated Policy.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "11. Contact Information",
    content: [
      "Questions regarding this Cookie Policy may be directed to:",
      "HARBORFORGE Privacy Office",
      "Website: harborforge.org",
      "Email: support@harborforge.org",
      "Registered Office: Available upon request.",
    ],
  },
  {
    icon: IdCard,
    title: "12. Acknowledgment",
    content: [
      "By using the HARBORFORGE Platform, you acknowledge that you have read and understood this Cookie Policy.",
    ],
  },
];

const Cookies = () => (
  <LegalPage
    label="Legal"
    title="Cookie"
    highlight="Policy"
    description="How HarborForge uses cookies and similar technologies."
    effectiveDate="5th of May 2017"
    lastUpdated="12th of Feb 2026"
    sections={sections}
  />
);

export default Cookies;
