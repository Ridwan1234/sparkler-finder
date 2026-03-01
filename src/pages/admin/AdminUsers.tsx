import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Users, ChevronDown, ChevronUp, DollarSign, TrendingUp, Search, Filter } from "lucide-react";

interface UserProfile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  referral_code: string | null;
  created_at: string;
}

interface UserDetail {
  profile: UserProfile;
  deposits: { total: number; count: number };
  withdrawals: { total: number; count: number };
  investments: { active: number; totalAmount: number };
  balance: number;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "balance_high" | "balance_low" | "deposits">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "has_investments" | "no_investments" | "positive_balance">("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profiles?.length) return [];

      const userIds = profiles.map((p) => p.user_id);

      const [{ data: deposits }, { data: withdrawals }, { data: investments }, { data: transactions }] = await Promise.all([
        supabase.from("deposits").select("user_id, amount, status").in("user_id", userIds),
        supabase.from("withdrawals").select("user_id, amount, status").in("user_id", userIds),
        supabase.from("investments").select("user_id, amount, status").in("user_id", userIds),
        supabase.from("transactions").select("user_id, amount, type").in("user_id", userIds),
      ]);

      return profiles.map((profile): UserDetail => {
        const userDeposits = (deposits ?? []).filter((d) => d.user_id === profile.user_id && d.status === "approved");
        const userWithdrawals = (withdrawals ?? []).filter((w) => w.user_id === profile.user_id && w.status === "approved");
        const userPendingWd = (withdrawals ?? []).filter((w) => w.user_id === profile.user_id && w.status === "pending");
        const userInvestments = (investments ?? []).filter((i) => i.user_id === profile.user_id);
        const activeInvestments = userInvestments.filter((i) => i.status === "active");
        const userTx = (transactions ?? []).filter((t) => t.user_id === profile.user_id);

        const totalDeposits = userDeposits.reduce((s, d) => s + Number(d.amount), 0);
        const totalWithdrawals = userWithdrawals.reduce((s, w) => s + Number(w.amount), 0);
        const pendingWithdrawals = userPendingWd.reduce((s, w) => s + Number(w.amount), 0);
        const totalBonuses = userTx.filter(t => t.type === "bonus").reduce((s, t) => s + Number(t.amount), 0);
        const totalROI = userTx.filter(t => t.type === "roi").reduce((s, t) => s + Number(t.amount), 0);
        const totalPR = userTx.filter(t => t.type === "principal_return").reduce((s, t) => s + Number(t.amount), 0);
        const totalInvested = userTx.filter(t => t.type === "investment").reduce((s, t) => s + Number(t.amount), 0);

        const balance = totalDeposits + totalBonuses + totalROI + totalPR - totalWithdrawals - totalInvested - pendingWithdrawals;

        return {
          profile,
          deposits: { total: totalDeposits, count: userDeposits.length },
          withdrawals: { total: totalWithdrawals, count: userWithdrawals.length },
          investments: { active: activeInvestments.length, totalAmount: activeInvestments.reduce((s, i) => s + Number(i.amount), 0) },
          balance,
        };
      });
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let result = users.filter((u) => {
      const q = searchQuery.toLowerCase();
      if (q && !(
        (u.profile.full_name?.toLowerCase().includes(q)) ||
        (u.profile.phone?.toLowerCase().includes(q)) ||
        (u.profile.referral_code?.toLowerCase().includes(q)) ||
        (u.profile.user_id.toLowerCase().includes(q))
      )) return false;

      if (filterBy === "has_investments" && u.investments.active === 0) return false;
      if (filterBy === "no_investments" && u.investments.active > 0) return false;
      if (filterBy === "positive_balance" && u.balance <= 0) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "balance_high": return b.balance - a.balance;
        case "balance_low": return a.balance - b.balance;
        case "deposits": return b.deposits.total - a.deposits.total;
        default: return new Date(b.profile.created_at).getTime() - new Date(a.profile.created_at).getTime();
      }
    });
    return result;
  }, [users, searchQuery, sortBy, filterBy]);

  const totalUsers = users?.length ?? 0;
  const totalBalance = users?.reduce((s, u) => s + u.balance, 0) ?? 0;
  const totalActiveInvestments = users?.reduce((s, u) => s + u.investments.active, 0) ?? 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        User Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-section-dark-foreground">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Total Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">${totalBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Active Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-section-dark-foreground">{totalActiveInvestments}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/5 border-border/10">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, referral code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/20"
              />
            </div>
            <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/20">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="has_investments">Has Investments</SelectItem>
                <SelectItem value="no_investments">No Investments</SelectItem>
                <SelectItem value="positive_balance">Positive Balance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="balance_high">Balance: High → Low</SelectItem>
                <SelectItem value="balance_low">Balance: Low → High</SelectItem>
                <SelectItem value="deposits">Most Deposits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            Showing {filteredUsers.length} of {totalUsers} users
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/10">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="text-muted-foreground">Balance</TableHead>
                <TableHead className="text-muted-foreground">Deposits</TableHead>
                <TableHead className="text-muted-foreground">Withdrawals</TableHead>
                <TableHead className="text-muted-foreground">Investments</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <>
                  <TableRow key={u.profile.user_id} className="border-border/10 cursor-pointer" onClick={() => setExpandedUser(expandedUser === u.profile.user_id ? null : u.profile.user_id)}>
                    <TableCell className="text-section-dark-foreground font-medium">
                      {u.profile.full_name || "No name"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(u.profile.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-primary font-medium">
                      ${u.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-section-dark-foreground">
                      ${u.deposits.total.toLocaleString()} ({u.deposits.count})
                    </TableCell>
                    <TableCell className="text-section-dark-foreground">
                      ${u.withdrawals.total.toLocaleString()} ({u.withdrawals.count})
                    </TableCell>
                    <TableCell className="text-section-dark-foreground">
                      {u.investments.active} active
                    </TableCell>
                    <TableCell>
                      {expandedUser === u.profile.user_id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedUser === u.profile.user_id && (
                    <TableRow key={`${u.profile.user_id}-detail`} className="border-border/10 bg-muted/5">
                      <TableCell colSpan={7}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Phone</p>
                            <p className="text-sm text-section-dark-foreground">{u.profile.phone || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Referral Code</p>
                            <p className="text-sm text-section-dark-foreground font-mono">{u.profile.referral_code || "None"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Active Investment Value</p>
                            <p className="text-sm text-primary font-medium">${u.investments.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
              {!users?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {isLoading ? "Loading users..." : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
