import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Ban, BarChart3, Bell, Bug, Clock, Coins, Cookie, Database, Eye, FileText, FileWarning, Gavel, Globe, IdCard, Lock, Megaphone, Scale, Search, Settings, Share2, Shield, ShieldAlert, ShieldCheck, ToggleLeft, UserCheck, UserX, Wallet, XCircle } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Introduction",
    content: [
      "Welcome to HARBORFORGE .",
      "These Terms of Service (\"Terms\") constitute a legally binding agreement between Investors and HARBORFORGE governing your access to and use of the HARBORFORGE website, platform, applications, products, and cryptocurrency investment services.",
      "By creating an account or using the Platform, you acknowledge that you have read, understood, and agree to be legally bound by these Terms.",
      "If you do not agree to these Terms, you must not access or use the Platform.",
    ],
  },
  {
    icon: Shield,
    title: "1. Definitions",
    content: [
      "For purposes of these Terms:",
      "Accountmeans a registered HARBORFORGE user profile used to access investment services.",
      "AI Investment Systemmeans HARBORFORGE's proprietary artificial intelligence technology utilized alongside professional investment managers for market analysis, portfolio allocation, and investment decision support.",
      "Digital Assetsmeans cryptocurrencies and blockchain-based assets accepted by HARBORFORGE.",
      "Investment Planmeans an investment program offered through the Platform with specified investment conditions, eligibility requirements, and distribution schedules.",
      "Platformmeans the HARBORFORGE website, applications, software, dashboards, APIs, and related services.",
      "KYCmeans Know Your Customer identity verification procedures.",
    ],
  },
  {
    icon: UserCheck,
    title: "2. Eligibility",
    content: [
      "To use HARBORFORGE you must:",
      "• be at least 18 years of age or the legal age of majority in your jurisdiction, whichever is greater.",
      "• Not be prohibited by applicable law from using cryptocurrency-related services.",
      "• Provide accurate information during registration.",
      "• Successfully complete identity verification before requesting withdrawals where required.",
      "HARBORFORGE reserves the right to refuse or terminate accounts that fail to satisfy these requirements.",
    ],
  },
  {
    icon: Scale,
    title: "3. Account Registration",
    content: [
      "To access investment services, users must create an account.",
      "You agree that all information submitted during registration shall be:",
      "• true;",
      "• accurate;",
      "• complete;",
      "• current.",
      "Providing false information constitutes a material breach of these Terms.",
      "Users are solely responsible for maintaining the confidentiality of login credentials.",
      "Any activity occurring through your account shall be deemed authorized by you unless reported immediately as unauthorized.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "4. Nature of Services",
    content: [
      "HARBORFORGE operates a cryptocurrency investment platform utilizing a combination of:",
      "• Artificial Intelligence technologies;",
      "• Professional market analysts;",
      "• Proprietary investment strategies;",
      "• Risk management methodologies.",
      "Digital assets deposited by eligible users may be allocated among investment strategies selected and managed by HARBORFORGE in accordance with the investment plan chosen by the user.",
      "Nothing contained within these Terms shall be interpreted as creating a banking relationship, brokerage account, deposit account, fiduciary relationship, or insurance contract unless expressly required under applicable law.",
    ],
  },
  {
    icon: Lock,
    title: "5. Investment Plans",
    content: [
      "The Platform may provide multiple investment plans.",
      "Each investment plan shall specify:",
      "• minimum investment;",
      "• maximum investment;",
      "• investment duration;",
      "• distribution schedule;",
      "• applicable fees;",
      "• withdrawal eligibility;",
      "• other applicable conditions.",
      "Participation in an investment plan constitutes acceptance of the specific terms applicable to that plan.",
    ],
  },
  {
    icon: Wallet,
    title: "6. Investment Risk Disclosure",
    content: [
      "Investing in digital assets involves substantial risk.",
      "You acknowledge and agree that:",
      "• cryptocurrency markets are highly volatile;",
      "• digital asset prices may fluctuate significantly;",
      "• technological failures may occur;",
      "• blockchain transactions are generally irreversible;",
      "• governmental regulation may change;",
      "• cybersecurity incidents may affect digital assets.",
      "You understand that past performance does not guarantee future results.",
      "Except where expressly required by law or specifically agreed in writing, HARBORFORGE does not guarantee investment performance or profits.",
    ],
  },
  {
    icon: Database,
    title: "7. Deposits",
    content: [
      "Users may fund their accounts using supported cryptocurrencies.",
      "All blockchain confirmations must be completed before funds are credited.",
      "Deposits sent using unsupported blockchain networks may be permanently unrecoverable.",
      "Users are solely responsible for ensuring the accuracy of wallet addresses and network selections.",
    ],
  },
  {
    icon: Eye,
    title: "8. Withdrawals",
    content: [
      "Withdrawal requests may be submitted through the Platform.",
      "Before any withdrawal is processed, users shall complete all applicable KYC verification procedures.",
      "HARBORFORGE reserves the right to:",
      "• request additional verification documents;",
      "• delay processing where fraud prevention measures require additional review;",
      "• reject withdrawals involving suspected fraud, money laundering, sanctions violations, or unlawful activity.",
      "Applicable blockchain network fees and platform processing fees may be deducted from withdrawal amounts.",
      "Estimated processing times displayed on the Platform are estimates only and may vary due to blockchain congestion, security reviews, operational requirements, or events beyond HARBORFORGE's reasonable control.",
    ],
  },
  {
    icon: Search,
    title: "9. Know Your Customer (KYC)",
    content: [
      "HARBORFORGE maintains a strict identity verification program.",
      "Users may be required to provide:",
      "• Government-issued identification;",
      "• Proof of address;",
      "• Selfie or biometric verification;",
      "• Source-of-funds documentation where required;",
      "• Any additional information reasonably requested for compliance purposes.",
      "Failure to complete KYC may result in restrictions on account functionality, including deposits, withdrawals, or account access.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "10. Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF)",
    content: [
      "HARBORFORGE is committed to maintaining a secure financial environment and preventing the use of its Platform for money laundering, terrorist financing, fraud, sanctions evasion, or other unlawful activities.",
      "The Company reserves the right to:",
      "• Conduct customer due diligence and enhanced due diligence where appropriate.",
      "• Monitor account activity and transactions.",
      "• Request additional information regarding the source of funds or source of wealth.",
      "• Freeze or suspend accounts pending compliance reviews.",
      "• Reject, delay, or report transactions where required by applicable law.",
      "Users agree not to use the Platform for any illegal purpose, including but not limited to money laundering, fraud, financing terrorism, market manipulation, or the concealment of criminal proceeds.",
    ],
  },
  {
    icon: IdCard,
    title: "11. User Responsibilities",
    content: [
      "Users agree to:",
      "• Maintain the confidentiality of their login credentials.",
      "• Provide accurate and current information.",
      "• Immediately notify HARBORFORGE of unauthorized account access.",
    ],
  },
  {
    icon: Coins,
    title: "12. Prohibited Activities",
    content: [
      "Users shall not:",
      "• Create multiple accounts for fraudulent purposes.",
      "• Submit false or misleading information.",
      "• Use stolen, hacked, or unauthorized cryptocurrency.",
      "• Engage in money laundering or terrorist financing.",
      "• Circumvent security measures.",
      "• Attempt unauthorized access to servers, databases, or systems.",
      "• Distribute malware or malicious software.",
      "• Manipulate investment results or Platform functionality.",
      "• Abuse referral programs or promotional offers.",
      "• Use automated bots without written authorization.",
      "• Infringe intellectual property rights.",
      "• Interfere with other users' enjoyment of the Platform.",
      "Violation of this Article may result in immediate account suspension or termination without prior notice.",
    ],
  },
  {
    icon: Clock,
    title: "13. Fees",
    content: [
      "Certain services may be subject to fees, including but not limited to:",
      "• Withdrawal processing fees.",
      "• Blockchain network fees.",
      "Applicable fees shall be disclosed through the Platform before confirmation of any transaction.",
      "HARBORFORGE reserves the right to modify its fee schedule upon reasonable notice.",
    ],
  },
  {
    icon: Ban,
    title: "14. Taxes",
    content: [
      "Users acknowledge that cryptocurrency investments may give rise to tax obligations.",
      "Each user is solely responsible for determining, reporting, and paying any taxes applicable to their activities.",
      "HARBORFORGE does not provide tax advice.",
    ],
  },
  {
    icon: Gavel,
    title: "15. Suspension and Termination",
    content: [
      "HARBORFORGE may suspend, restrict, or terminate an account if it reasonably believes that the user has:",
      "• Violated these Terms.",
      "• Submitted false information.",
      "• Engaged in fraudulent activity.",
      "• Violated AML or sanctions requirements.",
      "• Attempted unauthorized access.",
      "• Used the Platform unlawfully.",
      "Termination shall not affect rights or obligations that accrued before termination.",
    ],
  },
  {
    icon: Cookie,
    title: "16. Intellectual Property",
    content: [
      "All content available on the Platform, including but not limited to:",
      "• trademarks;",
      "• logos;",
      "• software;",
      "• algorithms;",
      "• AI systems;",
      "• databases;",
      "• graphics;",
      "• documents;",
      "• text;",
      "• videos;",
      "• designs;",
      "• source code;",
      "is the exclusive property of HARBORFORGE or its licensors.",
      "Users receive a limited, non-exclusive, non-transferable license to use the Platform solely for its intended purpose.",
      "No ownership rights are transferred.",
    ],
  },
  {
    icon: Settings,
    title: "17. Confidentiality",
    content: [
      "Users agree not to disclose proprietary information obtained through the Platform, including confidential investment methodologies, business processes, software functionality, or security procedures.",
      "This obligation survives termination of the account.",
    ],
  },
  {
    icon: BarChart3,
    title: "18. Availability of Services",
    content: [
      "Although HARBORFORGE endeavors to provide uninterrupted service, the Platform may become unavailable due to:",
      "• system maintenance;",
      "• software upgrades;",
      "• network interruptions;",
      "• cybersecurity incidents;",
      "• blockchain congestion;",
      "• third-party service failures;",
      "• force majeure events.",
      "The Company does not guarantee uninterrupted availability but will never leave its users uninformed.",
    ],
  },
  {
    icon: ToggleLeft,
    title: "19. Third-Party Services",
    content: [
      "The Platform may integrate with third-party service providers, including blockchain networks, payment processors, wallet providers, and verification services.",
      "HARBORFORGE is not responsible for the products, services, or policies of third parties.",
      "Users interact with such services at their own risk.",
    ],
  },
  {
    icon: Share2,
    title: "20. Financial Advice",
    content: [
      "Information provided through the Platform is intended solely for informational purposes.",
      "The Platform also constitutes:",
      "• investment advice;",
      "• financial advice;",
      "• legal advice;",
      "• accounting advice;",
      "• professional advice.",
      "Users are allow to seek independent professional advice before making investment decisions.",
    ],
  },
  {
    icon: FileWarning,
    title: "21. Indemnification",
    content: [
      "Users agree to indemnify, defend, and hold harmless HARBORFORGE, its affiliates, officers, directors, employees, contractors, agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of or related to:",
      "• the user's breach of these Terms;",
      "• misuse of the Platform;",
      "• violation of applicable law;",
      "• infringement of third-party rights.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "22. Force Majeure",
    content: [
      "HARBORFORGE shall not be liable for any delay or failure in performance resulting from events beyond its reasonable control, including natural disasters, acts of government, armed conflict, civil unrest, labor disputes, pandemics, cyberattacks, failures of telecommunications networks, or blockchain-wide disruptions.",
    ],
  },
  {
    icon: XCircle,
    title: "23. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which HARBORFORGE is duly incorporated, except where mandatory consumer protection or financial services laws of another jurisdiction apply.",
    ],
  },
  {
    icon: Bug,
    title: "24. Dispute Resolution",
    content: [
      "The parties agree to attempt to resolve any dispute through good-faith negotiations.",
      "If a dispute cannot be resolved amicably, it shall be submitted to binding arbitration or the competent courts of the governing jurisdiction, unless applicable law provides otherwise.",
      "Nothing in this Article prevents either party from seeking interim or injunctive relief where necessary to protect legal rights.",
    ],
  },
  {
    icon: UserX,
    title: "25. Changes to These Terms",
    content: [
      "HARBORFORGE reserves the right to modify these Terms from time to time.",
      "Material changes will become effective upon publication on the Platform or after such notice as may be required by applicable law.",
      "Continued use of the Platform after the effective date of revised Terms constitutes acceptance of those revisions.",
    ],
  },
  {
    icon: Megaphone,
    title: "26. Severability",
    content: [
      "If any provision of these Terms is determined by a court or other competent authority to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.",
    ],
  },
  {
    icon: Globe,
    title: "27. Entire Agreement",
    content: [
      "These Terms, together with any policies incorporated by reference, constitute the entire agreement between the user and HARBORFORGE concerning the use of the Platform and supersede all prior communications, representations, and agreements relating to the subject matter.",
    ],
  },
  {
    icon: Bell,
    title: "28. Contact Information",
    content: [
      "Questions regarding these Terms may be directed to:",
      "HARBORFORGE Legal Department",
      "Website: [To Be Added]",
      "Email: [legal@yourdomain.com]",
      "Registered Office: [To Be Added Following Incorporation]",
      "By creating an account, accessing, or using the HARBORFORGE Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
    ],
  },
];

const Terms = () => (
  <LegalPage
    label="Legal"
    title="Terms of"
    highlight="Service"
    description="The agreement governing your access to and use of the HarborForge platform."
    effectiveDate="5th of May 2017"
    lastUpdated="12th of Feb 2026"
    sections={sections}
  />
);

export default Terms;
