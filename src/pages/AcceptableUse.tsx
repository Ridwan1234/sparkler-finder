import LegalPage from "@/components/legal/LegalPage";
import { Scale, Bug, UserX, Megaphone, Gavel } from "lucide-react";

const sections = [
  {
    icon: Scale,
    title: "1. Lawful Use",
    content: [
      "You may use HarborForge only for lawful purposes and in compliance with all applicable laws and regulations in your jurisdiction.",
      "You may not use the platform to facilitate fraud, money laundering, terrorist financing, or any other criminal activity.",
    ],
  },
  {
    icon: Bug,
    title: "2. Platform Integrity",
    content: [
      "You may not attempt to gain unauthorized access to the platform, other user accounts, or connected systems.",
      "Scraping, automated abuse, reverse engineering, denial-of-service attempts, and interference with platform operations are prohibited.",
    ],
  },
  {
    icon: UserX,
    title: "3. Account Misuse",
    content: [
      "Accounts must be registered with accurate information and used only by their owner. Sharing, selling, or transferring accounts is prohibited.",
      "Creating multiple accounts to abuse bonuses, referrals, or promotions is strictly forbidden.",
    ],
  },
  {
    icon: Megaphone,
    title: "4. Content & Communication",
    content: [
      "You may not post or transmit unlawful, abusive, misleading, or harassing content through any HarborForge channel.",
      "Impersonating HarborForge, its staff, or other users is prohibited.",
    ],
  },
  {
    icon: Gavel,
    title: "5. Enforcement",
    content: [
      "Violations may result in warnings, feature restrictions, suspension, or permanent termination of your account.",
      "We may report serious violations to the appropriate authorities and cooperate with investigations.",
    ],
  },
];

const AcceptableUse = () => (
  <LegalPage
    label="Policies"
    title="Acceptable Use"
    highlight="Policy"
    description="Rules governing how the HarborForge platform may be used."
    sections={sections}
  />
);

export default AcceptableUse;
