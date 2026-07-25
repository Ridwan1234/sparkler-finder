import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "get_balance",
  title: "Get my balance",
  description:
    "Return the signed-in user's current HarborForge balance, computed from their transactions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", ctx.getUserId());
    if (error) return errorResult(error.message);
    const balance = (data ?? []).reduce((sum, t: any) => {
      const amt = Number(t.amount) || 0;
      const isCredit = ["deposit", "roi", "referral", "credit"].includes(
        String(t.type ?? "").toLowerCase(),
      );
      return sum + (isCredit ? amt : -Math.abs(amt));
    }, 0);
    return textResult({ balance, transaction_count: data?.length ?? 0 });
  },
});
