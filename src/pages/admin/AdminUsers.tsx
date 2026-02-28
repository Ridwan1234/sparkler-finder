import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users, ChevronDown, ChevronUp, DollarSign, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

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

      const [{ data: deposits }, { data: withdrawals }, { data: investments }] = await Promise.all([
        supabase.from("deposits").select("user_id, amount, status").in("user_id", userIds),
        supabase.from("withdrawals").select("user_id, amount, status").in("user_id", userIds),
        supabase.from("investments").select("user_id, amount, status").in("user_id", userIds),
      ]);

      return profiles.map((profile): UserDetail => {
        const userDeposits = (deposits ?? []).filter((d) => d.user_id === profile.user_id && d.status === "approved");
        const userWithdrawals = (withdrawals ?? []).filter((w) => w.user_id === profile.user_id && w.status === "approved");
        const userInvestments = (investments ?? []).filter((i) => i.user_id === profile.user_id);
        const activeInvestments = userInvestments.filter((i) => i.status === "active");

        const totalDeposits = userDeposits.reduce((s, d) => s + Number(d.amount), 0);
        const totalWithdrawals = userWithdrawals.reduce((s, w) => s + Number(w.amount), 0);

        return {
          profile,
          deposits: { total: totalDeposits, count: userDeposits.length },
          withdrawals: { total: totalWithdrawals, count: userWithdrawals.length },
          investments: { active: activeInvestments.length, totalAmount: activeInvestments.reduce((s, i) => s + Number(i.amount), 0) },
          balance: totalDeposits - totalWithdrawals,
        };
      });
    },
  });

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
              {users?.map((u) => (
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
