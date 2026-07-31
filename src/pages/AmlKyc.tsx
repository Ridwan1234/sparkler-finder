import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Ban, Clock, Coins, Cookie, Database, Eye, FileText, Gavel, IdCard, Lock, Scale, Search, Settings, Shield, ShieldCheck, UserCheck, Wallet } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Introduction",
    content: [
      "HARBORFORGE is committed to maintaining the highest standards of integrity, security, and regulatory compliance. This Anti-Money Laundering (\"AML\") and Know Your Customer (\"KYC\") Policy explains the procedures HARBORFORGE uses to verify customer identities, detect suspicious activity, prevent financial crime, and comply with applicable legal and regulatory obligations.",
      "By creating an account or using the Platform, you agree to comply with this Policy.",
    ],
  },
  {
    icon: Shield,
    title: "2. Purpose",
    content: [
      "The purpose of this Policy is to:",
      "• Prevent money laundering.",
      "• Prevent terrorist financing.",
      "• Prevent fraud and identity theft.",
      "• Prevent sanctions violations.",
      "• Protect users and the Platform.",
      "• Maintain the integrity of HARBORFORGE's services.",
      "• Meet applicable legal and regulatory requirements where HARBORFORGE operates.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Scope",
    content: [
      "This Policy applies to:",
      "• All registered users.",
      "• Prospective users.",
      "• Investors.",
      "• Business partners.",
      "• Corporate account holders.",
      "• Authorized representatives acting on behalf of users.",
    ],
  },
  {
    icon: Scale,
    title: "4. Customer Identification Program (KYC)",
    content: [
      "Before accessing certain Platform features or requesting withdrawals, users may be required to complete identity verification.",
      "Verification helps us:",
      "• Confirm the identity of our users.",
      "• Prevent fraudulent accounts.",
      "• Reduce financial crime.",
      "• Protect customer assets.",
      "• Meet compliance obligations.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Information We May Request",
    content: [
      "Depending on the nature of your account and applicable requirements, HARBORFORGE may request:",
      "Personal Information",
      "• Full legal name",
      "• Date of birth",
      "• Nationality",
      "• Residential address",
      "• Telephone number",
      "• Email address",
      "Identity Documents",
      "• Passport",
      "• National Identity Card",
      "• Driver's License",
      "• Residence Permit",
      "Proof of Address",
      "Examples include:",
      "• Utility bill",
      "• Bank statement",
      "• Government correspondence",
      "• Tax document",
      "Documents should generally be recent and clearly show the user's name and residential address.",
    ],
  },
  {
    icon: Lock,
    title: "6. Selfie Verification",
    content: [
      "Users may be asked to submit:",
      "• A live selfie.",
      "• A photograph holding an identification document.",
      "• Biometric verification where available.",
      "This helps reduce identity fraud and unauthorized account use.",
    ],
  },
  {
    icon: Wallet,
    title: "7. Enhanced Due Diligence (EDD)",
    content: [
      "Additional verification may be required where circumstances present increased compliance risks.",
      "EDD may apply to:",
      "• High-value transactions.",
      "• Complex transaction patterns.",
      "• Politically exposed persons (PEPs).",
      "• High-risk jurisdictions.",
      "• Sanctions-related concerns.",
      "• Corporate or institutional accounts.",
      "• Other situations identified through our risk assessment process.",
      "EDD measures may include additional identity documents, or other reasonable requests.",
    ],
  },
  {
    icon: Database,
    title: "8. Ongoing Monitoring",
    content: [
      "HARBORFORGE continuously monitors account activity to detect unusual or suspicious behavior.",
      "Monitoring may include:",
      "• Deposit patterns.",
      "• Withdrawal behavior.",
      "• Login locations.",
      "• Device activity.",
      "• Wallet activity.",
      "• Blockchain analytics.",
      "• Transaction frequency.",
      "• Transaction values.",
      "Monitoring is performed to enhance security and meet compliance obligations.",
    ],
  },
  {
    icon: Eye,
    title: "9. Sanctions Compliance",
    content: [
      "HARBORFORGE reserves the right to screen users and transactions against applicable sanctions lists and other compliance databases where required by law.",
      "Users must not use the Platform in a manner that violates applicable sanctions laws or restrictions.",
    ],
  },
  {
    icon: Search,
    title: "10. Suspicious Activity",
    content: [
      "If HARBORFORGE reasonably believes that an account or transaction may involve unlawful activity, the Company may:",
      "• Request additional information.",
      "• Delay transaction processing.",
      "• Suspend account access.",
      "• Freeze certain account functions where legally permitted.",
      "• Decline transactions.",
      "• Terminate the account where appropriate.",
      "• Cooperate with competent authorities where required by law.",
      "These measures are intended to protect users and the integrity of the Platform.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "11. Prohibited Activities",
    content: [
      "Users must not use the Platform to facilitate:",
      "• Fraud.",
      "• Identity theft.",
      "• Money laundering.",
      "• Terrorist financing.",
      "• Market manipulation.",
      "• Tax evasion.",
      "• Theft of digital assets.",
      "• Cybercrime.",
      "• Bribery or corruption.",
      "• Any other unlawful activity.",
      "Accounts reasonably believed to be involved in prohibited conduct may be restricted or terminated.",
    ],
  },
  {
    icon: IdCard,
    title: "12. Record Retention",
    content: [
      "HARBORFORGE may retain KYC and compliance records for the period required by applicable law or for as long as reasonably necessary to:",
      "• Meet legal obligations.",
      "• Resolve disputes.",
      "• Protect against fraud.",
      "• Respond to regulatory inquiries.",
      "• Maintain security records.",
    ],
  },
  {
    icon: Coins,
    title: "13. Privacy and Confidentiality",
    content: [
      "Information collected under this Policy is handled in accordance with the HARBORFORGE Privacy Policy.",
      "Personal information will be protected using reasonable technical and organizational safeguards.",
    ],
  },
  {
    icon: Clock,
    title: "14. User Responsibilities",
    content: [
      "Users agree to:",
      "• Provide accurate and complete information.",
      "• Promptly update information if it changes.",
      "• Cooperate with verification requests.",
      "• Respond to compliance inquiries within a reasonable period.",
      "• Use only cryptocurrency and funds they are legally entitled to use.",
      "Failure to comply may result in restrictions on the account.",
    ],
  },
  {
    icon: Ban,
    title: "15. Refusal or Termination of Service",
    content: [
      "HARBORFORGE reserves the right to decline, suspend, or terminate services where:",
      "• Identity cannot be reasonably verified.",
      "• Required documentation is not provided.",
      "• Fraud is suspected.",
      "• Information provided is false or misleading.",
      "• Continued service would create unacceptable legal, security, or operational risks.",
      "Where appropriate, HARBORFORGE may retain information necessary to comply with applicable legal obligations.",
    ],
  },
  {
    icon: Gavel,
    title: "16. Policy Updates",
    content: [
      "HARBORFORGE may amend this Policy from time to time to reflect operational, technological, or legal developments.",
      "Material updates will be published on the Platform. Continued use of the Platform after the effective date of a revised Policy constitutes acceptance of the updated Policy.",
    ],
  },
  {
    icon: Cookie,
    title: "17. Contact Information",
    content: [
      "Questions regarding this AML & KYC Policy may be directed to:",
      "HARBORFORGE Compliance Department",
      "Website: [To Be Added]",
      "Email: compliance@[yourdomain].com",
      "Registered Office: [To Be Added Following Incorporation]",
    ],
  },
  {
    icon: Settings,
    title: "18. Acknowledgment",
    content: [
      "By creating an account or using the HARBORFORGE Platform, you acknowledge that you have read, understood, and agree to comply with this AML & KYC Policy.",
    ],
  },
];

const AmlKyc = () => (
  <LegalPage
    label="Compliance"
    title="AML & KYC"
    highlight="Policy"
    description="Our anti-money laundering and customer identification standards."
    sections={sections}
  />
);

export default AmlKyc;
