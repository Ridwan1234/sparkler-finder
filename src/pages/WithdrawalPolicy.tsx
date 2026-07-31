import LegalPage from "@/components/legal/LegalPage";
import { AlertTriangle, Ban, BarChart3, Clock, Coins, Cookie, Database, Eye, FileText, Gavel, IdCard, Lock, Scale, Search, Settings, Shield, ShieldCheck, ToggleLeft, UserCheck, Wallet } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Purpose",
    content: [
      "This Withdrawal & Payout Policy (\"Policy\") explains the procedures governing withdrawals, profit distributions, payout processing, identity verification, applicable fees, and related requirements for users of the HARBORFORGE Platform (\"Platform\").",
      "By using the Platform, you agree to this Policy.",
    ],
  },
  {
    icon: Shield,
    title: "2. Eligibility for Withdrawals",
    content: [
      "To request a withdrawal, users must:",
      "• Maintain an active HARBORFORGE account.",
      "• Complete all required Know Your Customer (KYC) verification.",
      "• Comply with the Terms of Service and AML & KYC Policy.",
      "• Have sufficient available balance.",
      "• Meet the applicable conditions of their selected investment plan.",
      "HARBORFORGE reserves the right to refuse or delay withdrawals that do not satisfy these requirements.",
    ],
  },
  {
    icon: UserCheck,
    title: "3. Investment Maturity",
    content: [
      "Certain investment plans may require users to maintain their investment for a specified minimum period before withdrawal eligibility.",
      "Where an investment plan includes a lock-up or minimum holding period, withdrawals may not be available until the applicable conditions have been satisfied.",
      "Any restrictions applicable to a specific investment plan will be disclosed within that plan.",
    ],
  },
  {
    icon: Scale,
    title: "4. Withdrawal Requests",
    content: [
      "Withdrawal requests must be submitted through the official HARBORFORGE dashboard.",
      "Users are responsible for verifying:",
      "• Wallet address.",
      "• Blockchain network.",
      "• Withdrawal amount.",
      "• Destination wallet ownership, where applicable.",
      "Once a blockchain transaction has been broadcast, it generally cannot be reversed.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Identity Verification",
    content: [
      "For security and compliance purposes, HARBORFORGE requires successful KYC verification before processing withdrawals.",
      "Verification may include:",
      "• Government-issued identification.",
      "• Proof of address.",
      "• Selfie or biometric verification.",
      "• Additional documentation reasonably required for compliance or security.",
      "Users who fail to complete verification may have withdrawals delayed, restricted, or declined.",
    ],
  },
  {
    icon: Lock,
    title: "6. Security Review",
    content: [
      "To protect users and the Platform, withdrawal requests may be subject to security review.",
      "Security reviews may be conducted when:",
      "• A new withdrawal wallet is added.",
      "• Login activity appears unusual.",
      "• The withdrawal amount is unusually large.",
      "• Multiple failed login attempts are detected.",
      "• Suspicious account activity is identified.",
      "• Fraud prevention measures are triggered.",
      "During a security review, HARBORFORGE may request additional information before processing a withdrawal.",
    ],
  },
  {
    icon: Wallet,
    title: "7. Processing Times",
    content: [
      "HARBORFORGE aims to process eligible withdrawal requests as promptly as practicable.",
      "Processing times may vary depending on:",
      "• Completion of KYC verification.",
      "• Internal compliance reviews.",
      "• Blockchain network congestion.",
      "• Wallet maintenance.",
      "• Security checks.",
      "• Operational requirements.",
      "• Public holidays or weekends.",
      "• Events beyond HARBORFORGE's reasonable control.",
      "Estimated processing times displayed on the Platform are estimates only and are not guaranteed.",
    ],
  },
  {
    icon: Database,
    title: "8. Profit Distributions",
    content: [
      "Where applicable under the selected investment plan, eligible profit distributions may be made on a:",
      "• Biweekly basis; or",
      "• Monthly basis.",
      "Distribution schedules, calculation methods, and eligibility criteria will be specified within the applicable investment plan.",
      "Participation in an investment plan guarantee any particular investment outcome or return.",
    ],
  },
  {
    icon: Eye,
    title: "9. Withdrawal Fees",
    content: [
      "Withdrawal requests may be subject to:",
      "• Blockchain network fees.",
      "• Wallet transaction fees.",
      "• Platform processing fees, where applicable.",
      "Applicable fees will be disclosed to users before the withdrawal is confirmed.",
      "Fees may vary depending on the blockchain network or digital asset selected.",
    ],
  },
  {
    icon: Search,
    title: "10. Minimum Withdrawal Amounts",
    content: [
      "HARBORFORGE may establish minimum withdrawal thresholds for supported cryptocurrencies.",
      "Minimum withdrawal amounts will be displayed within the Platform and may be updated from time to time.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "11. Maximum Withdrawal Limits",
    content: [
      "For security, liquidity management, or compliance purposes, HARBORFORGE may establish daily, weekly, or monthly withdrawal limits.",
      "Where such limits apply, they will be communicated within the Platform.",
    ],
  },
  {
    icon: IdCard,
    title: "12. Incorrect Wallet Information",
    content: [
      "Users are solely responsible for ensuring that withdrawal instructions are accurate.",
      "HARBORFORGE shall not be responsible for losses arising from:",
      "• Incorrect wallet addresses.",
      "• Unsupported blockchain networks.",
      "• User input errors.",
      "• Wallet compatibility issues outside the Company's control.",
      "Cryptocurrency transactions are generally irreversible.",
    ],
  },
  {
    icon: Coins,
    title: "13. Compliance Delays",
    content: [
      "Withdrawals may be delayed where reasonably necessary to:",
      "• Complete compliance reviews.",
      "• Verify identity.",
      "• Investigate suspicious activity.",
      "• Respond to legal or regulatory obligations.",
      "• Protect the security of user accounts.",
      "HARBORFORGE will endeavor to process delayed withdrawals as soon as reasonably practicable once the relevant review is completed.",
    ],
  },
  {
    icon: Clock,
    title: "14. Refused Withdrawals",
    content: [
      "HARBORFORGE reserves the right to decline a withdrawal request where:",
      "• KYC requirements are not satisfied.",
      "• Fraud is suspected.",
      "• The account is subject to legal restrictions.",
      "• False information has been provided.",
      "• The withdrawal would violate applicable law.",
      "• The request breaches the Terms of Service or other Platform policies.",
      "Where legally permitted, HARBORFORGE may provide the user with the reason for the decision.",
    ],
  },
  {
    icon: Ban,
    title: "15. Dormant Accounts",
    content: [
      "Accounts that remain inactive for an extended period may be classified as dormant.",
      "Before applying any dormancy measures, HARBORFORGE will make reasonable efforts to contact the account holder using the contact information on file.",
      "Any applicable treatment of dormant accounts will be carried out in accordance with applicable law.",
    ],
  },
  {
    icon: Gavel,
    title: "16. Fraud Prevention",
    content: [
      "To protect all users, HARBORFORGE may implement fraud prevention measures including:",
      "• Transaction monitoring.",
      "• Device verification.",
      "• IP address analysis.",
      "• Blockchain analytics.",
      "• Multi-factor authentication.",
      "• Manual account review.",
      "These measures are designed to enhance the security of the Platform.",
    ],
  },
  {
    icon: Cookie,
    title: "17. Taxes",
    content: [
      "Users are solely responsible for determining and fulfilling any tax obligations associated with withdrawals or investment distributions.",
      "HARBORFORGE does not provide tax advice.",
    ],
  },
  {
    icon: Settings,
    title: "18. Amendments",
    content: [
      "HARBORFORGE reserves the right to amend this Policy from time to time.",
      "Material changes will be published on the Platform and will become effective as stated in the updated Policy or as otherwise required by applicable law.",
      "Continued use of the Platform after such changes constitutes acceptance of the revised Policy.",
    ],
  },
  {
    icon: BarChart3,
    title: "19. Contact Information",
    content: [
      "Questions regarding this Withdrawal & Payout Policy may be directed to:",
      "HARBORFORGE Finance & Compliance Department",
      "Website: [To Be Added]",
      "Email: withdrawals@[yourdomain].com",
      "Registered Office: [To Be Added Following Incorporation]",
    ],
  },
  {
    icon: ToggleLeft,
    title: "20. User Acknowledgment",
    content: [
      "By submitting a withdrawal request through the HARBORFORGE Platform, you acknowledge that you have read, understood, and agree to this Withdrawal & Payout Policy.",
    ],
  },
];

const WithdrawalPolicy = () => (
  <LegalPage
    label="Policies"
    title="Withdrawal & Payout"
    highlight="Policy"
    description="How withdrawal requests are reviewed, processed, and paid out."
    effectiveDate="5th of May 2017"
    lastUpdated="12th of Feb 2026"
    sections={sections}
  />
);

export default WithdrawalPolicy;
