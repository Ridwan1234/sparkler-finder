import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Ban, BarChart3, Clock, Coins, Cookie, Database, Eye, FileText, Gavel, IdCard, Lock, Scale, Search, Settings, Shield, ShieldCheck, ToggleLeft, UserCheck, Wallet } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Introduction",
    content: [
      "HARBORFORGE respects your privacy and is committed to protecting your personal information.",
      "This Privacy Policy explains how we collect, use, disclose, store, protect, and process your information when you access or use the HARBORFORGE website, mobile applications, cryptocurrency investment platform, and related services (collectively, the \"Platform\").",
      "By accessing or using the Platform, you acknowledge that you have read and understood this Privacy Policy.",
    ],
  },
  {
    icon: Shield,
    title: "2. Information We Collect",
    content: [
      "We may collect the following categories of information.",
      "A. Personal Information",
      "Including but not limited to:",
      "• Full legal name",
      "• Date of birth",
      "• Residential address",
      "• Nationality",
      "• Email address",
      "• Telephone number",
      "• Government-issued identification",
      "• Passport",
      "• Driver's license",
      "• National Identity Card",
      "• Selfie or biometric verification images",
      "• Tax identification information where required",
      "B. Financial Information",
      "Including:",
      "• Cryptocurrency wallet addresses",
      "• Deposit history",
      "• Withdrawal history",
      "• Investment transactions",
      "• Blockchain transaction identifiers",
      "• Payment information where applicable",
      "C. Technical Information",
      "Such as:",
      "• IP address",
      "• Device information",
      "• Browser type",
      "• Operating system",
      "• Language preferences",
      "• Login history",
      "• Device identifiers",
      "• Time zone",
      "• Connection information",
      "D. Usage Information",
      "Including:",
      "• Pages visited",
      "• Features used",
      "• Investment activities",
      "• Referral information",
      "• Support requests",
      "• Security logs",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Information Collected Automatically",
    content: [
      "When you visit the Platform, we may automatically collect information through:",
      "• Cookies",
      "• Server logs",
      "• Analytics technologies",
      "• Device identifiers",
      "• Security monitoring tools",
    ],
  },
  {
    icon: Scale,
    title: "4. How We Use Your Information",
    content: [
      "We use collected information to:",
      "• Create your account",
      "• Verify your identity",
      "• Process cryptocurrency deposits",
      "• Process withdrawals",
      "• Conduct KYC verification",
      "• Prevent fraud",
      "• Detect suspicious transactions",
      "• Comply with legal obligations",
      "• Improve Platform functionality",
      "• Provide customer support",
      "• Respond to inquiries",
      "• Communicate important notices",
      "• Monitor investment performance",
      "• Secure the Platform",
      "• Develop new products and services",
      "• Conduct internal analytics",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Legal Bases for Processing",
    content: [
      "Where applicable, HARBORFORGE processes personal information based on one or more of the following legal grounds:",
      "• Your consent",
      "• Performance of a contract",
      "• Compliance with legal obligations",
      "• Protection of legitimate business interests",
      "• Prevention of fraud and financial crime",
      "• Protection of the security and integrity of the Platform",
    ],
  },
  {
    icon: Lock,
    title: "6. Know Your Customer (KYC)",
    content: [
      "To comply with applicable anti-money laundering and fraud prevention requirements, HARBORFORGE may request identity verification documents before enabling certain account features or processing withdrawals.",
      "Requested information may include:",
      "• Government-issued identification",
      "• Selfie verification",
      "• Proof of address",
      "• Source of funds documentation",
      "• Additional compliance documentation where required",
      "Failure to complete identity verification may result in restrictions on account functionality.",
    ],
  },
  {
    icon: Wallet,
    title: "7. Anti-Money Laundering Monitoring",
    content: [
      "We may monitor transactions to:",
      "• Detect suspicious activity",
      "• Prevent fraud",
      "• Prevent money laundering",
      "• Prevent terrorist financing",
      "• Comply with sanctions requirements",
      "• Protect users and the Platform",
      "Where required by applicable law, information may be shared with competent governmental or regulatory authorities.",
    ],
  },
  {
    icon: Database,
    title: "8. Cookies",
    content: [
      "We use cookies and similar technologies to:",
      "• Remember user preferences",
      "• Maintain secure login sessions",
      "• Analyze Platform performance",
      "• Improve user experience",
      "• Measure website traffic",
      "• Prevent unauthorized access",
      "Users may configure browser settings to refuse certain cookies; however, some features of the Platform may not function properly if cookies are disabled.",
    ],
  },
  {
    icon: Eye,
    title: "9. Information Sharing",
    content: [
      "HARBORFORGE does not sell your personal information.",
      "We are not going to disclose personal information for whatever reason",
    ],
  },
  {
    icon: Search,
    title: "10. International Transfers",
    content: [
      "Because HARBORFORGE may operate internationally, your information may be processed or stored in jurisdictions other than your country of residence.",
      "Where required by applicable law, we will implement appropriate safeguards to protect transferred personal information.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "11. Data Retention",
    content: [
      "Personal information will be retained only for as long as reasonably necessary to:",
      "• Provide services",
      "• Comply with legal obligations",
      "• Resolve disputes",
      "• Enforce agreements",
      "• Maintain security records",
      "• Satisfy regulatory requirements",
      "Following expiration of applicable retention periods, information will be securely deleted or anonymized where permitted by law.",
    ],
  },
  {
    icon: IdCard,
    title: "12. Security Measures",
    content: [
      "HARBORFORGE implements commercially reasonable technical, administrative, and organizational safeguards designed to protect user information, including:",
      "• Encryption of sensitive information in transit and, where appropriate, at rest",
      "• Firewalls",
      "• Access controls",
      "• Multi-factor authentication for administrative access",
      "• Security monitoring",
      "• Regular vulnerability assessments",
      "• Incident response procedures",
      "No method of transmission over the internet or electronic storage is completely secure. Accordingly, we guarantee absolute security.",
    ],
  },
  {
    icon: Coins,
    title: "13. Your Privacy Rights",
    content: [
      "Subject to applicable law, you may have the right to:",
      "• Access your personal information",
      "• Correct inaccurate information",
      "• Request deletion of certain information",
      "• Request restrictions on processing",
      "• Object to certain processing activities",
      "• Withdraw consent where processing is based on consent",
      "• Request a copy of your personal information in a portable format",
      "• Lodge a complaint with the relevant supervisory authority, where applicable",
      "Certain rights may be limited where HARBORFORGE must retain information to comply with legal, regulatory, fraud prevention, or security obligations.",
    ],
  },
  {
    icon: Clock,
    title: "14. Marketing Communications",
    content: [
      "With your consent where required by law, HARBORFORGE may send updates regarding:",
      "• Platform improvements",
      "• New investment products",
      "• Promotions",
      "• Educational materials",
      "• Security alerts",
      "You may opt out of marketing communications at any time using the unsubscribe instructions provided or by contacting us. Transactional and security-related communications may still be sent as necessary.",
    ],
  },
  {
    icon: Ban,
    title: "15. Children's Privacy",
    content: [
      "The Platform is intended solely for individuals who are at least eighteen (18) years of age or the age of majority in their jurisdiction, whichever is higher.",
      "HARBORFORGE does not knowingly collect personal information from children. If we become aware that personal information has been collected from a child in violation of this Policy, we will take reasonable steps to delete such information.",
    ],
  },
  {
    icon: Gavel,
    title: "16. Third-Party Websites",
    content: [
      "The Platform may contain links to third-party websites or services.",
      "HARBORFORGE is not responsible for the privacy practices, content, or security of third-party websites. Users should review the privacy policies of those third parties before providing personal information.",
    ],
  },
  {
    icon: Cookie,
    title: "17. Data Breach Response",
    content: [
      "If HARBORFORGE becomes aware of a security incident involving personal information, we will investigate the incident promptly and, where required by applicable law, notify affected users and relevant authorities within the legally prescribed timeframes.",
    ],
  },
  {
    icon: Settings,
    title: "18. Changes to this Privacy Policy",
    content: [
      "HARBORFORGE may revise this Privacy Policy from time to time.",
      "Material changes will become effective upon publication on the Platform or after such notice as may be required by applicable law.",
      "Continued use of the Platform after the effective date of the revised Privacy Policy constitutes acceptance of the updated Policy.",
    ],
  },
  {
    icon: BarChart3,
    title: "19. Contact Us",
    content: [
      "Questions, concerns, or requests relating to this Privacy Policy may be directed to:",
      "HARBORFORGE Privacy Office",
      "Website: [To Be Added]",
      "Email: privacy@[yourdomain].com",
      "Registered Office: [To Be Added Following Incorporation]",
    ],
  },
  {
    icon: ToggleLeft,
    title: "20. Acknowledgment",
    content: [
      "By accessing or using the HARBORFORGE Platform, you acknowledge that you have read, understood, and accepted this Privacy Policy.",
      "This Privacy Policy is intended to complement the HARBORFORGE Terms of Service and should be read together with the AML & KYC Policy, Risk Disclosure Statement, Cookie Policy, and other legal notices published on the Platform.",
    ],
  },
];

const Privacy = () => (
  <LegalPage
    label="Legal"
    title="Privacy"
    highlight="Policy"
    description="How HarborForge collects, uses, protects, and shares your personal information."
    effectiveDate="5th of May 2017"
    lastUpdated="18th of Feb 2026"
    sections={sections}
  />
);

export default Privacy;
