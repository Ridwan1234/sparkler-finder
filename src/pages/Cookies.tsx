import LegalPage from "@/components/legal/LegalPage";
import { Cookie, Settings, BarChart3, ToggleLeft } from "lucide-react";

const sections = [
  {
    icon: Cookie,
    title: "1. What Are Cookies",
    content: [
      "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and keep you signed in.",
      "We also use similar technologies such as local storage to support core platform functionality.",
    ],
  },
  {
    icon: Settings,
    title: "2. Essential Cookies",
    content: [
      "Essential cookies and local storage entries are required to authenticate your session, maintain security, and remember settings such as theme and language.",
      "These cannot be disabled without affecting the operation of the platform.",
    ],
  },
  {
    icon: BarChart3,
    title: "3. Analytics & Performance",
    content: [
      "We may use analytics technologies to understand how the platform is used so we can improve performance and usability.",
      "Analytics data is aggregated and is not used to identify you personally.",
    ],
  },
  {
    icon: ToggleLeft,
    title: "4. Managing Cookies",
    content: [
      "You can control or delete cookies through your browser settings at any time.",
      "Disabling cookies may prevent you from logging in or using certain features of HarborForge.",
    ],
  },
];

const Cookies = () => (
  <LegalPage
    label="Legal"
    title="Cookie"
    highlight="Policy"
    description="How HarborForge uses cookies and similar technologies."
    sections={sections}
  />
);

export default Cookies;
