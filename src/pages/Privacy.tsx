import LegalPage from "@/components/legal/LegalPage";
import { Eye, Database, Share2, Lock, UserCheck } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly, including your name, email address, phone number, country, wallet addresses, and identity verification documents.",
      "We also automatically collect technical data such as IP address, device information, browser type, and usage activity on the platform.",
    ],
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      "Your information is used to create and manage your account, process deposits and withdrawals, provide customer support, prevent fraud, and comply with legal obligations.",
      "We may send you service updates, transaction notifications, and — where permitted — marketing communications you can opt out of at any time.",
    ],
  },
  {
    icon: Share2,
    title: "3. Sharing & Disclosure",
    content: [
      "We do not sell your personal information. We share data only with service providers who help us operate the platform, and with authorities where required by law.",
      "Service providers are bound by confidentiality obligations and may only process data on our instructions.",
    ],
  },
  {
    icon: Lock,
    title: "4. Data Security & Retention",
    content: [
      "We apply industry-standard safeguards including encryption in transit, access controls, and monitoring. No online transmission method is fully secure.",
      "We retain personal data for as long as your account is active and thereafter as required to meet legal, tax, and regulatory obligations.",
    ],
  },
  {
    icon: UserCheck,
    title: "5. Your Rights",
    content: [
      "Depending on your jurisdiction, you may request access to, correction of, or deletion of your personal data, and object to certain processing.",
      "To exercise these rights, contact support@harborforge.org or use the settings available in your account profile.",
    ],
  },
];

const Privacy = () => (
  <LegalPage
    label="Legal"
    title="Privacy"
    highlight="Policy"
    description="How HarborForge collects, uses, protects, and shares your personal information."
    sections={sections}
  />
);

export default Privacy;
