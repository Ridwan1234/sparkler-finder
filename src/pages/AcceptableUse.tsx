import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Ban, Clock, Coins, Database, Eye, FileText, Gavel, IdCard, Lock, Scale, Search, Shield, ShieldCheck, UserCheck, Wallet } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Introduction",
    content: [
      "This Acceptable Use Policy (\"Policy\") governs the use of the HARBORFORGE website, applications, investment platform, and related services (collectively, the \"Platform\").",
      "This Policy is incorporated into the HARBORFORGE Terms of Service.",
      "By accessing or using the Platform, you agree to comply with this Policy.",
      "Failure to comply may result in suspension, restriction, or permanent termination of your account.",
    ],
  },
  {
    icon: Shield,
    title: "2. Purpose",
    content: [
      "The purpose of this Policy is to:",
      "• Protect users.",
      "• Maintain Platform security.",
      "• Prevent financial crime.",
      "• Ensure fair use of services.",
      "• Protect HARBORFORGE's reputation.",
      "• Comply with applicable laws and regulations.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Lawful Use",
    content: [
      "Users may use the Platform only for lawful purposes.",
      "Users agree to comply with all applicable laws and regulations in their jurisdiction relating to:",
      "• Cryptocurrency.",
      "• Financial transactions.",
      "• Tax obligations.",
      "• Data protection.",
      "• Cybersecurity.",
      "• Anti-money laundering requirements.",
    ],
  },
  {
    icon: Scale,
    title: "4. Account Security",
    content: [
      "Users are responsible for:",
      "• Maintaining the confidentiality of login credentials.",
      "• Using strong passwords.",
      "• Enabling Multi-Factor Authentication (MFA), where available.",
      "• Promptly notifying HARBORFORGE of suspected unauthorized access.",
      "• Logging out of shared devices.",
      "Users remain responsible for activities conducted through their accounts unless unauthorized access has been promptly reported.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Prohibited Conduct",
    content: [
      "Users must not:",
      "Fraud",
      "• Provide false information.",
      "• Use stolen identities.",
      "• Open accounts under another person's name.",
      "• Impersonate another individual or organization.",
      "• Submit forged documents.",
      "Financial Crime",
      "Users must not use the Platform for:",
      "• Money laundering.",
      "• Terrorist financing.",
      "• Fraudulent investment schemes.",
      "• Tax evasion.",
      "• Sanctions evasion.",
      "• Bribery.",
      "• Corruption.",
      "• Any criminal activity.",
      "Unauthorized Access",
      "Users shall not:",
      "• Attempt to hack the Platform.",
      "• Circumvent security systems.",
      "• Exploit software vulnerabilities.",
      "• Access systems without authorization.",
      "• Perform penetration testing without written permission.",
      "• Attempt privilege escalation.",
      "• Interfere with Platform operations.",
      "Malware",
      "Users shall not introduce:",
      "• Viruses.",
      "• Worms.",
      "• Trojans.",
      "• Spyware.",
      "• Malicious scripts.",
      "• Ransomware.",
      "• Harmful software.",
      "Automated Activity",
      "Unless expressly authorized by HARBORFORGE, users shall not:",
      "• Use bots.",
      "• Use automated account creation.",
      "• Scrape Platform content.",
      "• Use automated trading scripts that interfere with Platform operations.",
      "• Conduct denial-of-service attacks.",
      "Market Abuse",
      "Users shall not:",
      "• Manipulate markets.",
      "• Coordinate fraudulent trading activity.",
      "• Attempt price manipulation.",
      "• Engage in deceptive trading practices.",
      "Abuse of Promotions",
      "Users must not:",
      "• Create multiple accounts to receive bonuses.",
      "• Abuse referral programs.",
      "• Manipulate promotional campaigns.",
      "• Exploit software errors.",
      "Harassment",
      "Users shall not:",
      "• Harass employees.",
      "• Threaten other users.",
      "• Use abusive language.",
      "• Engage in discriminatory conduct.",
      "• Intimidate support staff.",
    ],
  },
  {
    icon: Lock,
    title: "6. Intellectual Property",
    content: [
      "Users shall not:",
      "• Copy Platform software.",
      "• Reverse engineer proprietary systems.",
      "• Reproduce website content without authorization.",
      "• Remove copyright notices.",
      "• Use HARBORFORGE trademarks without written permission.",
      "• Misrepresent ownership of Platform materials.",
    ],
  },
  {
    icon: Wallet,
    title: "7. False Information",
    content: [
      "Users must ensure that all information provided is:",
      "• Accurate.",
      "• Complete.",
      "• Current.",
      "• Truthful.",
      "Providing false information may result in immediate account restrictions.",
    ],
  },
  {
    icon: Database,
    title: "8. Cryptocurrency Ownership",
    content: [
      "Users represent that digital assets deposited into the Platform:",
      "• Are lawfully owned.",
      "• Are not stolen.",
      "• Are not derived from unlawful activity.",
      "• Are not subject to legal restrictions.",
    ],
  },
  {
    icon: Eye,
    title: "9. Compliance Reviews",
    content: [
      "Users agree to cooperate with compliance reviews, including requests for:",
      "• Identity verification.",
      "• Source of funds.",
      "• Source of wealth (where applicable).",
      "• Additional documentation reasonably required for compliance or security purposes.",
      "Failure to cooperate may result in account restrictions.",
    ],
  },
  {
    icon: Search,
    title: "10. Platform Availability",
    content: [
      "Users shall not intentionally interfere with the availability or performance of the Platform.",
      "Prohibited activities include:",
      "• Network flooding.",
      "• Distributed denial-of-service attacks.",
      "• System abuse.",
      "• Interference with other users.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "11. Monitoring",
    content: [
      "To protect the Platform, HARBORFORGE may monitor account activity, system logs, and transaction activity for security, fraud prevention, compliance, and operational purposes, in accordance with applicable law and the Privacy Policy.",
    ],
  },
  {
    icon: IdCard,
    title: "12. Enforcement",
    content: [
      "If HARBORFORGE reasonably believes that a user has violated this Policy, it may take one or more of the following actions:",
      "• Issue a warning.",
      "• Request additional information.",
      "• Suspend certain account features.",
      "• Delay or decline transactions.",
      "• Restrict access to the Platform.",
      "• Terminate the account.",
      "• Report unlawful conduct to competent authorities where required by law.",
      "Any enforcement action will be taken in accordance with applicable law and the HARBORFORGE Terms of Service.",
    ],
  },
  {
    icon: Coins,
    title: "13. Reporting Violations",
    content: [
      "Users who become aware of suspected violations of this Policy may report them to HARBORFORGE through the official contact channels.",
      "Reports should include sufficient information to enable investigation.",
    ],
  },
  {
    icon: Clock,
    title: "14. Changes to This Policy",
    content: [
      "HARBORFORGE reserves the right to amend this Policy from time to time.",
      "Material changes will be published on the Platform.",
      "Continued use of the Platform after changes become effective constitutes acceptance of the updated Policy.",
    ],
  },
  {
    icon: Ban,
    title: "15. Contact Information",
    content: [
      "Questions regarding this Acceptable Use Policy may be directed to:",
      "HARBORFORGE Legal & Compliance Department",
      "Website: [To Be Added]",
      "Email: legal@[yourdomain].com",
      "Registered Office: [To Be Added Following Incorporation]",
    ],
  },
  {
    icon: Gavel,
    title: "16. Acknowledgment",
    content: [
      "By accessing or using the HARBORFORGE Platform, you acknowledge that you have read, understood, and agree to comply with this Acceptable Use Policy.",
    ],
  },
];

const AcceptableUse = () => (
  <LegalPage
    label="Policies"
    title="Acceptable Use"
    highlight="Policy"
    description="Rules governing how the HarborForge platform may be used."
    effectiveDate="5th of May 2017"
    lastUpdated="12th of Feb 2026"
    sections={sections}
  />
);

export default AcceptableUse;
