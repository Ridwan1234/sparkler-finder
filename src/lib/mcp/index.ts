import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import getBalance from "./tools/get-balance";
import listInvestmentPlans from "./tools/list-investment-plans";
import listMyInvestments from "./tools/list-my-investments";
import listMyDeposits from "./tools/list-my-deposits";
import listMyWithdrawals from "./tools/list-my-withdrawals";
import listMyTransactions from "./tools/list-my-transactions";

const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "harborforge-mcp",
  title: "HarborForge",
  version: "0.1.0",
  instructions:
    "Tools for HarborForge investors. Read the signed-in user's profile, balance, deposits, withdrawals, investments, and transactions, and browse available investment plans.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getProfile,
    getBalance,
    listInvestmentPlans,
    listMyInvestments,
    listMyDeposits,
    listMyWithdrawals,
    listMyTransactions,
  ],
});
