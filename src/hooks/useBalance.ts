import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BalanceResult {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalBonuses: number;
  totalROI: number;
  totalPrincipalReturns: number;
  totalInvested: number;
  pendingWithdrawals: number;
  activeInvestments: number;
  isLoading: boolean;
}

/**
 * Shared hook for computing user balance.
 * Pass a userId to calculate for any user (admin use-case), 
 * or omit to use the current authenticated user.
 */
export function useBalance(userId: string | undefined): BalanceResult {
  const enabled = !!userId;

  const { data: deposits, isLoading: l1 } = useQuery({
    queryKey: ["deposits", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("deposits")
        .select("amount, status")
        .eq("user_id", userId!);
      return data ?? [];
    },
    enabled,
  });

  const { data: withdrawals, isLoading: l2 } = useQuery({
    queryKey: ["withdrawals_balance", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals")
        .select("amount, status")
        .eq("user_id", userId!);
      return data ?? [];
    },
    enabled,
  });

  const { data: transactions, isLoading: l3 } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", userId!);
      return data ?? [];
    },
    enabled,
  });

  const { data: investments, isLoading: l4 } = useQuery({
    queryKey: ["investments", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select("id, amount, status")
        .eq("user_id", userId!);
      return data ?? [];
    },
    enabled,
  });

  const totalDeposits = deposits?.filter(d => d.status === "approved").reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const totalWithdrawals = withdrawals?.filter(w => w.status === "approved").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const pendingWithdrawals = withdrawals?.filter(w => w.status === "pending").reduce((s, w) => s + Number(w.amount), 0) ?? 0;
  const totalBonuses = transactions?.filter(t => t.type === "bonus").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalReferralBonuses = transactions?.filter(t => t.type === "referral_bonus").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalROI = transactions?.filter(t => t.type === "roi").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalPrincipalReturns = transactions?.filter(t => t.type === "principal_return").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalInvested = transactions?.filter(t => t.type === "investment").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalSpotBuys = transactions?.filter(t => t.type === "spot_buy").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const totalSpotSells = transactions?.filter(t => t.type === "spot_sell").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const activeInvestments = investments?.filter(i => i.status === "active").reduce((s, i) => s + Number(i.amount), 0) ?? 0;

  const balance =
    totalDeposits +
    totalBonuses +
    totalReferralBonuses +
    totalROI +
    totalPrincipalReturns +
    totalSpotSells -
    totalWithdrawals -
    totalInvested -
    totalSpotBuys -
    pendingWithdrawals;

  return {
    balance,
    totalDeposits,
    totalWithdrawals,
    totalBonuses,
    totalROI,
    totalPrincipalReturns,
    totalInvested,
    pendingWithdrawals,
    activeInvestments,
    isLoading: l1 || l2 || l3 || l4,
  };
}
