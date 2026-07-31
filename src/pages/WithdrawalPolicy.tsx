import LegalPage from "@/components/legal/LegalPage";
import { Wallet, Clock, Coins, ShieldAlert, XCircle } from "lucide-react";

const sections = [
  {
    icon: Wallet,
    title: "1. Requesting a Withdrawal",
    content: [
      "Withdrawals are requested from your dashboard and are paid to the wallet address you provide. You are solely responsible for the accuracy of that address.",
      "Transactions sent to an incorrect address provided by the user cannot be reversed or recovered.",
    ],
  },
  {
    icon: Clock,
    title: "2. Processing Times",
    content: [
      "Withdrawal requests are reviewed before release. Standard processing is completed within the timeframe communicated in your dashboard.",
      "Processing may take longer during periods of high volume, network congestion, or when additional verification is required.",
    ],
  },
  {
    icon: Coins,
    title: "3. Limits & Fees",
    content: [
      "Minimum and maximum withdrawal amounts depend on your account status and selected plan.",
      "Applicable network or processing fees are disclosed before you confirm a withdrawal request.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "4. Verification & Holds",
    content: [
      "We may place a temporary hold on a withdrawal for security review, identity verification, or compliance checks.",
      "Pending withdrawals are deducted from your available balance until they are approved or cancelled.",
    ],
  },
  {
    icon: XCircle,
    title: "5. Cancellation & Rejection",
    content: [
      "A withdrawal request may be rejected if it violates these policies, our Terms of Service, or applicable law. Rejected amounts are returned to your available balance.",
      "Once a withdrawal has been processed on-chain, it cannot be cancelled.",
    ],
  },
];

const WithdrawalPolicy = () => (
  <LegalPage
    label="Policies"
    title="Withdrawal"
    highlight="Policy"
    description="How withdrawal requests are reviewed, processed, and paid out."
    sections={sections}
  />
);

export default WithdrawalPolicy;
