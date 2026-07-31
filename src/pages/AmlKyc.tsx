import LegalPage from "@/components/legal/LegalPage";
import { ShieldCheck, IdCard, Search, FileWarning, Ban } from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "1. Our Commitment",
    content: [
      "HarborForge is committed to preventing money laundering, terrorist financing, and any use of the platform for illicit purposes.",
      "We maintain internal controls, monitoring, and reporting procedures aligned with applicable anti-money laundering regulations.",
    ],
  },
  {
    icon: IdCard,
    title: "2. Know Your Customer (KYC)",
    content: [
      "Before certain account activity is enabled, users may be required to submit identity verification documents such as a government-issued ID, proof of address, and a selfie verification.",
      "Accounts that fail verification, or that submit false or altered documents, may be restricted or terminated.",
    ],
  },
  {
    icon: Search,
    title: "3. Transaction Monitoring",
    content: [
      "Deposits and withdrawals are monitored for unusual patterns, structuring, and other indicators of suspicious activity.",
      "We may request additional information regarding the source of funds before processing a transaction.",
    ],
  },
  {
    icon: FileWarning,
    title: "4. Reporting & Record Keeping",
    content: [
      "Suspicious activity may be reported to the relevant authorities without prior notice to the user, where required by law.",
      "Identification records and transaction history are retained for the period required under applicable regulations.",
    ],
  },
  {
    icon: Ban,
    title: "5. Prohibited Persons",
    content: [
      "We do not knowingly provide services to individuals or entities appearing on applicable sanctions lists, or residing in restricted jurisdictions.",
      "Any account found in breach of this policy may be frozen pending investigation.",
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
